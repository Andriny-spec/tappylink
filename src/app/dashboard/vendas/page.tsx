'use client';

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, ArrowUp, ArrowDown, Eye, Edit, Trash2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import { prisma } from '@/lib/prisma';

// Interface para as métricas de vendas
interface VendasMetricas {
  totalMes: number;
  ticketMedio: number;
  taxaConversao: number;
  taxaReembolso: number;
  variacaoMes: {
    totalMes: number;
    ticketMedio: number;
    taxaConversao: number;
    taxaReembolso: number;
  };
}

// Interface para pedidos
interface Pedido {
  id: string;
  assinante: string;
  plano: string;
  valor: number;
  data: Date;
  status: string;
  formaPagamento: string;
}

const dadosGrafico = [
  { mes: 'Jan', vendas: 12500 },
  { mes: 'Fev', vendas: 15000 },
  { mes: 'Mar', vendas: 18000 },
  { mes: 'Abr', vendas: 16000 },
  { mes: 'Mai', vendas: 21000 },
  { mes: 'Jun', vendas: 19000 },
];

// Função para buscar dados de vendas do servidor
async function buscarDadosVendas() {
  const response = await fetch('/api/dashboard/vendas/metricas', { next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error('Falha ao buscar métricas de vendas');
  }
  return response.json();
}

// Função para buscar pedidos do servidor
async function buscarPedidos() {
  const response = await fetch('/api/dashboard/vendas/pedidos', { next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error('Falha ao buscar pedidos');
  }
  return response.json();
}

export default function Vendas() {
  const [metricas, setMetricas] = useState<VendasMetricas>({
    totalMes: 0,
    ticketMedio: 0,
    taxaConversao: 0,
    taxaReembolso: 0,
    variacaoMes: {
      totalMes: 0,
      ticketMedio: 0,
      taxaConversao: 0,
      taxaReembolso: 0,
    },
  });
  
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        const [metricasData, pedidosData] = await Promise.all([
          buscarDadosVendas(),
          buscarPedidos()
        ]);
        
        setMetricas(metricasData);
        setPedidos(pedidosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErro('Falha ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setCarregando(false);
      }
    }
    
    carregarDados();
  }, []);
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vendas</h1>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {carregando ? (
          // Exibe esqueleto de carregamento quando os dados estão sendo carregados
          <>
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="p-6">
                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded mb-3"></div>
                <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded mb-3"></div>
                <div className="h-4 w-2/5 bg-gray-200 animate-pulse rounded"></div>
              </Card>
            ))}
          </>
        ) : erro ? (
          // Exibe mensagem de erro caso ocorra falha ao carregar dados
          <div className="col-span-full text-center py-4">
            <p className="text-red-500">{erro}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-2">
              Tentar novamente
            </Button>
          </div>
        ) : (
          // Exibe os cards com dados reais
          <>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Vendas do Mês</p>
              <h3 className="text-2xl font-bold mt-2">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metricas.totalMes)}
              </h3>
              <p className={`text-sm ${metricas.variacaoMes.totalMes >= 0 ? 'text-green-500' : 'text-red-500'} mt-2 flex items-center`}>
                {metricas.variacaoMes.totalMes >= 0 ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(metricas.variacaoMes.totalMes)}% desde o último mês
              </p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Ticket Médio</p>
              <h3 className="text-2xl font-bold mt-2">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metricas.ticketMedio)}
              </h3>
              <p className={`text-sm ${metricas.variacaoMes.ticketMedio >= 0 ? 'text-green-500' : 'text-red-500'} mt-2 flex items-center`}>
                {metricas.variacaoMes.ticketMedio >= 0 ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(metricas.variacaoMes.ticketMedio)}% desde o último mês
              </p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
              <h3 className="text-2xl font-bold mt-2">{metricas.taxaConversao.toFixed(1)}%</h3>
              <p className={`text-sm ${metricas.variacaoMes.taxaConversao >= 0 ? 'text-green-500' : 'text-red-500'} mt-2 flex items-center`}>
                {metricas.variacaoMes.taxaConversao >= 0 ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(metricas.variacaoMes.taxaConversao).toFixed(1)}% desde o último mês
              </p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Reembolsos</p>
              <h3 className="text-2xl font-bold mt-2">{metricas.taxaReembolso.toFixed(1)}%</h3>
              <p className={`text-sm ${metricas.variacaoMes.taxaReembolso <= 0 ? 'text-green-500' : 'text-red-500'} mt-2 flex items-center`}>
                {metricas.variacaoMes.taxaReembolso <= 0 ? (
                  <ArrowDown className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowUp className="w-4 h-4 mr-1" />
                )}
                {Math.abs(metricas.variacaoMes.taxaReembolso).toFixed(1)}% desde o último mês
              </p>
            </Card>
          </>
        )}
      </div>

      {/* Lista de Vendas */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-lg font-semibold">Últimas Vendas</h3>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar vendas..."
                className="pl-10 w-full"
              />
            </div>
            <Button variant="outline" className="w-full md:w-auto">Filtros</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-4">Assinante</th>
                <th className="pb-4">Plano</th>
                <th className="pb-4">Valor</th>
                <th className="pb-4">Data</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Pagamento</th>
                <th className="pb-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                // Esqueleto de carregamento para a tabela
                [...Array(5)].map((_, index) => (
                  <tr key={`skeleton-${index}`} className="border-b last:border-0">
                    {[...Array(7)].map((_, colIndex) => (
                      <td key={`cell-${index}-${colIndex}`} className="py-4">
                        <div className="h-4 bg-gray-200 animate-pulse rounded w-full max-w-[120px]"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : erro ? (
                // Mensagem de erro
                <tr>
                  <td colSpan={7} className="py-6 text-center text-muted-foreground">
                    {erro}
                    <div className="mt-2">
                      <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                        Tentar novamente
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : pedidos.length === 0 ? (
                // Mensagem quando não há pedidos
                <tr>
                  <td colSpan={7} className="py-6 text-center text-muted-foreground">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                // Exibe os pedidos
                pedidos.map((pedido) => (
                  <tr key={pedido.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-4">{pedido.assinante}</td>
                    <td className="py-4">{pedido.plano}</td>
                    <td className="py-4">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.valor)}
                    </td>
                    <td className="py-4">{new Date(pedido.data).toLocaleDateString('pt-BR')}</td>
                    <td className="py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        pedido.status === 'APROVADO' ? 'bg-green-100 text-green-800' :
                        pedido.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-800' :
                        pedido.status === 'REEMBOLSADO' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {pedido.status}
                      </span>
                    </td>
                    <td className="py-4">{pedido.formaPagamento}</td>
                    <td className="py-4 text-center">
                      <div className="flex justify-center space-x-1">
                        <Button variant="ghost" size="icon" title="Ver detalhes">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Editar pedido">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Excluir pedido">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
