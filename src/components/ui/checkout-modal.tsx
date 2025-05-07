'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string;
    title: string;
    price: string;
    originalPrice?: number;
    checkoutUrl?: string;
  };
}

export function CheckoutModal({ isOpen, onClose, plan }: CheckoutModalProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Aplica máscara de telefone se for o campo phone
    if (name === 'phone') {
      // Remove todos os caracteres não numéricos
      const numericValue = value.replace(/\D/g, '');
      
      // Formata como (XX) XXXXX-XXXX
      let formattedValue = '';
      if (numericValue.length <= 2) {
        formattedValue = numericValue;
      } else if (numericValue.length <= 7) {
        formattedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
      } else {
        formattedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
      }
      
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Verificar se tem email (obrigatório)
      if (!formData.email) {
        toast({
          title: "Erro",
          description: "Por favor, informe seu email para continuar",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // 1. Registrar intenção de compra e criar conta se necessário
      const response = await fetch('/api/assinatura/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao processar checkout');
      }

      const data = await response.json();

      // 2. Se tudo ocorreu bem, redirecionar para a página de pagamento do Kirvano
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (plan.checkoutUrl) {
        // Fallback para URL direta do plano
        window.location.href = `${plan.checkoutUrl}?email=${encodeURIComponent(formData.email)}&name=${encodeURIComponent(formData.name || '')}`;
      } else {
        throw new Error('URL de checkout não disponível');
      }
    } catch (error) {
      console.error('Erro no processo de checkout:', error);
      toast({
        title: "Erro no checkout",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar seu pagamento",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#0a192f] border border-[#233554]">
        <DialogHeader>
          <DialogTitle>Checkout {plan.title}</DialogTitle>
          <DialogDescription>
            Preencha seus dados para continuar com o pagamento
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              name="name"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleInputChange}
              required={!session}
              disabled={!!session?.user?.name}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Seu melhor email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={!!session?.user?.email}
            />
            <p className="text-xs text-gray-500">Você receberá o acesso neste email</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="py-4 border-t mt-4">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>{plan.price}</span>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm">
            <p className="text-blue-700 dark:text-blue-400 font-medium">Nota:</p>
            <p className="text-blue-600 dark:text-blue-300">
              Se você não estiver logado, criaremos uma conta automaticamente com os dados informados.
              Você poderá fazer login usando seu email como senha inicial.
            </p>
          </div>

          <DialogFooter className="mt-4">
            <Button 
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="ml-2"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Processando...</span>
                </>
              ) : (
                'Prosseguir para pagamento'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
