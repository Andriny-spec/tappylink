import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST - Incrementar visualizações
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "ID do usuário não fornecido" },
        { status: 400 }
      );
    }

    // Busca o usuário e incrementa as visualizações
    const profile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Perfil não encontrado" },
        { status: 404 }
      );
    }

    // Incrementa a contagem de visualizações
    await prisma.profile.update({
      where: { userId },
      data: {
        views: profile.views ? profile.views + 1 : 1
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao registrar visualização:", error);
    return NextResponse.json(
      { message: "Erro ao registrar visualização" },
      { status: 500 }
    );
  }
}
