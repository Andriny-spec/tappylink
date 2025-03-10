import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Exportamos as definições necessárias para o Next.js 15
export type Params = { id: string };

// GET - Obter um assinante específico pelo ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const assinante = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        subscriptions: {
          include: {
            plan: true
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 1
        }
      }
    });

    if (!assinante) {
      return new NextResponse(
        JSON.stringify({ erro: "Assinante não encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return NextResponse.json(assinante);
  } catch (error) {
    console.error("Erro ao buscar assinante:", error);
    return new NextResponse(
      JSON.stringify({
        erro: "Erro ao buscar assinante",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// PUT - Atualizar um assinante
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const dados = await request.json();

    // Verificar se o assinante existe
    const assinanteExistente = await prisma.user.findUnique({
      where: { id },
      include: { profile: true }
    });

    if (!assinanteExistente) {
      return new NextResponse(
        JSON.stringify({ erro: "Assinante não encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Atualizar o perfil do assinante (se existir) ou criar um novo
    if (assinanteExistente.profile) {
      await prisma.profile.update({
        where: { id: assinanteExistente.profile.id },
        data: {
          name: dados.name,
          phone: dados.phone,
          city: dados.city,
          state: dados.state,
          biography: dados.biography,
        }
      });
    } else {
      await prisma.profile.create({
        data: {
          userId: id,
          name: dados.name || "",
          phone: dados.phone,
          city: dados.city,
          state: dados.state,
          biography: dados.biography,
          qrCodeId: dados.qrCodeId || id, // Usa o ID do usuário como QR code ID padrão
        }
      });
    }

    return NextResponse.json({ 
      mensagem: "Assinante atualizado com sucesso",
      id
    });
  } catch (error) {
    console.error("Erro ao atualizar assinante:", error);
    return new NextResponse(
      JSON.stringify({
        erro: "Erro ao atualizar assinante",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// DELETE - Excluir um assinante
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Verificar se o assinante existe
    const assinante = await prisma.user.findUnique({
      where: { id }
    });

    if (!assinante) {
      return new NextResponse(
        JSON.stringify({ erro: "Assinante não encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Excluir o assinante (e todos os registros relacionados devido às cascades)
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ 
      mensagem: "Assinante excluído com sucesso",
      id 
    });
  } catch (error) {
    console.error("Erro ao excluir assinante:", error);
    return new NextResponse(
      JSON.stringify({
        erro: "Erro ao excluir assinante",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
