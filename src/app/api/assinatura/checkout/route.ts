import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

// Note: Em uma implementação completa, usaríamos getServerSession do next-auth
// mas para simplificar, vamos usar uma abordagem sem dependência do auth

const prisma = new PrismaClient();

/**
 * API para processo de checkout integrado com Tappy.id
 * 1. Cria uma conta para usuários não logados
 * 2. Registra intenção de assinatura 
 * 3. Retorna URL para checkout da Kirvano
 */
export async function POST(request: NextRequest) {
  try {
    // Simulação de sessão (na implementação real, usaríamos getServerSession)
    // Isso permite que o código funcione sem depender do next-auth
    const session: { user: { id?: string } | null } = { user: null };
    const data = await request.json();
    
    const { planId, email, name, phone } = data;
    
    if (!planId || !email) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }
    
    let userId: string | undefined = session?.user?.id;
    
    // Se não tem usuário logado, cria um novo ou recupera existente pelo email
    if (!userId) {
      const existingUser = await prisma.user.findUnique({ 
        where: { email },
        select: { id: true }
      });
      
      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Criar novo usuário
        // Usar o próprio email como senha inicial para facilitar o primeiro acesso
        const password = await argon2.hash(email);
        
        const newUser = await prisma.user.create({
          data: {
            email,
            password,
            role: "ASSINANTE",
            profile: {
              create: {
                name: name || email.split('@')[0],
                phone
              }
            }
          }
        });
        
        userId = newUser.id;
      }
    }
    
    // Verificar se já existe um perfil, caso contrário criar
    const userProfile = await prisma.profile.findUnique({
      where: { userId }
    });
    
    if (!userProfile) {
      await prisma.profile.create({
        data: {
          userId,
          name: name || email.split('@')[0],
          phone
        }
      });
    } else if (phone && !userProfile.phone) {
      // Atualizar telefone se não estiver preenchido
      await prisma.profile.update({
        where: { userId },
        data: { phone }
      });
    }
    
    // Obter URL de checkout da Kirvano via API do Tappy.id
    // Na implementação real, faria uma chamada para a API do Tappy.id
    // que retornaria a URL de checkout da Kirvano
    
    // Para este exemplo, simplesmente construímos uma URL
    const kirvanoCheckoutBaseUrl = "https://pay.kirvano.com/checkout";
    const checkoutUrl = `${kirvanoCheckoutBaseUrl}/${planId}?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name || '')}&user_id=${userId}`;
    
    // Criar registro da intenção de assinatura (opcional)
    // Na implementação real, registraria esta intenção no banco e/ou no Tappy.id
    
    return NextResponse.json({ 
      success: true, 
      checkoutUrl,
      message: "Redirecionando para checkout"
    });
    
  } catch (error) {
    console.error("Erro no processo de checkout:", error);
    return NextResponse.json({ 
      error: "Erro no processo de checkout", 
      details: error instanceof Error ? error.message : "Erro desconhecido" 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
