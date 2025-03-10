import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const planos = await prisma.plan.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        price: "asc"
      }
    });
    
    return NextResponse.json(planos);
  } catch (error) {
    console.error("Erro ao buscar planos:", error);
    return new NextResponse(
      JSON.stringify({
        erro: "Erro ao buscar planos",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
