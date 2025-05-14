import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Apenas uma instância do PrismaClient deve existir
const prisma = new PrismaClient();

// Configuração principal do NextAuth
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credenciais',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) {
          console.log('Nenhuma credencial fornecida');
          return null;
        }
        const { email, password } = credentials;
        console.log('Tentativa de login para:', email);
        
        try {
          // Busca usuário no banco
          console.log('Buscando usuário no banco:', email);
          const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true }
          });
          
          if (!user) {
            console.log('Usuário não encontrado:', email);
            return null;
          }
          
          console.log('Usuário encontrado, verificando senha');
          
          // Verifica senha
          try {
            const passwordValid = await argon2.verify(
              user.password,
              password
            );
            
            console.log('Senha válida?', passwordValid);
            
            if (!passwordValid) {
              console.log('Senha inválida para:', email);
              return null;
            }
            
            console.log('Login bem-sucedido para:', email);
            
            // Retorna dados do usuário para sessão (corrigido para usar os campos existentes)
            return {
              id: user.id,
              email: user.email,
              role: user.role,
              // Usar o nome do perfil se disponível
              name: user.profile?.name || email.split('@')[0],
              profileId: user.profile?.id || null
            };
          } catch (verifyError) {
            console.error('Erro ao verificar senha:', verifyError);
            return null;
          }
        } catch (error) {
          console.error('Erro ao buscar usuário:', error);
          return null;
        } finally {
          await prisma.$disconnect();
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profileId = user.profileId;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        // Garantir que o nome seja sempre definido
        if (token.name) {
          session.user.name = token.name as string;
        }
        // Adicionar profileId à sessão
        session.user.profileId = token.profileId as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};

// Exportar handlers para o App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
