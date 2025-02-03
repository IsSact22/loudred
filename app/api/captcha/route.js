import * as fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const imagesFolder = path.join(process.cwd(), 'public', 'dogs-and-muffins');

        // Obtener todas las imágenes
        const allImages = fs.readdirSync(imagesFolder).filter(file => file.endsWith('.png'));

        // Separar perros y muffins según el nombre del archivo
        const dogs = allImages.filter(file => file.startsWith('dog'));
        const muffins = allImages.filter(file => file.startsWith('muffin'));

        // Seleccionar aleatoriamente 9 imágenes (pueden ser perros o muffins)
        const selectedImages = [];
        while (selectedImages.length < 9) {
            const isDog = Math.random() < 0.5; // 50% de probabilidad de perro o muffin
            if (isDog && dogs.length > 0) {
                selectedImages.push({ name: dogs.pop(), isDog: true });
            } else if (muffins.length > 0) {
                selectedImages.push({ name: muffins.pop(), isDog: false });
            }
        }

        // Mezclar el orden de las imágenes
        selectedImages.sort(() => Math.random() - 0.5);

        // Devolver la lista de imágenes con las rutas correctas y su estado de "perro o no"
        return new Response(JSON.stringify({ 
            images: selectedImages.map(img => ({ url: `/dogs-and-muffins/${img.name}`, isDog: img.isDog }))
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error al generar el captcha:', error);
        return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
    }
}
