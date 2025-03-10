'use client';

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

// Tipo para o plano
type Plano = {
  id?: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  durationDays: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
};

interface PlanoModalProps {
  plano?: Plano;
  isOpen: boolean;
  onClose: () => void;
  onSave: (plano: Plano) => Promise<void>;
}

export function PlanoModal({ plano, isOpen, onClose, onSave }: PlanoModalProps) {
  // Estado para o formulário
  const [formData, setFormData] = useState<Plano>({
    name: "",
    description: "",
    price: 0,
    discountPrice: null,
    durationDays: 30,
    features: [""],
    isPopular: false,
    isActive: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Título do modal
  const modalTitle = plano?.id ? "Editar Plano" : "Novo Plano";
  
  // Preencher dados do formulário quando receber um plano para editar
  useEffect(() => {
    if (plano) {
      setFormData({
        ...plano,
        price: Number(plano.price),
        discountPrice: plano.discountPrice ? Number(plano.discountPrice) : null,
      });
    } else {
      // Reset para os valores padrão quando for criar novo plano
      setFormData({
        name: "",
        description: "",
        price: 0,
        discountPrice: null,
        durationDays: 30,
        features: [""],
        isPopular: false,
        isActive: true,
      });
    }
  }, [plano, isOpen]);
  
  // Validação do formulário
  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      novosErros.name = "Nome é obrigatório";
    }
    
    if (!formData.description.trim()) {
      novosErros.description = "Descrição é obrigatória";
    }
    
    if (formData.price <= 0) {
      novosErros.price = "Preço deve ser maior que zero";
    }
    
    if (formData.durationDays <= 0) {
      novosErros.durationDays = "Duração deve ser maior que zero";
    }
    
    if (formData.features.some(f => !f.trim())) {
      novosErros.features = "Recursos não podem estar vazios";
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };
  
  // Lidar com mudanças nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "price" || name === "discountPrice" || name === "durationDays") {
      setFormData(prev => ({
        ...prev,
        [name]: name === "discountPrice" && !value ? null : Number(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  // Lidar com mudanças nos switches
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  // Adicionar um novo recurso
  const adicionarRecurso = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };
  
  // Atualizar um recurso
  const atualizarRecurso = (index: number, value: string) => {
    const novasFeatures = [...formData.features];
    novasFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: novasFeatures,
    }));
  };
  
  // Remover um recurso
  const removerRecurso = (index: number) => {
    if (formData.features.length <= 1) {
      toast.error("É necessário ter pelo menos um recurso");
      return;
    }
    
    const novasFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      features: novasFeatures,
    }));
  };
  
  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Informações básicas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Plano</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Plano Individual"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Breve descrição do plano..."
                className={errors.description ? "border-red-500" : ""}
                rows={3}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ex: 99.90"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="discountPrice">Preço com Desconto (R$) (opcional)</Label>
                <Input
                  id="discountPrice"
                  name="discountPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discountPrice || ""}
                  onChange={handleChange}
                  placeholder="Ex: 79.90"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="durationDays">Duração (dias)</Label>
              <Select
                value={formData.durationDays.toString()}
                onValueChange={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    durationDays: Number(value),
                  }));
                }}
              >
                <SelectTrigger className={errors.durationDays ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione a duração" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 dias (1 mês)</SelectItem>
                  <SelectItem value="90">90 dias (3 meses)</SelectItem>
                  <SelectItem value="180">180 dias (6 meses)</SelectItem>
                  <SelectItem value="365">365 dias (1 ano)</SelectItem>
                </SelectContent>
              </Select>
              {errors.durationDays && (
                <p className="text-red-500 text-xs mt-1">{errors.durationDays}</p>
              )}
            </div>
          </div>
          
          {/* Status e Destaque */}
          <div className="space-y-4 border-t border-b py-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isActive" className="text-base">Plano Ativo</Label>
                <p className="text-sm text-muted-foreground">Disponível para compra</p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isPopular" className="text-base">Plano em Destaque</Label>
                <p className="text-sm text-muted-foreground">Marcar como "Popular"</p>
              </div>
              <Switch
                id="isPopular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => handleSwitchChange("isPopular", checked)}
              />
            </div>
          </div>
          
          {/* Recursos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Recursos do Plano</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={adicionarRecurso}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
            
            {errors.features && (
              <p className="text-red-500 text-xs">{errors.features}</p>
            )}
            
            <AnimatePresence>
              {formData.features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex gap-2 items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    value={feature}
                    onChange={(e) => atualizarRecurso(index, e.target.value)}
                    placeholder={`Recurso ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removerRecurso(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#17d300] hover:bg-[#15bb00]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                plano?.id ? "Atualizar Plano" : "Criar Plano"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
