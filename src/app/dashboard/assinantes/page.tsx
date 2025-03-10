'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, MoreVertical, Mail, Phone, MapPin, Loader2, Calendar, Clock } from "lucide-react";
import { calcularTempoRestante, getTempoRestanteClasse, formatarData } from "@/lib/utils/date";
import { EditarAssinanteModal } from "@/components/editar-assinante-modal";
import { NovoAssinanteModal } from "@/components/novo-assinante-modal";
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

// Tipo para o assinante
type Assinatura = {
  id: string;
  status: string;
  dataAtivacao: string;
  dataExpiracao: string | null;
  valor: number | null;
  plano: string;
  descricao: string | null;
};

type Assinante = {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  role: "ASSINANTE";
  createdAt: string;
  biography?: string;
  photo?: string;
  assinatura: Assinatura | null;
  social?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    telegram?: string;
    linkedin?: string;
    tiktok?: string;
  };
};

export default function Assinantes() {
  // Estado para armazenar os assinantes
  const [assinantes, setAssinantes] = useState<Assinante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  
  // Estados para o modal de edição
  const [assinanteParaEditar, setAssinanteParaEditar] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Estado para o modal de novo assinante
  const [showNovoAssinanteModal, setShowNovoAssinanteModal] = useState(false);
  
  // Estados para o diálogo de confirmação de exclusão
  const [assinanteParaExcluir, setAssinanteParaExcluir] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Buscar assinantes quando o componente montar
  useEffect(() => {
    buscarAssinantes();
  }, []);
  
  // Função para buscar assinantes
  const buscarAssinantes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/assinantes');
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar assinantes: ${response.status}`);
      }
      
      const data = await response.json();
      setAssinantes(data);
      setErro(null);
    } catch (error) {
      console.error('Erro ao buscar assinantes:', error);
      setErro('Falha ao carregar assinantes. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Funções para abrir modal de edição
  const handleOpenEditModal = (assinante: any) => {
    setAssinanteParaEditar({
      id: assinante.id,
      email: assinante.email,
      name: assinante.name,
      phone: assinante.phone,
      city: assinante.city,
      state: assinante.state,
      biography: assinante.biography
    });
    setShowEditModal(true);
  };
  
  // Função para salvar edição do assinante
  const handleSaveAssinante = async (dadosAtualizados: any) => {
    try {
      const response = await fetch(`/api/assinantes/${dadosAtualizados.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAtualizados)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar assinante: ${response.status}`);
      }
      
      toast.success('Assinante atualizado com sucesso');
      buscarAssinantes(); // Atualiza a lista
      
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao atualizar assinante:', error);
      toast.error('Falha ao atualizar assinante');
      return Promise.reject(error);
    }
  };
  
  // Função para confirmar exclusão
  const handleConfirmDelete = (id: string) => {
    setAssinanteParaExcluir(id);
    setShowDeleteConfirm(true);
  };
  
  // Função para executar a exclusão
  const handleDeleteAssinante = async () => {
    if (!assinanteParaExcluir) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/assinantes/${assinanteParaExcluir}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir assinante: ${response.status}`);
      }
      
      toast.success('Assinante excluído com sucesso');
      setShowDeleteConfirm(false);
      setAssinanteParaExcluir(null);
      buscarAssinantes(); // Atualiza a lista
    } catch (error) {
      console.error('Erro ao excluir assinante:', error);
      toast.error('Falha ao excluir assinante');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Filtrar assinantes com base na busca
  const assinantesFiltrados = assinantes.filter(assinante => 
    assinante.name?.toLowerCase().includes(busca.toLowerCase()) ||
    assinante.email.toLowerCase().includes(busca.toLowerCase()) ||
    assinante.phone?.toLowerCase().includes(busca.toLowerCase()) ||
    assinante.city?.toLowerCase().includes(busca.toLowerCase())
  );
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Assinantes</h1>
        <Button 
          className="bg-[#17d300] hover:bg-[#15bb00]"
          onClick={() => setShowNovoAssinanteModal(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Assinante
        </Button>
      </div>

      {/* Filtros e Busca */}
      <Card className="p-4 mb-8">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar assinantes..."
              className="pl-10"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Button variant="outline">Filtros</Button>
        </div>
      </Card>

      {/* Estado de carregamento */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-[#17d300] mb-4" />
          <p className="text-muted-foreground">Carregando assinantes...</p>
        </div>
      )}

      {/* Mensagem de erro */}
      {erro && !isLoading && (
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-red-600 text-center">{erro}</p>
        </Card>
      )}

      {/* Sem resultados */}
      {!isLoading && !erro && assinantesFiltrados.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            {busca ? "Nenhum assinante encontrado para sua busca" : "Nenhum assinante cadastrado"}
          </p>
        </Card>
      )}

      {/* Lista de Assinantes */}
      {!isLoading && !erro && assinantesFiltrados.length > 0 && (
        <div className="grid gap-4">
          {assinantesFiltrados.map((assinante) => (
            <Card key={assinante.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#17d300] flex items-center justify-center text-white text-xl">
                    {(assinante.name || assinante.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{assinante.name || 'Sem nome'}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {assinante.email}
                      </div>
                      {assinante.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {assinante.phone}
                        </div>
                      )}
                      {assinante.city && assinante.state && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {assinante.city}, {assinante.state}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {assinante.assinatura ? (
                      <>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          assinante.assinatura.status === 'ATIVA' ? 'bg-green-100 text-green-800' : 
                          assinante.assinatura.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {assinante.assinatura.status}
                        </span>
                        <div className="text-sm text-muted-foreground mt-1">
                          {assinante.assinatura.plano} - {assinante.assinatura.valor ? 
                            `R$ ${Number(assinante.assinatura.valor).toFixed(2).replace('.', ',')}` : 'Grátis'}
                        </div>
                        <div className="flex flex-col mt-1 space-y-1">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span title="Data de ativação">Ativado em: {formatarData(assinante.assinatura.dataAtivacao)}</span>
                          </div>
                          
                          {assinante.assinatura.dataExpiracao && (
                            <>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span title="Data de expiração">Expira em: {formatarData(assinante.assinatura.dataExpiracao)}</span>
                              </div>
                              
                              {/* Exibição sofisticada do tempo restante */}
                              <div className="flex items-center text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                <span className={getTempoRestanteClasse(calcularTempoRestante(assinante.assinatura.dataExpiracao).status)}>
                                  {calcularTempoRestante(assinante.assinatura.dataExpiracao).texto}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Sem Assinatura
                        </span>
                        <div className="text-sm text-muted-foreground mt-1">
                          Desde {new Date(assinante.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="px-2" title="Enviar e-mail">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="px-2" 
                      title="Editar assinante"
                      onClick={() => handleOpenEditModal(assinante)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                        <path d="m15 5 4 4"/>
                      </svg>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="px-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                      title="Excluir assinante"
                      onClick={() => handleConfirmDelete(assinante.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        <line x1="10" x2="10" y1="11" y2="17"/>
                        <line x1="14" x2="14" y1="11" y2="17"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Modal de edição de assinante */}
      <EditarAssinanteModal
        assinante={assinanteParaEditar}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveAssinante}
      />
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Assinante</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este assinante? Esta ação não pode ser desfeita e todos os dados serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAssinante}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Modal de novo assinante */}
      <NovoAssinanteModal
        isOpen={showNovoAssinanteModal}
        onClose={() => setShowNovoAssinanteModal(false)}
        onSuccess={buscarAssinantes}
      />
    </div>
  );
}
