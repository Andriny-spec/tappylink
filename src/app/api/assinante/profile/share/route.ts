import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST - Incrementar compartilhamentos
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

    // Busca o usuário e incrementa os compartilhamentos
    const profile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Perfil não encontrado" },
        { status: 404 }
      );
    }

    // Incrementa a contagem de compartilhamentos
    await prisma.profile.update({
      where: { userId },
      data: {
        shares: profile.shares ? profile.shares + 1 : 1
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao registrar compartilhamento:", error);
    return NextResponse.json(
      { message: "Erro ao registrar compartilhamento" },
      { status: 500 }
    );
  }
}
