import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Middleware de autenticação para NextAuth v5
export async function middleware(req: NextRequest) {
  console.log('Middleware executando para:', req.nextUrl.pathname);
  
  try {
    // Usar o getToken com o segredo definido explicitamente
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET || "tappyid-secret-key" 
    })
    
    if (token) {
      console.log('Token encontrado, role:', token.role);
    }
    
    // Obter o caminho da URL
    const { pathname } = req.nextUrl
    
    // Verificar se o usuário está autenticado
    if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/assinante'))) {
      console.log('Bloqueando acesso: usuário não autenticado');
      
      // Redirecionar para a página de login
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  } catch (error) {
    console.error('Erro no middleware:', error);
    // Em caso de erro, permitir o acesso e tratar a autorização na página
  }
  
  // Permitir o acesso
  return NextResponse.next()
}

// Configurar quais caminhos o middleware deve ser executado
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/assinante/:path*',
  ],
}
