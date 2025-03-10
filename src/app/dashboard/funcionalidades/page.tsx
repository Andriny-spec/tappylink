'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Smartphone, 
  QrCode, 
  Share2, 
  Palette, 
  Globe, 
  MessageSquare,
  Lock,
  CheckCircle2
} from "lucide-react";

const funcionalidades = [
  {
    id: 1,
    nome: 'Cartão Virtual',
    descricao: 'Crie seu cartão virtual personalizado com suas informações e links',
    icon: Smartphone,
    status: 'active',
  },
  {
    id: 2,
    nome: 'QR Code Dinâmico',
    descricao: 'Gere QR Codes únicos que podem ser atualizados a qualquer momento',
    icon: QrCode,
    status: 'active',
  },
  {
    id: 3,
    nome: 'Compartilhamento NFC',
    descricao: 'Compartilhe seu cartão apenas aproximando os dispositivos',
    icon: Share2,
    status: 'active',
  },
  {
    id: 4,
    nome: 'Temas Personalizados',
    descricao: 'Personalize as cores e o estilo do seu cartão',
    icon: Palette,
    status: 'active',
  },
  {
    id: 5,
    nome: 'Site Personalizado',
    descricao: 'Crie um mini site com suas informações e portfolio',
    icon: Globe,
    status: 'coming',
  },
  {
    id: 6,
    nome: 'Chat Integrado',
    descricao: 'Receba mensagens diretamente no seu cartão',
    icon: MessageSquare,
    status: 'coming',
  },
];

export default function Funcionalidades() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Funcionalidades</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as funcionalidades disponíveis para seus assinantes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funcionalidades.map((feature) => (
          <Card key={feature.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-[#17d300]/10">
                  <feature.icon className="w-6 h-6 text-[#17d300]" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.nome}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.descricao}
                  </p>
                </div>
              </div>
              
              {feature.status === 'active' ? (
                <Switch defaultChecked />
              ) : (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Em breve
                </span>
              )}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Requer plano Premium</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ativo</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
