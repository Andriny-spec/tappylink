'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Network, 
  Instagram, 
  Linkedin, 
  Facebook, 
  Github, 
  Globe, 
  Twitter,
  Info,
  PlusCircle,
  Check,
  X,
  PanelRightOpen
} from "lucide-react";
import { motion } from "framer-motion";

// Tipagem para as integrações
type Integracao = {
  id: number;
  nome: string;
  descricao: string;
  icon: any; // Componente de ícone do lucide-react
  categoria: string;
  status: boolean;
  premium: boolean;
  guia: string;
};

// Animações para os componentes
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const integracoes: Integracao[] = [
  {
    id: 1,
    nome: 'Instagram',
    descricao: 'Conecte seu perfil do Instagram para exibir posts recentes',
    icon: Instagram,
    categoria: 'Redes Sociais',
    status: true,
    premium: false,
    guia: 'Para integrar com o Instagram, você precisa autorizar o Tappy ID a acessar sua conta.'
  },
  {
    id: 2,
    nome: 'LinkedIn',
    descricao: 'Adicione seu perfil profissional automaticamente',
    icon: Linkedin,
    categoria: 'Redes Sociais',
    status: true,
    premium: false,
    guia: 'Conecte-se com o LinkedIn para importar seu perfil profissional completo.'
  },
  {
    id: 3,
    nome: 'Facebook',
    descricao: 'Conecte sua página ou perfil do Facebook',
    icon: Facebook,
    categoria: 'Redes Sociais',
    status: false,
    premium: false,
    guia: 'Integre com sua página de negócios ou perfil pessoal para aumentar sua presença digital.'
  },
  {
    id: 4,
    nome: 'GitHub',
    descricao: 'Exiba seus repositórios e contribuições mais recentes',
    icon: Github,
    categoria: 'Desenvolvimento',
    status: true,
    premium: true,
    guia: 'Ideal para desenvolvedores, esta integração mostra seus projetos mais importantes automaticamente.'
  },
  {
    id: 5,
    nome: 'WordPress',
    descricao: 'Conecte seu blog para mostrar artigos recentes',
    icon: Globe,
    categoria: 'Sites e CMS',
    status: false,
    premium: true,
    guia: 'Sincronize automaticamente seu blog para exibir suas últimas publicações no seu cartão.'
  },
  {
    id: 6,
    nome: 'Twitter',
    descricao: 'Exiba seus tweets mais recentes',
    icon: Twitter,
    categoria: 'Redes Sociais',
    status: false,
    premium: false,
    guia: 'Compartilhe seus pensamentos e atualizações diretamente no seu cartão digital.'
  },
];

export default function Integracoes() {
  const [activeIntegracao, setActiveIntegracao] = useState<Integracao | null>(null);
  const [conectando, setConectando] = useState(false);
  
  const handleToggleIntegracao = (id: number) => {
    // Simulação de toggle
    setTimeout(() => {
      setConectando(false);
    }, 1500);
    setConectando(true);
  };

  const categorias = [...new Set(integracoes.map(item => item.categoria))];

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Integrações</h1>
          <p className="text-muted-foreground mt-2">
            Conecte suas plataformas favoritas ao seu Tappy ID
          </p>
        </div>
        <Button className="gap-2 bg-[#17d300] hover:bg-[#17d300]/90 self-start sm:self-auto">
          <PlusCircle className="h-4 w-4" />
          Nova Integração
        </Button>
      </div>

      <Accordion type="single" collapsible className="mb-6">
        {categorias.map((categoria, index) => (
          <AccordionItem key={index} value={categoria}>
            <AccordionTrigger className="text-xl font-semibold">
              {categoria}
            </AccordionTrigger>
            <AccordionContent>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {integracoes
                  .filter(item => item.categoria === categoria)
                  .map((integracao) => (
                    <motion.div key={integracao.id} variants={item}>
                      <Card className="p-6 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-[#17d300]/10">
                              <integracao.icon className="w-6 h-6 text-[#17d300]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{integracao.nome}</h3>
                                <HoverCard>
                                  <HoverCardTrigger>
                                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-80">
                                    <div className="space-y-2">
                                      <h4 className="text-sm font-semibold">Sobre esta integração</h4>
                                      <p className="text-sm">{integracao.guia}</p>
                                      {integracao.premium && (
                                        <div className="flex gap-2 items-center text-amber-500 text-xs font-medium mt-2">
                                          <span>⭐</span>
                                          <span>Recurso premium</span>
                                        </div>
                                      )}
                                    </div>
                                  </HoverCardContent>
                                </HoverCard>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {integracao.descricao}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            {conectando && (
                              <div className="animate-pulse">
                                <div className="h-6 w-12 bg-slate-200 rounded"></div>
                              </div>
                            )}
                            {!conectando && (
                              <Switch 
                                checked={integracao.status} 
                                onCheckedChange={() => handleToggleIntegracao(integracao.id)} 
                              />
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between mt-4">
                          {integracao.status ? (
                            <p className="text-xs flex items-center gap-1 text-[#17d300]">
                              <Check className="h-4 w-4" />
                              Conectado
                            </p>
                          ) : (
                            <p className="text-xs flex items-center gap-1 text-muted-foreground">
                              <X className="h-4 w-4" />
                              Não conectado
                            </p>
                          )}
                          
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <PanelRightOpen className="h-4 w-4" />
                                <span className="text-xs">Configurar</span>
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="sm:max-w-md">
                              <SheetHeader>
                                <SheetTitle>
                                  <div className="flex items-center gap-2">
                                    <integracao.icon className="h-5 w-5 text-[#17d300]" />
                                    {integracao.nome}
                                  </div>
                                </SheetTitle>
                                <SheetDescription>
                                  Configure suas preferências para esta integração
                                </SheetDescription>
                              </SheetHeader>
                              <div className="py-6">
                                <p className="text-sm mb-4">
                                  {integracao.guia}
                                </p>
                                <div className="space-y-4 mt-6">
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">Exibir badge</span>
                                      <span className="text-xs text-muted-foreground">Mostrar badge no seu cartão</span>
                                    </div>
                                    <Switch defaultChecked={true} />
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">Sincronização automática</span>
                                      <span className="text-xs text-muted-foreground">Atualizar dados automaticamente</span>
                                    </div>
                                    <Switch defaultChecked={integracao.status} />
                                  </div>
                                </div>
                              </div>
                              <SheetFooter>
                                <SheetClose asChild>
                                  <Button type="submit" className="bg-[#17d300] hover:bg-[#17d300]/90">Salvar Configurações</Button>
                                </SheetClose>
                              </SheetFooter>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </motion.div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
