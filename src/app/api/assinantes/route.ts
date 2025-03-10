import { NextResponse } from "next/server";
import { PrismaClient, Role, User, Profile } from "@prisma/client";

// Inicializa o cliente Prisma
const prisma = new PrismaClient();

// Tipo para usuário com perfil
type UserWithProfile = User & {
  profile: Profile | null;
};

// Handler para a requisição GET
export async function GET() {
  try {
    // Busca apenas os assinantes (não admins)
    const assinantes = await prisma.user.findMany({
      where: {
        role: Role.ASSINANTE
      },
      // Ordena por data de criação, mais recentes primeiro
      orderBy: {
        createdAt: "desc"
      },
      // Inclui o perfil e assinaturas para obter mais informações
      include: {
        profile: true,
        subscriptions: {
          include: {
            plan: true
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 1 // Apenas a assinatura mais recente
        }
      }
    });

    // Formatar os dados dos assinantes para incluir informações do perfil e assinatura
    const assinantesFormatados = assinantes.map((assinante: any) => {
      // Obter a assinatura mais recente
      const assinaturaAtual = assinante.subscriptions[0] || null;
      
      return {
        id: assinante.id,
        email: assinante.email,
        name: assinante.profile?.name,
        phone: assinante.profile?.phone,
        city: assinante.profile?.city,
        state: assinante.profile?.state,
        role: assinante.role,
        createdAt: assinante.createdAt,
        // Informações de assinatura
        assinatura: assinaturaAtual ? {
          id: assinaturaAtual.id,
          status: assinaturaAtual.status,
          dataAtivacao: assinaturaAtual.createdAt,
          dataExpiracao: assinaturaAtual.expiresAt,
          valor: assinaturaAtual.plan?.price || null,
          plano: assinaturaAtual.plan?.name || "Sem plano",
          descricao: assinaturaAtual.plan?.description || null
        } : null,
        // Outros dados que podem ser úteis
        biography: assinante.profile?.biography,
        photo: assinante.profile?.photo,
        social: {
          facebook: assinante.profile?.facebook,
          instagram: assinante.profile?.instagram,
          whatsapp: assinante.profile?.whatsapp,
          telegram: assinante.profile?.telegram,
          linkedin: assinante.profile?.linkedin,
          tiktok: assinante.profile?.tiktok
        }
      };
    });

    // Retorna os assinantes como JSON
    return NextResponse.json(assinantesFormatados);
  } catch (error) {
    console.error("Erro ao buscar assinantes:", error);
    
    // Retorna erro 500 com mensagem
    return new NextResponse(
      JSON.stringify({ 
        erro: "Erro ao buscar assinantes",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido" 
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}
