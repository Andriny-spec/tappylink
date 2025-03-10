'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  MousePointerClick, 
  DollarSign, 
  RefreshCcw,
  TrendingUp,
  Loader2
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

// Definindo o tipo para as métricas
type Metric = {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
};

// Mapeamento de ícones
const iconMapping: { [key: string]: React.ElementType } = {
  Users: Users,
  MousePointerClick: MousePointerClick,
  DollarSign: DollarSign,
  RefreshCcw: RefreshCcw,
  TrendingUp: TrendingUp
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/vendas/metricas');
        
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do dashboard');
        }
        
        const data = await response.json();
        
        // Processar as métricas e adicionar os ícones corretos
        const metricasProcessadas = data.metricas.map((metric: any) => ({
          ...metric,
          icon: iconMapping[metric.icon],
        }));
        
        setMetrics(metricasProcessadas);
        setChartData(data.dadosGraficos);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Não foi possível carregar os dados do dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p>Carregando dados do dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

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
              {metric.icon && <metric.icon className={`w-5 h-5 ${metric.color}`} />}
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
              <AreaChart data={chartData}>
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
              <BarChart data={chartData}>
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
