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

    // Definir período atual (últimos 30 dias)
    const hoje = new Date();
    const inicioMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const inicioMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    const fimMesAnterior = new Date(inicioMesAtual.getTime() - 1);

    // Buscar total de perfis (acessos)
    const totalPerfilResult = await prisma.$queryRaw<{count: string}[]>`
      SELECT COUNT(*) FROM profiles
    `;
    const totalPerfis = Number(totalPerfilResult[0]?.count || '0');
    
    // Calcular mudança em relação ao mês anterior (simulando um crescimento de 14%)
    const crescimentoPerfis = 14;

    // Buscar total de cliques nos perfis
    const totalCliquesResult = await prisma.$queryRaw<{sum: string}[]>`
      SELECT COALESCE(SUM(clicks), 0) as sum FROM profiles
    `;
    const totalCliques = Number(totalCliquesResult[0]?.sum || '0');
    
    // Calcular mudança em relação ao mês anterior (simulando um crescimento de 23%)
    const crescimentoCliques = 23;

    // Buscar total de vendas (pedidos aprovados)
    const totalVendasResult = await prisma.$queryRaw<{sum: string}[]>`
      SELECT COALESCE(SUM(amount), 0) as sum FROM orders 
      WHERE "paymentStatus" = 'APROVADO'
    `;
    const totalVendas = Number(totalVendasResult[0]?.sum || '0');
    
    // Calcular mudança em relação ao mês anterior (simulando um crescimento de 18%)
    const crescimentoVendas = 18;

    // Buscar total de reembolsos
    const totalReembolsosResult = await prisma.$queryRaw<{sum: string}[]>`
      SELECT COALESCE(SUM(amount), 0) as sum FROM orders 
      WHERE "paymentStatus" = 'REEMBOLSADO'
    `;
    const totalReembolsos = Number(totalReembolsosResult[0]?.sum || '0');
    
    // Calcular mudança em relação ao mês anterior (simulando uma redução de 5%)
    const crescimentoReembolsos = -5;

    // Calcular lucro total (vendas - reembolsos)
    const lucroTotal = totalVendas - totalReembolsos;
    
    // Calcular mudança em relação ao mês anterior (simulando um crescimento de 21%)
    const crescimentoLucro = 21;

    // Formatar os valores para exibição
    const formatarNumero = (valor: number) => {
      return valor.toLocaleString('pt-BR');
    };

    const formatarDinheiro = (valor: number) => {
      return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    };

    // Buscar dados históricos para gráficos (aqui estamos simulando dados para 7 meses)
    // Em um ambiente real, esses dados seriam obtidos do banco de dados
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
    const dadosGraficos = await Promise.all(meses.map(async (mes, index) => {
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
    }));

    return NextResponse.json({
      metricas: [
        {
          title: 'Total de Acessos',
          value: formatarNumero(totalPerfis),
          change: `+${crescimentoPerfis}%`,
          icon: 'Users',
          color: 'text-blue-500'
        },
        {
          title: 'Total de Cliques',
          value: formatarNumero(totalCliques),
          change: `+${crescimentoCliques}%`,
          icon: 'MousePointerClick',
          color: 'text-purple-500'
        },
        {
          title: 'Total de Vendas',
          value: formatarDinheiro(totalVendas),
          change: `+${crescimentoVendas}%`,
          icon: 'DollarSign',
          color: 'text-green-500'
        },
        {
          title: 'Total de Reembolsos',
          value: formatarDinheiro(totalReembolsos),
          change: `${crescimentoReembolsos}%`,
          icon: 'RefreshCcw',
          color: 'text-red-500'
        },
        {
          title: 'Lucro Total',
          value: formatarDinheiro(lucroTotal),
          change: `+${crescimentoLucro}%`,
          icon: 'TrendingUp',
          color: 'text-[#17d300]'
        }
      ],
      dadosGraficos
    });
  } catch (error) {
    console.error('Erro ao buscar métricas do dashboard:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar métricas do dashboard' },
      { status: 500 }
    );
  }
}
