// // src/components/Captcha.js
// "use client";

// import { useEffect, useState } from "react";
// import { toast } from 'react-hot-toast';

// export default function Captcha({ onSuccess }) {
//   const [selectedImages, setSelectedImages] = useState(new Set());
//   const [images, setImages] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchCaptchaImages = async () => {
//       try {
//         const response = await fetch('/api/captcha');
//         const data = await response.json();
//         setImages(data.images);
//         setIsLoading(false);
//       } catch (error) {
//         toast.error('Error al cargar el captcha.');
//       }
//     };
//     fetchCaptchaImages();
//   }, []);

//   const handleImageClick = (index) => {
//     setSelectedImages(prev => {
//       const newSelected = new Set(prev);
//       if (newSelected.has(index)) {
//         newSelected.delete(index);
//       } else {
//         newSelected.add(index);
//       }
//       return newSelected;
//     });
//   };

//   const handleSubmit = () => {
//     const correctSelections = images.filter((img, index) => img.isDog && selectedImages.has(index));
//     if (correctSelections.length === images.filter(img => img.isDog).length) {
//       onSuccess(); // Llamar a la función de éxito pasada por el padre
//     } else {
//       toast.error('Selecciona solo los perros.');
//     }
//   };

//   return (
//     <div className="captcha">
//       <h2>Selecciona los perritos :3</h2>
//       <div className="captcha-images grid grid-cols-3 gap-2">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             onClick={() => handleImageClick(index)}
//             className={`border border-red-600 flex items-center justify-center ${selectedImages.has(index) ? 'bg-blue-500' : ''}`}
//           >
//             <img
//               src={image.url}
//               alt={`Imagen ${index + 1}`}
//               className="max-w-full max-h-full object-contain"
//             />
//           </div>
//         ))}
//       </div>
//       <button onClick={handleSubmit} className="mt-4 p-4 bg-green-500 text-white rounded">
//         Verificar
//       </button>
//     </div>
//   );
// }
