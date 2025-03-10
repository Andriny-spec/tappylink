import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

// Configuração para o NextAuth v5 (beta)
export const { handlers: { GET, POST }, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // Verificação dos campos
        if (!credentials?.email || !credentials?.password) {
          console.log("Credenciais inválidas")
          return null;
        }

        try {
          // Busca o usuário pelo email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          // Verifica se o usuário existe
          if (!user) {
            console.log("Usuário não encontrado");
            return null;
          }

          // Verifica a senha
          const isValidPassword = await argon2.verify(
            user.password as string,
            credentials.password as string
          );

          // Se a senha for inválida
          if (!isValidPassword) {
            console.log("Senha incorreta");
            return null;
          }

          // Retorna os dados do usuário (exceto a senha)
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Erro ao autenticar:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // Adiciona campos do usuário ao token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Adiciona campos do token à sessão
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "tappyid-secret-key",
});




