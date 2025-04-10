// Arquivo de compatibilidade para NextAuth v4 no formato Pages Router
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

// Apenas uma instância do PrismaClient deve existir
const prisma = new PrismaClient();

export const authOptions = {
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
          console.log('Hash armazenado:', user.password.substring(0, 20) + '...');
          
          // Verifica senha
          try {
            const passwordValid = await argon2.verify(
              user.password,
              password
            );
            
            console.log('Resultado da verificação de senha:', passwordValid);
            
            if (!passwordValid) {
              console.log('Senha inválida para:', email);
              return null;
            }
          } catch (error) {
            console.error('Erro ao verificar senha:', error);
            return null;
          }
          
          // Retorna dados do usuário
          console.log('Login bem-sucedido para:', email);
          return {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.profile?.name || 'Usuário'
          };
        } catch (error) {
          console.error('Erro na autenticação:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};

// Exporta o handler principal do NextAuth
export default NextAuth(authOptions);
