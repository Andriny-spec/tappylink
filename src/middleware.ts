import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Middleware de autenticação para NextAuth v4
export async function middleware(req: NextRequest) {
  console.log('Middleware executando para:', req.nextUrl.pathname);
  
  try {
    // Verificar cookies para determinação mais direta de sessão
    const hasSessionToken = req.cookies.has('next-auth.session-token') || 
                           req.cookies.has('__Secure-next-auth.session-token');
    
    // Verificar JWT token como backup
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET || "tappyid-secret-key",
      secureCookie: process.env.NODE_ENV === 'production'
    });
    
    const isAuthenticated = hasSessionToken || !!token;
    
    if (token) {
      console.log('Token JWT encontrado, role:', token.role);
    } else if (hasSessionToken) {
      console.log('Cookie de sessão encontrado, permitindo acesso');
    }
    
    // Obter o caminho da URL
    const { pathname } = req.nextUrl
    
    // Áreas protegidas
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/assinante');
    
    // Verificar se o usuário está autenticado para rotas protegidas
    if (!isAuthenticated && isProtectedRoute) {
      console.log('Bloqueando acesso: usuário não autenticado em rota protegida');
      
      // Redirecionar para a página de login com callback
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Se o usuário já está autenticado e tenta acessar login
    if (isAuthenticated && pathname === '/login') {
      console.log('Redirecionando usuário autenticado para dashboard');
      const redirectUrl = new URL('/assinante/meu-perfil', req.url)
      return NextResponse.redirect(redirectUrl)
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
