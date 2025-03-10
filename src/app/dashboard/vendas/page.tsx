'use client';

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, ArrowUp, ArrowDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const vendas = [
  {
    id: 1,
    assinante: 'João Silva',
    plano: 'Premium Anual',
    valor: 'R$ 997,00',
    data: '15/01/2024',
    status: 'Aprovado',
    formaPagamento: 'Cartão de Crédito',
  },
  // Adicione mais vendas aqui
];

const dadosGrafico = [
  { mes: 'Jan', vendas: 12500 },
  { mes: 'Fev', vendas: 15000 },
  { mes: 'Mar', vendas: 18000 },
  { mes: 'Abr', vendas: 16000 },
  { mes: 'Mai', vendas: 21000 },
  { mes: 'Jun', vendas: 19000 },
];

export default function Vendas() {
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
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Vendas do Mês</p>
          <h3 className="text-2xl font-bold mt-2">R$ 45.850,00</h3>
          <p className="text-sm text-green-500 mt-2 flex items-center">
            <ArrowUp className="w-4 h-4 mr-1" />
            12% desde o último mês
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Ticket Médio</p>
          <h3 className="text-2xl font-bold mt-2">R$ 997,00</h3>
          <p className="text-sm text-green-500 mt-2 flex items-center">
            <ArrowUp className="w-4 h-4 mr-1" />
            5% desde o último mês
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
          <h3 className="text-2xl font-bold mt-2">3.2%</h3>
          <p className="text-sm text-green-500 mt-2 flex items-center">
            <ArrowUp className="w-4 h-4 mr-1" />
            0.8% desde o último mês
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Reembolsos</p>
          <h3 className="text-2xl font-bold mt-2">1.2%</h3>
          <p className="text-sm text-red-500 mt-2 flex items-center">
            <ArrowDown className="w-4 h-4 mr-1" />
            0.3% desde o último mês
          </p>
        </Card>
      </div>

      {/* Gráfico */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Desempenho de Vendas</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="vendas" fill="#17d300" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Lista de Vendas */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Últimas Vendas</h3>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar vendas..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filtros</Button>
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
              </tr>
            </thead>
            <tbody>
              {vendas.map((venda) => (
                <tr key={venda.id} className="border-b last:border-0">
                  <td className="py-4">{venda.assinante}</td>
                  <td className="py-4">{venda.plano}</td>
                  <td className="py-4">{venda.valor}</td>
                  <td className="py-4">{venda.data}</td>
                  <td className="py-4">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {venda.status}
                    </span>
                  </td>
                  <td className="py-4">{venda.formaPagamento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
