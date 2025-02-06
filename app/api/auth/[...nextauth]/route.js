import { Pool } from "pg";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Configurar conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT, // Asegúrate de definir este valor en .env (5432 por defecto)
});

// const getDatabaseConnection = async () => {
//   try {
//     return await pool.query(); // Devuelve una conexión al pool
//   } catch (error) {
//     console.error("Error conectando a PostgreSQL:", error);
//     throw new Error("No se pudo conectar a la base de datos");
//   }
// };
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        try {

          const { rows } = await pool.query(
              `SELECT 
               "User".id, 
               "User"."name", 
               "User".lastname, 
               "User".avatar, 
               "User"."username", 
               "User".password, 
               "role".id AS "roleId", 
               "role".name AS roleName
             FROM "User"
             JOIN "role" ON "User"."roleId" = "role"."id"
             WHERE "User"."username" = $1`,
            [credentials.username]
          );
          

          const user = rows[0];
          if (!user) {
            console.warn(`Usuario no encontrado: ${credentials.username}`);
            throw new Error("Usuario no encontrado");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            console.warn(
              `Contraseña inválida para usuario: ${credentials.username}`
            );
            throw new Error("Credenciales inválidas");
          }

          // Devuelve un objeto user para que NextAuth lo meta en el token
          return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            avatar: user.avatar,
            username: user.username,
            role: {
              id: user.roleId,
              name: user.roleName,
            },
          };
        } catch (error) {
          console.error("Error durante la autenticación:", error.message);
          throw new Error(error.message || "Error de autenticación");
        } 
      },
    }),
  ],

  callbacks: {
    // Se ejecuta al crear/actualizar el token JWT en el login
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        // Podríamos guardar estos campos por conveniencia,
        // pero no serán el source of truth final.
        // El "source of truth" será el callback session con DB.
      }
      return token;
    },

    // AQUÍ vuelve a leerse la DB para tener datos frescos
    async session({ session, token }) {
      try {
        // Consulta la DB para obtener el usuario más reciente
        const result = await pool.query(
          `SELECT 
             "User".id, 
             "User".name, 
             "User".avatar,
             "User".lastname, 
             "User"."username", 
             "role".id AS "roleId", 
             "role".name AS "roleName"
           FROM "User"
           JOIN "role" ON "User"."roleId" = "role"."id"
           WHERE "User"."id" = $1`,
          [token.id] // id que guardamos en el JWT
        );
        
 const rows = result.rows; 
        const dbUser = rows[0];
        if (!dbUser) {
          // Si no se encuentra, podría ser que el usuario haya sido borrado.
          // Manejar ese caso como convenga (forzar signOut, etc.).
          console.warn(`Usuario con ID ${token.id} no existe en DB`);
          return session;
        }

        // Sobrescribimos la session con los datos recién consultados
        session.user = {
          id: dbUser.id,
          name: dbUser.name,
          lastname: dbUser.lastname,
          avatar: dbUser.avatar,
          username: dbUser.username,
          role: {
            id: dbUser.roleId,
            name: dbUser.roleName,
          },
        };
      } catch (error) {
        console.error("Error al refrescar la sesión:", error);
      } finally {
        
      }

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
