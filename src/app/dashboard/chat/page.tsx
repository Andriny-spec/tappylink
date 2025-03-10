'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  User,
  Send,
  MoreVertical,
  Clock,
  Check,
  CheckCheck
} from "lucide-react";

// Modelo de dados simulado para conversas
const conversas = [
  {
    id: 1,
    usuario: {
      nome: 'Maria Silva',
      avatar: '/avatars/maria.jpg',
      online: true,
    },
    ultimaMensagem: 'Olá, gostaria de saber mais sobre os planos',
    dataUltimaMensagem: '10:32',
    naoLidas: 2,
    status: 'ativo'
  },
  {
    id: 2,
    usuario: {
      nome: 'João Pereira',
      avatar: '/avatars/joao.jpg',
      online: false,
    },
    ultimaMensagem: 'Obrigado pelo atendimento!',
    dataUltimaMensagem: 'Ontem',
    naoLidas: 0,
    status: 'ativo'
  },
  {
    id: 3,
    usuario: {
      nome: 'Ana Carolina',
      avatar: '/avatars/ana.jpg',
      online: true,
    },
    ultimaMensagem: 'Vou pensar sobre essa proposta',
    dataUltimaMensagem: '08:45',
    naoLidas: 0,
    status: 'ativo'
  },
  {
    id: 4,
    usuario: {
      nome: 'Roberto Gomes',
      avatar: '/avatars/roberto.jpg',
      online: false,
    },
    ultimaMensagem: 'Como funciona o compartilhamento por NFC?',
    dataUltimaMensagem: 'Ontem',
    naoLidas: 1,
    status: 'ativo'
  },
  {
    id: 5,
    usuario: {
      nome: 'Claudia Ferreira',
      avatar: '/avatars/claudia.jpg',
      online: false,
    },
    ultimaMensagem: 'Preciso de ajuda com a configuração',
    dataUltimaMensagem: 'Segunda',
    naoLidas: 0,
    status: 'arquivado'
  },
];

export default function ChatAoVivo() {
  const [conversaSelecionada, setConversaSelecionada] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [filtro, setFiltro] = useState('ativo');
  
  const conversasFiltradas = conversas.filter(conv => conv.status === filtro);
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Chat ao Vivo</h1>
          <p className="text-muted-foreground mt-2">
            Atenda seus contatos em tempo real
          </p>
        </div>
      </div>

      <div className="flex h-[calc(100vh-12rem)] gap-4">
        {/* Lista de conversas */}
        <Card className="w-1/3 overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <div className="flex gap-2">
              <Button 
                variant={filtro === "ativo" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFiltro('ativo')}
                className={filtro === "ativo" ? "bg-[#17d300] hover:bg-[#17d300]/90" : ""}
              >
                Ativos
              </Button>
              <Button 
                variant={filtro === "arquivado" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFiltro('arquivado')}
                className={filtro === "arquivado" ? "bg-[#17d300] hover:bg-[#17d300]/90" : ""}
              >
                Arquivados
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {conversasFiltradas.map((conversa) => (
              <div 
                key={conversa.id}
                className={`p-3 rounded-lg mb-2 cursor-pointer hover:bg-accent transition-colors ${
                  conversaSelecionada?.id === conversa.id ? 'bg-accent' : ''
                }`}
                onClick={() => setConversaSelecionada(conversa)}
              >
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-slate-600" />
                    </div>
                    {conversa.usuario.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#17d300] border-2 border-background rounded-full"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate">{conversa.usuario.nome}</p>
                      <p className="text-xs text-muted-foreground">{conversa.dataUltimaMensagem}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversa.ultimaMensagem}
                      </p>
                      {conversa.naoLidas > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-[#17d300] rounded-full">
                          {conversa.naoLidas}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Área de chat */}
        <Card className="w-2/3 flex flex-col">
          {conversaSelecionada ? (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-slate-600" />
                    </div>
                    {conversaSelecionada.usuario.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#17d300] border-2 border-background rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{conversaSelecionada.usuario.nome}</p>
                    <p className="text-xs text-[#17d300]">
                      {conversaSelecionada.usuario.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900">
                {/* Aqui entrariam as mensagens da conversa */}
                <div className="text-center text-sm text-muted-foreground my-4">
                  <span>Hoje</span>
                </div>
                
                {/* Mensagem do usuário */}
                <div className="flex justify-end mb-4">
                  <div className="bg-[#17d300] text-white rounded-lg rounded-tr-none p-3 max-w-[70%]">
                    <p>Olá, gostaria de saber mais sobre os planos</p>
                    <div className="flex justify-end items-center gap-1 mt-1">
                      <span className="text-xs text-white/70">10:30</span>
                      <CheckCheck className="h-3 w-3 text-white/70" />
                    </div>
                  </div>
                </div>
                
                {/* Mensagem do atendente */}
                <div className="flex justify-start mb-4">
                  <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg rounded-tl-none p-3 max-w-[70%]">
                    <p>Olá! Claro, nossos planos são personalizados de acordo com suas necessidades. Temos opções mensais e anuais com diferentes benefícios.</p>
                    <div className="flex justify-end items-center gap-1 mt-1">
                      <span className="text-xs text-muted-foreground">10:32</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-[#17d300] focus:border-transparent"
                    />
                  </div>
                  <Button size="icon" className="rounded-full bg-[#17d300] hover:bg-[#17d300]/90">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma conversa selecionada</h3>
              <p className="text-muted-foreground max-w-md">
                Selecione uma conversa na lista ao lado para começar a interagir com seus contatos
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
