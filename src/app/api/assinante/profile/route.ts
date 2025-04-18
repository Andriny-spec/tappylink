import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

// GET: Buscar dados do perfil
export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  
  try {
    // Obter token JWT diretamente da requisição
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || "tappyid-secret-key"
    });
    
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    // Verificar se é um assinante
    if (token.role !== "ASSINANTE") {
      return NextResponse.json(
        { error: "Acesso negado. Apenas assinantes podem acessar este recurso." },
        { status: 403 }
      );
    }
    
    // Usar userId do token ou da query
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || token.sub;
    
    // Verificar se o usuário está tentando acessar seu próprio perfil
    if (userId !== token.sub) {
      return NextResponse.json(
        { error: "Você só pode acessar seu próprio perfil" },
        { status: 403 }
      );
    }



    // Buscar perfil do usuário
    const userProfile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "Perfil não encontrado" },
        { status: 404 }
      );
    }

    // Buscar métricas (em produção, isso viria de uma tabela separada)
    const metrics = {
      views: 0,
      shares: 0,
      clicks: 0
    };

    // Retornando o perfil no formato esperado pelo frontend
    return NextResponse.json({ profile: userProfile, metrics });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT: Atualizar dados do perfil
export async function PUT(request: NextRequest) {
  const prisma = new PrismaClient();
  
  try {
    // Obter token JWT diretamente da requisição
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || "tappyid-secret-key"
    });
    
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    // Verificar se é um assinante
    if (token.role !== "ASSINANTE") {
      return NextResponse.json(
        { error: "Acesso negado. Apenas assinantes podem atualizar perfil." },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { userId, ...profileData } = body;
    
    // Garantir que o usuário só pode atualizar seu próprio perfil
    const userIdToUse = token.sub;
    
    if (userId && userId !== userIdToUse) {
      return NextResponse.json(
        { error: "Você só pode atualizar seu próprio perfil" },
        { status: 403 }
      );
    }

    // Verificar se o perfil existe
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: userIdToUse }
    });

    if (!existingProfile) {
      // Se não existe, criar um novo
      await prisma.profile.create({
        data: {
          userId: userIdToUse,
          name: profileData.name || "",
          biography: profileData.biography || "",
          photo: profileData.photo || "",
          phone: profileData.phone || "",
          address: profileData.address || "",
          city: profileData.city || "",
          state: profileData.state || "",
          facebook: profileData.facebook || "",
          instagram: profileData.instagram || "",
          linkedin: profileData.linkedin || "",
          whatsapp: profileData.whatsapp || "",
          telegram: profileData.telegram || "",
          tiktok: profileData.tiktok || "",
        }
      });
    } else {
      // Se existe, atualizar
      await prisma.profile.update({
        where: { userId: userIdToUse },
        data: {
          name: profileData.name,
          biography: profileData.biography,
          photo: profileData.photo,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          facebook: profileData.facebook,
          instagram: profileData.instagram,
          linkedin: profileData.linkedin,
          whatsapp: profileData.whatsapp,
          telegram: profileData.telegram,
          tiktok: profileData.tiktok,
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
