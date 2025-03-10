'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  LineChart,
  PieChart,
  UserCheck,
  Eye,
  Activity,
  Download,
  Calendar,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";

// Animações para os cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const estatisticas = [
  {
    id: 1,
    titulo: 'Visitas ao Perfil',
    valor: 1248,
    aumento: '+12%',
    periodo: 'desde o mês passado',
    icon: Eye,
    cor: 'bg-blue-500',
    progresso: 75
  },
  {
    id: 2,
    titulo: 'Cartões Compartilhados',
    valor: 432,
    aumento: '+8%',
    periodo: 'desde o mês passado',
    icon: UserCheck,
    cor: 'bg-green-500',
    progresso: 62
  },
  {
    id: 3,
    titulo: 'Cliques em Links',
    valor: 872,
    aumento: '+24%',
    periodo: 'desde o mês passado',
    icon: Activity,
    cor: 'bg-purple-500',
    progresso: 88
  },
];

const graficos = [
  {
    id: 1,
    titulo: 'Visitas por Semana',
    tipo: 'Gráfico de Linha',
    periodo: 'Últimos 30 dias',
    icon: LineChart,
  },
  {
    id: 2,
    titulo: 'Conversões por Fonte',
    tipo: 'Gráfico de Pizza',
    periodo: 'Este mês',
    icon: PieChart,
  },
  {
    id: 3,
    titulo: 'Compartilhamentos por Plataforma',
    tipo: 'Gráfico de Barras',
    periodo: 'Este trimestre',
    icon: BarChart,
  },
];

export default function Relatorios() {
  const [progress, setProgress] = useState(13);
  
  // Simulação de carregamento quando trocar de aba
  const handleTabChange = () => {
    setProgress(13);
    const timer = setTimeout(() => setProgress(66), 500);
    const timer2 = setTimeout(() => setProgress(100), 1000);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe métricas e desempenho do seu Tappy ID
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="default" size="sm" className="gap-2 bg-[#17d300] hover:bg-[#17d300]/90">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="resumo" className="mb-8" onValueChange={handleTabChange}>
        <TabsList className="mb-4 w-full overflow-x-auto flex flex-nowrap">
          <TabsTrigger value="resumo" className="whitespace-nowrap">Resumo</TabsTrigger>
          <TabsTrigger value="visitas" className="whitespace-nowrap">Visitas</TabsTrigger>
          <TabsTrigger value="compartilhamentos" className="whitespace-nowrap">Compartilhamentos</TabsTrigger>
          <TabsTrigger value="conversoes" className="whitespace-nowrap">Conversões</TabsTrigger>
        </TabsList>
        
        {progress < 100 && (
          <Progress value={progress} className="h-1 mb-4" />
        )}
        
        <TabsContent value="resumo" className="space-y-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {estatisticas.map((stat) => (
              <motion.div key={stat.id} variants={itemVariants}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.titulo}</p>
                      <h3 className="text-2xl font-bold mb-1">{stat.valor.toLocaleString()}</h3>
                      <p className="text-sm text-[#17d300]">{stat.aumento} {stat.periodo}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.cor}/10`}>
                      <stat.icon className={`w-6 h-6 text-${stat.cor.split('-')[1]}-500`} />
                    </div>
                  </div>
                  <div className="mt-5">
                    <Progress value={stat.progresso} className="h-1" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="visitas" className="space-y-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {graficos.map((grafico) => (
              <motion.div key={grafico.id} variants={itemVariants}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{grafico.titulo}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{grafico.periodo}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#17d300]/10">
                      <grafico.icon className="w-5 h-5 text-[#17d300]" />
                    </div>
                  </div>
                  
                  <div className="h-52 flex items-center justify-center bg-muted/30 rounded-lg mb-4">
                    <p className="text-sm text-muted-foreground">{grafico.tipo}</p>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    Ver detalhes
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="compartilhamentos" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Compartilhamentos por Plataforma</h3>
            <div className="space-y-4">
              {['WhatsApp', 'Email', 'LinkedIn', 'Instagram', 'Twitter'].map((plataforma, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{plataforma}</span>
                    <span className="font-medium">{Math.floor(Math.random() * 100)}%</span>
                  </div>
                  <Progress value={Math.floor(Math.random() * 100)} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversoes" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Conversões por Fonte</h3>
            <div className="space-y-6">
              {['QR Code', 'NFC', 'Link Direto', 'Cartão Físico', 'Indicação'].map((fonte, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-1/3">
                    <span>{fonte}</span>
                  </div>
                  <div className="w-2/3">
                    <div className="flex-1 mr-4">
                      <Progress 
                        value={Math.floor(Math.random() * 100)} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
