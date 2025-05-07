import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Endpoint de webhook para processar notificações de pagamento da Kirvano
 * Quando um pagamento é confirmado, atualizamos o status premium do usuário
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar assinatura webhook (em produção, você deve validar a origem)
    const webhookSecret = process.env.KIRVANO_WEBHOOK_SECRET;
    
    // Obter dados do webhook
    const data = await request.json();
    console.log("Webhook Kirvano recebido:", data);
    
    // Validar payload
    if (!data.event || !data.payment_id || !data.status || !data.user_id) {
      console.error("Payload de webhook inválido:", data);
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }
    
    // Processar pagamento aprovado
    if (data.event === "payment.confirmed" && data.status === "approved") {
      // Atualizar usuário para premium no TappyLink
      const userId = data.user_id;
      
      // Em um caso real, você também registraria o pagamento no banco
      // Aqui apenas atualizamos o usuário como premium
      
      // Verificar se o usuário existe
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });
      
      if (!user) {
        console.error("Usuário não encontrado:", userId);
        return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
      }
      
      // Verificar se o perfil existe
      if (!user.profile) {
        console.error("Perfil não encontrado para o usuário:", userId);
        return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
      }
      
      // Como não temos o campo premium ainda no banco, vamos usar uma solução alternativa
      // Vamos adicionar um prefixo [PREMIUM] ao nome para identificar usuários premium
      // E também usamos o campo biografia para armazenar informações de pagamento
      
      // Obter o nome atual
      const currentName = user.profile.name || "";
      const isPremiumAlready = currentName.includes("[PREMIUM]");
      
      // Atualizar o perfil apenas se ainda não é premium
      if (!isPremiumAlready) {
        await prisma.profile.update({
          where: { id: user.profile.id },
          data: {
            // Adicionar marcação de premium ao nome
            name: `[PREMIUM] ${currentName.replace("[PREMIUM] ", "")}`,
            
            // Adicionar informações de pagamento na biografia
            biography: `${user.profile.biography || ""}

Conta Premium ativada em ${new Date().toLocaleDateString()}. ID Pagamento: ${data.payment_id}`
          }
        });
      }
      
      console.log(`Usuário ${userId} atualizado para premium.`);
      
      return NextResponse.json({ 
        success: true, 
        message: "Pagamento processado com sucesso"
      });
    }
    
    // Processar outros eventos (cancelamento, reembolso, etc)
    if (data.event === "payment.refunded" || data.event === "payment.cancelled") {
      // Em uma implementação completa, você revogaria o status premium
      console.log(`Pagamento ${data.payment_id} para usuário ${data.user_id} foi ${data.status}`);
    }
    
    // Responder que recebemos o webhook
    return NextResponse.json({ 
      success: true, 
      message: `Evento ${data.event} recebido`
    });
    
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json({ 
      error: "Erro ao processar webhook", 
      details: error instanceof Error ? error.message : "Erro desconhecido" 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
