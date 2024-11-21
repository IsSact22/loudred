// app/api/auth/[...nextauth]/route.js
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

/* Next Auth */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Crear una conexión a la base de datos
          const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
          });

          // Buscar al usuario en la base de datos
          const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [credentials.email]
          );

          // Cerrar la conexión
          await connection.end();

          const user = rows[0];

          // Verificar si el usuario existe y la contraseña es correcta
          if (user) {
            const isValidPassword = await bcrypt.compare(credentials.password, user.password);

            if (isValidPassword) {
              // Retornar los datos del usuario
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                //roles: user.roles, // Asegúrate de parsear esto si es necesario
              };
            } else {
              throw new Error("Credenciales inválidas");
            }
          } else {
            throw new Error("Credenciales inválidas");
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
        token.email = user.email;
        token.name = user.name;
        //token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        email: token.email,
        name: token.name,
       // roles: token.roles;
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
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };