import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../lib/auth";

const prisma = new PrismaClient();

// GET: Buscar dados do perfil
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Verificar se é um assinante
    if (session.user.role !== "ASSINANTE") {
      return NextResponse.json(
        { error: "Acesso negado. Apenas assinantes podem acessar este recurso." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || userId !== session.user.id) {
      return NextResponse.json(
        { error: "Parâmetros inválidos" },
        { status: 400 }
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

    return NextResponse.json({ ...userProfile, ...metrics });
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
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Verificar se é um assinante
    if (session.user.role !== "ASSINANTE") {
      return NextResponse.json(
        { error: "Acesso negado. Apenas assinantes podem atualizar perfil." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, ...profileData } = body;

    if (!userId || userId !== session.user.id) {
      return NextResponse.json(
        { error: "Parâmetros inválidos" },
        { status: 400 }
      );
    }

    // Verificar se o perfil existe
    const existingProfile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!existingProfile) {
      // Se não existe, criar um novo
      await prisma.profile.create({
        data: {
          userId,
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
        where: { userId },
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
