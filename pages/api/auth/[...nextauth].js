import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

// Instância do PrismaClient
const prisma = new PrismaClient();

// Configuração simplificada do NextAuth
const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credenciais',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        try {
          // Buscar usuário pelo email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { profile: true }
          });

          // Verificar se o usuário existe
          if (!user) {
            throw new Error('Email ou senha incorretos');
          }

          // Verificar senha
          const isPasswordValid = await argon2.verify(
            user.password, 
            credentials.password
          );

          if (!isPasswordValid) {
            throw new Error('Email ou senha incorretos');
          }

          // Retornar usuário para criar a sessão
          return {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.profile?.name || user.email.split('@')[0],
            profileId: user.profile?.id
          };
        } catch (error) {
          console.error('Erro na autenticação:', error);
          throw new Error(error.message || 'Falha na autenticação');
        } finally {
          // Desconectar do banco após operação
          await prisma.$disconnect();
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profileId = user.profileId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.profileId = token.profileId;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Garantir redirecionamento para URLs internas
      if (url.startsWith('/')) {
        // Se o URL começar com '/', é uma URL relativa
        return `${baseUrl}${url}`;
      } else if (url.startsWith(baseUrl)) {
        // Se o URL já tiver o baseUrl, retorne-o diretamente
        return url;
      }
      // Redirecionar para a página padrão
      return '/assinante/meu-perfil';
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login' // Página de erro redirecionará para login
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "tappyid-super-secure-secret-key",
  debug: process.env.NODE_ENV === 'development'
};

// Exporta o handler principal do NextAuth
export default NextAuth(authOptions);
