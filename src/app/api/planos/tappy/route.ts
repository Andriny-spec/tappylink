import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Endpoint para buscar planos específicos para a plataforma TappyLink
 */
export async function GET(request: NextRequest) {
  try {
    // Buscar planos do banco de dados local
    const dbPlans = await prisma.plan.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        price: 'asc'
      }
    });

    // Converter para o formato esperado pela interface
    const plans = dbPlans.map(plan => ({
      id: plan.id,
      title: plan.name,
      price: `R$ ${Number(plan.price).toFixed(2).replace('.', ',')}`,
      installments: `6x de R$ ${(Number(plan.price) / 6).toFixed(2).replace('.', ',')}`,
      popular: plan.name.toLowerCase().includes('prata'),
      features: plan.features,
      originalPrice: plan.price
    }));

    // Retorna os planos
    return NextResponse.json(plans);

  } catch (error) {
    console.error("Erro ao buscar planos:", error);
    
    // Retorna um erro 503 (Serviço Indisponível) com uma mensagem amigável
    return NextResponse.json(
      { 
        error: true, 
        message: "Serviço de planos temporariamente indisponível. Tente novamente mais tarde."
      },
      { status: 503 }
    );
  }
}
