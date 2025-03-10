import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST - Incrementar cliques
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type") || "link"; // tipo de clique (opcional)

    if (!userId) {
      return NextResponse.json(
        { message: "ID do usuário não fornecido" },
        { status: 400 }
      );
    }

    // Busca o usuário e incrementa os cliques
    const profile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Perfil não encontrado" },
        { status: 404 }
      );
    }

    // Incrementa a contagem de cliques
    await prisma.profile.update({
      where: { userId },
      data: {
        clicks: profile.clicks ? profile.clicks + 1 : 1,
        // Poderíamos armazenar estatísticas detalhadas por tipo de clique em uma tabela separada aqui
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao registrar clique:", error);
    return NextResponse.json(
      { message: "Erro ao registrar clique" },
      { status: 500 }
    );
  }
}
