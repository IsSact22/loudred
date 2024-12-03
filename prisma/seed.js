import { users } from "./users.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { categorias } from "./categorias.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.users.deleteMany();
  console.log("Tabla 'users' limpiada.");

  for (let user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Crea el usuario con la contraseña hasheada en la base de datos
    await prisma.users.create({
      data: {
        name: user.name,
        lastname: user.lastname,
        usuario: user.usuario,
        // email: user.email,
        password: hashedPassword, // Guarda la contraseña hasheada
      },
    });
    console.log(`Usuario ${user.name} registrado.`);
  }
  for (let categoria of categorias){
    await prisma.categorias.create({
      data:{
        nombre:categoria.nombre
      }
    })
    console.log(`Categoria ${categoria.nombre} registrada.`);

  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
