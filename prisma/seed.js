const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { users } = require('./users.js');
const { categorias } = require('./categorias.js');
const { roles } = require('./roles.js');

const prisma = new PrismaClient();

async function main() {
  // Limpieza de tablas en orden correcto
  await prisma.categorias.deleteMany();
  console.log("Tabla 'categorias' limpiada.");
  
  await prisma.users.deleteMany();
  console.log("Tabla 'users' limpiada.");

  await prisma.role.deleteMany();
  console.log("Tabla 'role' limpiada.");

  // Inserción de roles
  for (let role of roles) {
    await prisma.role.create({
      data: {
        name: role.name,
      },
    });
    console.log(`Rol ${role.name} registrado.`);
  }

  // Obtén los roles para asignarlos a los usuarios
  const userRole = await prisma.role.findUnique({ where: { name: "USER" } });
  const superAdminRole = await prisma.role.findUnique({ where: { name: "SUPERADMIN" } });

  // Inserción de usuarios
  for (let user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.users.create({
      data: {
        name: user.name,
        lastname: user.lastname,
        usuario: user.usuario,
        password: hashedPassword,
        roleId: user.role === "SUPERADMIN" ? superAdminRole.id : userRole.id,
      },
    });
    console.log(`Usuario ${user.name} registrado con el rol ${user.role}.`);
  }

  // Inserción de categorías
  for (let categoria of categorias) {
    await prisma.categorias.create({
      data: {
        nombre: categoria.nombre,
      },
    });
    console.log(`Categoría ${categoria.nombre} registrada.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
