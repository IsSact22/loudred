import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

/* Next Auth */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Centralizar configuración de base de datos
const getDatabaseConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
};

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const connection = await getDatabaseConnection();

          // Buscar al usuario con su rol
          const [rows] = await connection.execute(
            `SELECT User.id, User.name, User.lastname, User.username, User.password, role.id AS roleId, role.name AS roleName
             FROM User 
             JOIN role ON User.roleId = role.id
             WHERE User.username = ?`,
            [credentials.username]
          );

          await connection.end();

          const user = rows[0];

          // Validar existencia del usuario y la contraseña
          if (user) {
            const isValidPassword = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isValidPassword) {
              return {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                username: user.username,
                role: { id: user.roleId, name: user.roleName },
              };
            }
          }
          // Lanzar error genérico si algo falla
          throw new Error("Error de autenticación");
        } catch (error) {
          console.error("Error durante la autenticación:", error.message);
          throw new Error("Error de autenticación");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Asignar datos seguros al token
        token.id = user.id;
        token.name = user.name;
        token.lastname = user.lastname;
        token.username = user.username;
        token.role = user.role; // Si planeas usar roles
      }
      return token;
    },
    async session({ session, token}) {
      session.user =  {
        id: token.id,
        name: token.name,
        lastname: token.lastname,
        username: token.username,
        role: token.role, 
      };
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
