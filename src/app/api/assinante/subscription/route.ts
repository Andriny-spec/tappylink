import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

// GET: Buscar dados da assinatura
export async function GET(request: NextRequest) {
  try {
    // Obter token JWT diretamente da requisição
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || "tappyid-secret-key"
    });
    
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    // Verificar se é um assinante
    if (token.role !== "ASSINANTE") {
      return NextResponse.json(
        { error: "Acesso negado. Apenas assinantes podem acessar este recurso." },
        { status: 403 }
      );
    }
    
    // Usar userId do token
    const userId = token.sub;

    // Buscar assinatura ativa do usuário utilizando SQL via Prisma
    const activeSubscriptions = await prisma.$queryRaw`
      SELECT s.id, s.status, s."startDate", s."endDate", s."autoRenew",
             p.name as "planName", p.description as "planDescription", p.features
      FROM "subscriptions" s
      JOIN "plans" p ON s."planId" = p.id
      WHERE s."userId" = ${userId}
      AND s.status IN ('ATIVA', 'TRIAL')
      ORDER BY s."endDate" DESC
      LIMIT 1
    `;
    
    // Cast do resultado da query para array
    const subscriptions = activeSubscriptions as any[];
    
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma assinatura ativa encontrada" },
        { status: 404 }
      );
    }

    const subscription = subscriptions[0];
    
    // Formatando a resposta
    const response = {
      id: subscription.id,
      planName: subscription.planName,
      planDescription: subscription.planDescription,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      autoRenew: subscription.autoRenew,
      features: subscription.features || [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro ao buscar assinatura:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
