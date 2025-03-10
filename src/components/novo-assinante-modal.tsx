import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModalSimples, ModalFooter } from "@/components/ui/modal-simples";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Tipo para os planos
type Plano = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  durationDays: number;
  isPopular: boolean;
};

interface NovoAssinanteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NovoAssinanteModal({
  isOpen,
  onClose,
  onSuccess,
}: NovoAssinanteModalProps) {
  // Estados para os dados do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [planId, setPlanId] = useState('');
  
  // Estado para os planos disponíveis
  const [planos, setPlanos] = useState<Plano[]>([]);
  
  // Estados para carregamento
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPlanos, setIsLoadingPlanos] = useState(false);
  
  // Buscar planos disponíveis quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      buscarPlanos();
    }
  }, [isOpen]);
  
  // Função para buscar planos
  const buscarPlanos = async () => {
    try {
      setIsLoadingPlanos(true);
      const response = await fetch('/api/planos');
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar planos: ${response.status}`);
      }
      
      const data = await response.json();
      setPlanos(data);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      toast.error('Falha ao carregar planos disponíveis');
    } finally {
      setIsLoadingPlanos(false);
    }
  };
  
  // Função para registrar novo assinante
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!email || !password) {
      toast.error('Email e senha são obrigatórios');
      return;
    }
    
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/assinantes/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          planId: planId && planId !== 'sem-plano' ? planId : undefined
        })
      });
      
      if (response.status === 409) {
        toast.error('Este email já está em uso');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Erro ao cadastrar assinante: ${response.status}`);
      }
      
      // Limpar formulário
      setEmail('');
      setPassword('');
      setName('');
      setPlanId('');
      
      toast.success('Assinante cadastrado com sucesso');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao cadastrar assinante:', error);
      toast.error('Falha ao cadastrar assinante');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Função para exibir o preço formatado
  const formatarPreco = (preco: number | null | undefined) => {
    // Garantir que o preço seja um número
    const precoNumerico = typeof preco === 'number' ? preco : 0;
    return `R$ ${precoNumerico.toFixed(2).replace('.', ',')}`;
  };
  
  return (
    <ModalSimples 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Cadastrar Novo Assinante"
      description="Preencha as informações para cadastrar um novo assinante. Opcionalmente, vincule-o a um plano."
      className="sm:max-w-[550px]"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar Assinante'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                placeholder="email@exemplo.com"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Senha *
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Nome completo"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan" className="text-right">
                Plano
              </Label>
              <div className="col-span-3">
                <Select value={planId} onValueChange={setPlanId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingPlanos ? (
                      <SelectItem value="loading" disabled>
                        Carregando planos...
                      </SelectItem>
                    ) : planos.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        Nenhum plano disponível
                      </SelectItem>
                    ) : (
                      <>
                        <SelectItem value="sem-plano">Sem plano</SelectItem>
                        {planos.map((plano) => (
                          <SelectItem key={plano.id} value={plano.id}>
                            {plano.name} - {formatarPreco(plano.discountPrice || plano.price)} ({plano.durationDays} dias)
                            {plano.isPopular && " 🔥"}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
      </form>
    </ModalSimples>
  );
}
