'use client';

import { Card } from "@/components/ui/card";
import { 
  Users, 
  MousePointerClick, 
  DollarSign, 
  RefreshCcw,
  TrendingUp
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const data = [
  { name: 'Jan', acessos: 4000, cliques: 2400, vendas: 2400 },
  { name: 'Fev', acessos: 3000, cliques: 1398, vendas: 2210 },
  { name: 'Mar', acessos: 2000, cliques: 9800, vendas: 2290 },
  { name: 'Abr', acessos: 2780, cliques: 3908, vendas: 2000 },
  { name: 'Mai', acessos: 1890, cliques: 4800, vendas: 2181 },
  { name: 'Jun', acessos: 2390, cliques: 3800, vendas: 2500 },
  { name: 'Jul', acessos: 3490, cliques: 4300, vendas: 2100 },
];

const metrics = [
  {
    title: 'Total de Acessos',
    value: '12.361',
    change: '+14%',
    icon: Users,
    color: 'text-blue-500'
  },
  {
    title: 'Total de Cliques',
    value: '48.271',
    change: '+23%',
    icon: MousePointerClick,
    color: 'text-purple-500'
  },
  {
    title: 'Total de Vendas',
    value: 'R$ 23.590',
    change: '+18%',
    icon: DollarSign,
    color: 'text-green-500'
  },
  {
    title: 'Total de Reembolsos',
    value: 'R$ 1.230',
    change: '-5%',
    icon: RefreshCcw,
    color: 'text-red-500'
  },
  {
    title: 'Lucro Total',
    value: 'R$ 22.360',
    change: '+21%',
    icon: TrendingUp,
    color: 'text-[#17d300]'
  },
];

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Visão Geral</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <h3 className="text-2xl font-bold mt-2">{metric.value}</h3>
                <p className={`text-sm mt-2 ${
                  metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.change} desde o último mês
                </p>
              </div>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Acessos e Cliques</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="acessos" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.2}
                />
                <Area 
                  type="monotone" 
                  dataKey="cliques" 
                  stackId="1"
                  stroke="#a855f7" 
                  fill="#a855f7" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Vendas Mensais</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="vendas" 
                  fill="#17d300"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
