'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package, MoreVertical, Loader2, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlanoModal } from "@/components/plano-modal";

// Tipo para o plano
type Plano = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  durationDays: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function Planos() {
  // Estado para armazenar os planos
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  
  // Estados para o modal de adição/edição
  const [planoParaEditar, setPlanoParaEditar] = useState<Plano | null>(null);
  const [showPlanoModal, setShowPlanoModal] = useState(false);
  
  // Estado para o diálogo de confirmação de exclusão
  const [planoParaExcluir, setPlanoParaExcluir] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Buscar planos quando o componente montar
  useEffect(() => {
    buscarPlanos();
  }, []);
  
  // Função para buscar planos
  const buscarPlanos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/planos');
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar planos: ${response.status}`);
      }
      
      const data = await response.json();
      setPlanos(data);
      setErro(null);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      setErro('Falha ao carregar planos. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para excluir um plano
  const excluirPlano = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/planos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir plano: ${response.status}`);
      }
      
      // Remover o plano da lista
      setPlanos(planos.filter(plano => plano.id !== id));
      toast.success('Plano excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir plano:', error);
      toast.error('Falha ao excluir plano. Tente novamente.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setPlanoParaExcluir(null);
    }
  };
  
  // Formatar preço para exibição
  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(preco);
  };
  
  // Filtrar planos baseado na busca
  const planosFiltrados = planos.filter(plano => 
    plano.name.toLowerCase().includes(busca.toLowerCase()) ||
    plano.description.toLowerCase().includes(busca.toLowerCase())
  );
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Planos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os planos de assinatura disponíveis para seus clientes
          </p>
        </div>
        
        <Button 
          className="bg-[#17d300] hover:bg-[#15bb00]"
          onClick={() => {
            setPlanoParaEditar(null);
            setShowPlanoModal(true);
          }}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>
      
      <Card className="mb-8">
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Buscar planos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#17d300]" />
        </div>
      ) : erro ? (
        <Card className="p-6">
          <div className="text-center text-red-500">
            {erro}
          </div>
        </Card>
      ) : planosFiltrados.length === 0 ? (
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            Nenhum plano encontrado.
          </div>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Popularidade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planosFiltrados.map((plano) => (
                <TableRow key={plano.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17d300]/10">
                        <Package className="h-5 w-5 text-[#17d300]" />
                      </div>
                      <div>
                        <div className="font-medium">{plano.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {plano.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatarPreco(plano.price)}</div>
                    {plano.discountPrice && (
                      <div className="text-xs text-muted-foreground line-through">
                        {formatarPreco(plano.discountPrice)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {plano.durationDays} dias
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={plano.isActive ? "default" : "outline"}
                      className={plano.isActive ? "bg-green-600" : ""}
                    >
                      {plano.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {plano.isPopular ? (
                      <Badge className="bg-[#17d300]">Popular</Badge>
                    ) : "Normal"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setPlanoParaEditar(plano);
                            setShowPlanoModal(true);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onClick={() => {
                            setPlanoParaExcluir(plano.id);
                            setShowDeleteConfirm(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      
      {/* Dialog de confirmação para excluir */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (planoParaExcluir) {
                  excluirPlano(planoParaExcluir);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Sim, excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Modal para adicionar/editar plano */}
      <PlanoModal
        plano={planoParaEditar || undefined}
        isOpen={showPlanoModal}
        onClose={() => setShowPlanoModal(false)}
        onSave={async (plano) => {
          try {
            if (plano.id) {
              // Atualizar plano existente
              const response = await fetch(`/api/planos/${plano.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(plano),
              });
              
              if (!response.ok) {
                throw new Error(`Erro ao atualizar plano: ${response.status}`);
              }
              
              const planoAtualizado = await response.json();
              
              // Atualizar o plano na lista
              setPlanos(planos.map(p => p.id === plano.id ? planoAtualizado : p));
              toast.success('Plano atualizado com sucesso!');
            } else {
              // Criar novo plano
              const response = await fetch('/api/planos', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(plano),
              });
              
              if (!response.ok) {
                throw new Error(`Erro ao criar plano: ${response.status}`);
              }
              
              const novoPlano = await response.json();
              
              // Adicionar o plano à lista
              setPlanos([...planos, novoPlano]);
              toast.success('Plano criado com sucesso!');
            }
          } catch (error) {
            console.error('Erro ao salvar plano:', error);
            toast.error('Falha ao salvar plano. Tente novamente.');
            throw error;
          }
        }}
      />
    </div>
  );
}
