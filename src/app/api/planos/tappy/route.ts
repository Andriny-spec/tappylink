import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Endpoint para buscar planos do banco de dados do TappyLink
 * Uma solução REAL que funcionará sempre e se adaptará a mudanças nos planos
 */
export async function GET(request: NextRequest) {
  try {
    // Buscar planos do banco de dados do TappyLink
    const dbPlans = await prisma.plan.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        price: 'asc'
      }
    });

    // Se não houver planos no banco, isso significa que o seed não foi executado
    if (dbPlans.length === 0) {
      return NextResponse.json(
        { 
          error: true, 
          message: "Nenhum plano disponível no momento. Entre em contato com o suporte."
        },
        { status: 404 }
      );
    }

    // Mapear os planos para o formato esperado pelo frontend
    const plans = dbPlans.map(plan => ({
      id: plan.id,
      title: plan.name,
      price: `R$ ${Number(plan.price).toFixed(2).replace('.', ',')}`,
      installments: `6x de R$ ${(Number(plan.price) / 6).toFixed(2).replace('.', ',')}`,
      popular: plan.name.toLowerCase().includes('prata') || plan.name.toLowerCase().includes('profissional'),
      features: plan.features || [],
      originalPrice: Number(plan.price),
      checkoutUrl: `/checkout/${plan.id}`
    }));

    return NextResponse.json(plans);

  } catch (error) {
    console.error("Erro ao buscar planos:", error);
    
    // Retorna um erro 503
    return NextResponse.json(
      { 
        error: true, 
        message: "Serviço de planos temporariamente indisponível. Tente novamente mais tarde."
      },
      { status: 503 }
    );
  }
}
