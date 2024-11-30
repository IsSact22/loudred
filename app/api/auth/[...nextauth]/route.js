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
        usuario: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const connection = await getDatabaseConnection();

          // Buscar al usuario en la base de datos
          const [rows] = await connection.execute(
            "SELECT * FROM users WHERE usuario = ?",
            [credentials.usuario]
          );

          await connection.end();

          const user = rows[0];

          // Verificar si el usuario existe y si la contraseña es válida
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
                usuario: user.usuario,
                // roles: user.roles, // Opcional, agrega roles si los usas
              };
            } else {
              throw new Error("Credenciales inválidas");
            }
          } else {
            throw new Error("Usuario no encontrado");
          }
        } catch (error) {
          console.error("Error durante la autenticación:", error);
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
        token.usuario = user.usuario;
        // token.roles = user.roles; // Si planeas usar roles
      }
      return token;
    },
    async session({ session, token}) {
      session.user =  {
        id: token.id,
        name: token.name,
        lastname: token.lastname,
        usuario: token.usuario,
        // roles: token.roles, // Opcional
      };
      return session;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
