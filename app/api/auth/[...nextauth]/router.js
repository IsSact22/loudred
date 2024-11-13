import axios from "axios";

/* Next Auth */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/* Utils */
import { endpoint } from "@/src/utils/helpers";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Realiza la solicitud a tu endpoint de autenticación
          const response = await axios.post($,{endpoint}/login, {
            email: credentials.email,
            password: credentials.password,
          });

          const user = response.data.data;

          // Si la autenticación es exitosa, devuelve los datos del usuario
          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              active: user.active,
              accessToken: user.token,
              roles: user.roles,
              permissions: user.permissions,
              last_login: new Date().toISOString(), // Establece como la hora actual
            };
          } else {
            throw new Error("Credenciales inválidas");
          }
        } catch (error) {
          console.error("Error durante la autenticación:", error);

          if (error.response) {
            if (error.response.status === 422) {
              // Extraer y formatear los mensajes de error desde "messages"
              const validationErrors = error.response.data.messages;
              const errorMessage = Object.values(validationErrors)
                .flat()
                .join(" ");
              throw new Error(errorMessage);
            } else if (error.response.status === 401) {
              throw new Error("Credenciales inválidas");
            }
          }
          throw new Error("Error de autenticación");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Inicio de sesión inicial
        token.email = user.email;
        token.name = user.name;
        token.active = user.active;
        token.accessToken = user.accessToken; // Guardamos el accessToken en el JWT
        token.roles = user.roles;
        token.permissions = user.permissions;
        token.last_login = user.last_login; // Añadir last_login
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        email: token.email,
        name: token.name,
        active: token.active,
        roles: token.roles,
        permissions: token.permissions,
        last_login: token.last_login, // Añadir last_login
      };
      // No pasamos el accessToken al cliente
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