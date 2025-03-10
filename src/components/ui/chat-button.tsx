'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; fromUser: boolean; timestamp: Date }[]>([
    {
      text: 'Olá! Como posso ajudar você hoje?',
      fromUser: false,
      timestamp: new Date()
    }
  ]);
  const [unreadCount, setUnreadCount] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  // Resetar contador de mensagens não lidas quando o chat é aberto
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Função para enviar mensagem
  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Adicionar mensagem do usuário
    const newMessage = {
      text: message,
      fromUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simular resposta (bot digitando)
    setIsTyping(true);
    
    // Simular tempo de resposta
    setTimeout(() => {
      setIsTyping(false);
      
      // Resposta automática
      const botReply = {
        text: 'Obrigado pela sua mensagem! Um de nossos atendentes irá ajudá-lo em breve. Você pode visualizar todas as suas conversas na área do cliente.',
        fromUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botReply]);
    }, 2000);
  };

  // Formatar hora
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para ir para o dashboard completo
  const goToDashboard = () => {
    router.push('/dashboard/chat');
  };

  return (
    <>
      {/* Botão flutuante */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-14 w-14 rounded-full bg-[#17d300] hover:bg-[#15bb00] shadow-xl ring-2 ring-[#17d300]/20"
        >
          <span className="sr-only">Abrir chat</span>
          <MessageCircle className="h-6 w-6 text-white" />
          
          {/* Contador de mensagens não lidas */}
          {unreadCount > 0 && (
            <motion.div 
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              {unreadCount}
            </motion.div>
          )}
        </Button>
      </motion.div>

      {/* Dialog do chat */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-xl max-h-[600px] flex flex-col">
          <DialogHeader className="px-6 py-4 border-b bg-[#17d300] text-white">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span>Atendimento</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 rounded-full text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {/* Corpo do chat */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.fromUser ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div 
                    className={`max-w-[80%] rounded-xl px-4 py-2 shadow-sm ${
                      msg.fromUser 
                        ? 'bg-[#17d300] text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 rounded-tl-none border'
                    }`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.fromUser ? 'text-white/70' : 'text-gray-500'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </motion.div>
                </div>
              ))}

              {/* Indicador de digitação */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div 
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-white rounded-xl px-4 py-2 shadow-sm border rounded-tl-none">
                      <div className="flex space-x-1">
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-gray-400"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                        />
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-gray-400" 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                        />
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-gray-400" 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Ver todas mensagens */}
          <div className="px-4 py-2 bg-white border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-[#17d300] border-[#17d300] hover:bg-[#17d300]/10"
              onClick={goToDashboard}
            >
              Ver todas as mensagens
            </Button>
          </div>

          {/* Área de input */}
          <div className="p-2 bg-white border-t flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-1 py-2 px-3 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#17d300]/50 focus:border-[#17d300]"
            />
            <Button 
              size="icon" 
              onClick={sendMessage} 
              disabled={!message.trim()}
              className="h-9 w-9 rounded-full bg-[#17d300] hover:bg-[#15bb00]"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
