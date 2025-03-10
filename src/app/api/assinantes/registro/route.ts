import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role, SubscriptionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const dados = await request.json();
    const { email, password, name, planId } = dados;

    // Verificar se o email já está em uso
    const usuarioExistente = await prisma.user.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return new NextResponse(
        JSON.stringify({ erro: "Este email já está em uso" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verificar se o plano existe
    if (planId) {
      const planoExistente = await prisma.plan.findUnique({
        where: { id: planId }
      });

      if (!planoExistente) {
        return new NextResponse(
          JSON.stringify({ erro: "Plano não encontrado" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o usuário com o papel de ASSINANTE
    const novoUsuario = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.ASSINANTE
      }
    });

    // Criar o perfil do usuário
    await prisma.profile.create({
      data: {
        userId: novoUsuario.id,
        name: name || "",
        qrCodeId: novoUsuario.id // Usa o ID do usuário como QR code ID
      }
    });

    // Se foi informado um plano, criar a assinatura
    if (planId) {
      const dataHoje = new Date();
      
      // Buscar o plano para obter a duração
      const plano = await prisma.plan.findUnique({
        where: { id: planId }
      });
      
      // Calcular a data de expiração
      let dataExpiracao = null;
      if (plano) {
        dataExpiracao = new Date(dataHoje);
        dataExpiracao.setDate(dataExpiracao.getDate() + plano.durationDays);
      }

      // Criar a assinatura
      await prisma.subscription.create({
        data: {
          userId: novoUsuario.id,
          planId,
          status: SubscriptionStatus.ATIVA,
          startDate: dataHoje,
          endDate: dataExpiracao
        }
      });
    }

    return NextResponse.json({ 
      mensagem: "Assinante cadastrado com sucesso",
      id: novoUsuario.id
    }, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar assinante:", error);
    return new NextResponse(
      JSON.stringify({
        erro: "Erro ao cadastrar assinante",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
