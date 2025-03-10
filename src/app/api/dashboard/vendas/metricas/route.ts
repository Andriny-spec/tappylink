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

    // Obtém data do início do mês atual e anterior
    const hoje = new Date();
    const inicioMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const inicioMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    const fimMesAnterior = new Date(inicioMesAtual.getTime() - 1);

    // Buscar pedidos do mês atual (aprovados)
    const pedidosMesAtual = await prisma.$queryRaw<any[]>`
      SELECT * FROM orders 
      WHERE "paymentStatus" = 'APROVADO' 
      AND "createdAt" >= ${inicioMesAtual}
    `;

    // Buscar pedidos do mês anterior (aprovados)
    const pedidosMesAnterior = await prisma.$queryRaw<any[]>`
      SELECT * FROM orders 
      WHERE "paymentStatus" = 'APROVADO' 
      AND "createdAt" >= ${inicioMesAnterior} 
      AND "createdAt" < ${inicioMesAtual}
    `;

    // Calcular total de vendas
    const totalMesAtual = pedidosMesAtual.reduce((total: number, pedido: any) => 
      total + Number(pedido.amount), 0);
    
    const totalMesAnterior = pedidosMesAnterior.reduce((total: number, pedido: any) => 
      total + Number(pedido.amount), 0);

    // Calcular ticket médio
    const ticketMedioAtual = pedidosMesAtual.length > 0 
      ? totalMesAtual / pedidosMesAtual.length 
      : 0;
    
    const ticketMedioAnterior = pedidosMesAnterior.length > 0 
      ? totalMesAnterior / pedidosMesAnterior.length 
      : 0;

    // Simplificando, vamos usar a contagem de perfis ativos para a taxa de conversão
    // Em uma implementação real, seria melhor usar uma tabela dedicada para visualizações
    const visualizacoesMesAtual = await prisma.$queryRaw<{count: string}[]>`SELECT COUNT(*) FROM profiles`;
    const vizCount = Number(visualizacoesMesAtual[0].count);
    const visualizacoesMesAnterior = Math.floor(vizCount * 0.85); // Simulação para demonstração

    // Calcular taxa de conversão (pedidos / visualizações * 100)
    const taxaConversaoAtual = vizCount > 0 
      ? (pedidosMesAtual.length / vizCount) * 100 
      : 0;
    
    const taxaConversaoAnterior = visualizacoesMesAnterior > 0 
      ? (pedidosMesAnterior.length / visualizacoesMesAnterior) * 100 
      : 0;

    // Buscar reembolsos do mês atual (contagem)
    const reembolsosMesAtualResult = await prisma.$queryRaw<{count: string}[]>`
      SELECT COUNT(*) FROM orders 
      WHERE "paymentStatus" = 'REEMBOLSADO' 
      AND "updatedAt" >= ${inicioMesAtual}
    `;
    const reembolsosMesAtual = Number(reembolsosMesAtualResult[0].count);
    
    // Buscar valor total dos reembolsos do mês atual
    const totalReembolsosResult = await prisma.$queryRaw<{sum: string}[]>`
      SELECT COALESCE(SUM(amount), 0) as sum FROM orders 
      WHERE "paymentStatus" = 'REEMBOLSADO' 
      AND "updatedAt" >= ${inicioMesAtual}
    `;
    const totalReembolsos = Number(totalReembolsosResult[0].sum || 0);

    // Buscar reembolsos do mês anterior
    const reembolsosMesAnteriorResult = await prisma.$queryRaw<{count: string}[]>`
      SELECT COUNT(*) FROM orders 
      WHERE "paymentStatus" = 'REEMBOLSADO' 
      AND "updatedAt" >= ${inicioMesAnterior} 
      AND "updatedAt" < ${inicioMesAtual}
    `;
    const reembolsosMesAnterior = Number(reembolsosMesAnteriorResult[0].count);

    // Calcular taxa de reembolso (reembolsos / total pedidos * 100)
    const totalPedidosMesAtualResult = await prisma.$queryRaw<{count: string}[]>`
      SELECT COUNT(*) FROM orders 
      WHERE "createdAt" >= ${inicioMesAtual}
    `;
    const totalPedidosMesAtual = Number(totalPedidosMesAtualResult[0].count);

    const totalPedidosMesAnteriorResult = await prisma.$queryRaw<{count: string}[]>`
      SELECT COUNT(*) FROM orders 
      WHERE "createdAt" >= ${inicioMesAnterior} 
      AND "createdAt" < ${inicioMesAtual}
    `;
    const totalPedidosMesAnterior = Number(totalPedidosMesAnteriorResult[0].count);

    const taxaReembolsoAtual = totalPedidosMesAtual > 0 
      ? (reembolsosMesAtual / totalPedidosMesAtual) * 100 
      : 0;
    
    const taxaReembolsoAnterior = totalPedidosMesAnterior > 0 
      ? (reembolsosMesAnterior / totalPedidosMesAnterior) * 100 
      : 0;

    // Calcular variações percentuais em relação ao mês anterior
    const calcularVariacao = (atual: number, anterior: number) => {
      if (anterior === 0) return atual > 0 ? 100 : 0;
      return ((atual - anterior) / anterior) * 100;
    };

    const variacaoTotalMes = calcularVariacao(totalMesAtual, totalMesAnterior);
    const variacaoTicketMedio = calcularVariacao(ticketMedioAtual, ticketMedioAnterior);
    const variacaoTaxaConversao = calcularVariacao(taxaConversaoAtual, taxaConversaoAnterior);
    const variacaoTaxaReembolso = calcularVariacao(taxaReembolsoAtual, taxaReembolsoAnterior);

    // Formatados para exibição
    const formatarNumero = (valor: number) => {
      return valor.toLocaleString('pt-BR');
    };

    const formatarDinheiro = (valor: number) => {
      return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    };

    // Preparar resposta no formato esperado pelo frontend
    // Com as métricas em um array como esperado pelo componente dashboard
    const dadosMetricas = [
      {
        title: 'Total de Vendas',
        value: formatarDinheiro(totalMesAtual),
        change: `+${variacaoTotalMes.toFixed(1)}%`,
        icon: 'DollarSign',
        color: 'text-green-500'
      },
      {
        title: 'Ticket Médio',
        value: formatarDinheiro(ticketMedioAtual),
        change: `${variacaoTicketMedio > 0 ? '+' : ''}${variacaoTicketMedio.toFixed(1)}%`,
        icon: 'MousePointerClick',
        color: 'text-purple-500'
      },
      {
        title: 'Taxa de Conversão',
        value: `${taxaConversaoAtual.toFixed(1)}%`,
        change: `${variacaoTaxaConversao > 0 ? '+' : ''}${variacaoTaxaConversao.toFixed(1)}%`,
        icon: 'Users',
        color: 'text-blue-500'
      },
      {
        title: 'Taxa de Reembolso',
        value: `${taxaReembolsoAtual.toFixed(1)}%`,
        change: `${variacaoTaxaReembolso > 0 ? '+' : ''}${variacaoTaxaReembolso.toFixed(1)}%`,
        icon: 'RefreshCcw',
        color: 'text-red-500'
      },
      {
        title: 'Lucro Total',
        value: formatarDinheiro(totalMesAtual - totalReembolsos),
        change: `+${variacaoTotalMes.toFixed(1)}%`,
        icon: 'TrendingUp',
        color: 'text-[#17d300]'
      }
    ];

    // Dados para os gráficos (últimos 7 meses)
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
    const dadosGraficos = meses.map((mes, index) => {
      // Simulando dados de acessos, cliques e vendas para cada mês
      const baseAcessos = Math.floor(2000 + Math.random() * 2000);
      const baseCliques = Math.floor(1500 + Math.random() * 3500);
      const baseVendas = Math.floor(1800 + Math.random() * 700);
      
      return {
        name: mes,
        acessos: baseAcessos,
        cliques: baseCliques,
        vendas: baseVendas
      };
    });

    return NextResponse.json({
      metricas: dadosMetricas,
      dadosGraficos
    });
  } catch (error) {
    console.error('Erro ao buscar métricas de vendas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar métricas de vendas' },
      { status: 500 }
    );
  }
}
