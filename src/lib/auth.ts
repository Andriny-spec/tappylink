// Arquivo auxiliar para fornecer a função auth para ser usada em todo o projeto
import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

// IMPORTANTE: Não criar instâncias globais para evitar problemas com APIs dinâmicas do Next.js

// Esta função é um proxy para getServerSession que cria as opções dinamicamente
export async function auth() {
  // Criamos uma nova instância do PrismaClient a cada chamada
  // para evitar problemas com cookies e headers
  const prisma = new PrismaClient();
  
  try {
    // Criando opções de autenticação dinamicamente a cada chamada
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
            
            try {
              // Busca usuário no banco com tipagem correta
              const user = await prisma.user.findUnique({
                where: { email },
                include: { profile: true }
              });
                
              if (!user) return null;
              
              // Verifica senha
              try {
                const passwordValid = await argon2.verify(
                  user.password,
                  password
                );
                
                if (!passwordValid) {
                  return null;
                }
                
                // Retorna dados do usuário para sessão com dados formatados corretamente
                const userName = user.profile?.name || email.split('@')[0];
                
                return {
                  id: user.id,
                  name: userName,
                  email: user.email,
                  role: user.role,
                  profileId: user.profile?.id || null
                };
              } catch (verifyError) {
                console.error('Erro ao verificar senha:', verifyError);
                return null;
              }
            } catch (error) {
              console.error('Erro ao buscar usuário:', error);
              return null;
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
            session.user.id = token.id as string;
            session.user.role = token.role;
            session.user.profileId = token.profileId;
            session.user.name = token.name || '';
          }
          return session;
        }
      },
      pages: {
        signIn: '/login'
      },
      session: { strategy: "jwt" },
      secret: process.env.NEXTAUTH_SECRET || "tappyid-secret-key",
    };
    
    // Chama getServerSession com as opções recém-criadas
    return await getServerSession(authOptions);
  } finally {
    // Garante que o prisma seja desconectado após o uso
    await prisma.$disconnect();
  }
}
