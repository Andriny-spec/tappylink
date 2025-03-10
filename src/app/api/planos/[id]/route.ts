import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Buscar um plano específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const plano = await prisma.plan.findUnique({
      where: { id },
    });
    
    if (!plano) {
      return new NextResponse(
        JSON.stringify({ erro: "Plano não encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    
    return NextResponse.json(plano);
  } catch (error) {
    console.error("Erro ao buscar plano:", error);
    return new NextResponse(
      JSON.stringify({
        erro: "Erro ao buscar plano",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Atualizar um plano
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    
    // Verificar se o plano existe
    const planoExistente = await prisma.plan.findUnique({
      where: { id },
    });
    
    if (!planoExistente) {
      return new NextResponse(
        JSON.stringify({ erro: "Plano não encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Validar dados recebidos
    if (!data.name || !data.description || data.price === undefined || !data.features || !data.durationDays) {
      return new NextResponse(
        JSON.stringify({ erro: "Campos obrigatórios faltando" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Atualizar o plano
    const planoAtualizado = await prisma.plan.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice || null,
        durationDays: data.durationDays,
        features: data.features,
        isPopular: data.isPopular !== undefined ? data.isPopular : planoExistente.isPopular,
        isActive: data.isActive !== undefined ? data.isActive : planoExistente.isActive,
        updatedAt: new Date(),
      },
    });
    
    return NextResponse.json(planoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar plano:", error);
    return new NextResponse(
      JSON.stringify({
        erro: "Erro ao atualizar plano",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Excluir um plano
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Verificar se o plano existe
    const planoExistente = await prisma.plan.findUnique({
      where: { id },
    });
    
    if (!planoExistente) {
      return new NextResponse(
        JSON.stringify({ erro: "Plano não encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Verificar se há assinaturas associadas a este plano
    const assinaturasAssociadas = await prisma.subscription.count({
      where: { planId: id },
    });
    
    if (assinaturasAssociadas > 0) {
      // Em vez de excluir, apenas marcar como inativo
      await prisma.plan.update({
        where: { id },
        data: { isActive: false },
      });
      
      return NextResponse.json({ 
        mensagem: "Plano marcado como inativo pois possui assinaturas associadas",
        inativado: true
      });
    }
    
    // Se não houver assinaturas, excluir permanentemente
    await prisma.plan.delete({
      where: { id },
    });
    
    return NextResponse.json({ 
      mensagem: "Plano excluído com sucesso",
      excluido: true
    });
  } catch (error) {
    console.error("Erro ao excluir plano:", error);
    return new NextResponse(
      JSON.stringify({
        erro: "Erro ao excluir plano",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
