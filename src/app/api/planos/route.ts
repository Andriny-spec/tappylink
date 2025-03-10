import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Listar todos os planos (para interface de administração, mostra todos os planos)
export async function GET(request: NextRequest) {
  try {
    // Ver se deve filtrar apenas ativos ou todos
    const searchParams = request.nextUrl.searchParams;
    const onlyActive = searchParams.get('active') === 'true';
    
    const planos = await prisma.plan.findMany({
      where: onlyActive ? { isActive: true } : {},
      orderBy: [
        { isPopular: 'desc' },
        { price: 'asc' }
      ],
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

// Criar um novo plano
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validar dados recebidos
    if (!data.name || !data.description || data.price === undefined || !data.features || !data.durationDays) {
      return new NextResponse(
        JSON.stringify({ erro: "Campos obrigatórios faltando" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Criar o plano no banco de dados
    const novoPlano = await prisma.plan.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice || null,
        durationDays: data.durationDays,
        features: data.features,
        isPopular: data.isPopular || false,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
    
    return NextResponse.json(novoPlano, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar plano:", error);
    return new NextResponse(
      JSON.stringify({
        erro: "Erro ao criar plano",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
