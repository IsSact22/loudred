import { users } from "./users.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.users.deleteMany();
  console.log("Tabla 'users' limpiada.");

  for (let u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);

    // Crea el usuario con la contraseña hasheada en la base de datos
    await prisma.users.create({
      data: {
        name: u.name,
        email: u.email,
        password: hashedPassword, // Guarda la contraseña hasheada
      },
    });
    console.log(`Usuario ${u.name} registrado.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
