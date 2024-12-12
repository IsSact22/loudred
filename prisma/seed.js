const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { User } = require('./users');
const { categories } = require('./categories.js');
const { roles } = require('./roles.js');

const prisma = new PrismaClient();

async function main() {
  // Limpieza de tablas en orden correcto
  await prisma.categories.deleteMany();
  console.log("Tabla 'categories' limpiada.");
  
  await prisma.User.deleteMany();
  console.log("Tabla 'User' limpiada.");

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

  // Obtén los roles para asignarlos a los usernames
  const userRole = await prisma.role.findUnique({ where: { name: "USER" } });
  const superAdminRole = await prisma.role.findUnique({ where: { name: "SUPERADMIN" } });

  // Inserción de usernames
  for (let user of User) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        lastname: user.lastname,
        username: user.username,
        password: hashedPassword,
        roleId: user.role === "SUPERADMIN" ? superAdminRole.id : userRole.id,
      },
    });
    console.log(`username ${user.name} registrado con el rol ${user.role}.`);
  }

  // Inserción de categorías
  for (let categoriess of categories) {
    await prisma.categories.create({
      data: {
        name: categoriess.name,
      },
    });
    console.log(`Categoría ${categoriess.name} registrada.`);
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
