import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Verificar autenticação
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Buscar todos os pedidos com informações do usuário e plano
    const pedidos = await prisma.$queryRaw<any[]>`
      SELECT o.*, u.email, p.name AS plan_name, pr.name AS profile_name
      FROM orders o
      LEFT JOIN users u ON o."userId" = u.id
      LEFT JOIN plans p ON o."planId" = p.id
      LEFT JOIN profiles pr ON u.id = pr."userId"
      ORDER BY o."createdAt" DESC
      LIMIT 100
    `;

    // Formatar os dados para o formato esperado pelo frontend
    const pedidosFormatados = pedidos.map(pedido => ({
      id: pedido.id,
      assinante: pedido.profile_name || pedido.email,
      plano: pedido.plan_name,
      valor: Number(pedido.amount),
      data: pedido.createdAt,
      status: pedido.paymentStatus,
      formaPagamento: traduzirMetodoPagamento(pedido.paymentMethod),
    }));

    return NextResponse.json(pedidosFormatados);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    );
  }
}

// Função auxiliar para traduzir o método de pagamento
function traduzirMetodoPagamento(metodo: string | null): string {
  switch (metodo) {
    case 'CARTAO_CREDITO':
      return 'Cartão de Crédito';
    case 'BOLETO':
      return 'Boleto';
    case 'PIX':
      return 'PIX';
    case 'TRANSFERENCIA':
      return 'Transferência Bancária';
    default:
      return 'Não especificado';
  }
}
