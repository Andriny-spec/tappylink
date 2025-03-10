import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModalSimples } from "@/components/ui/modal-simples";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type AssinanteParaEdicao = {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  city?: string;
  state?: string;
  biography?: string;
  photo?: string;
};

interface EditarAssinanteModalProps {
  assinante: AssinanteParaEdicao | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (assinante: AssinanteParaEdicao) => Promise<void>;
}

export function EditarAssinanteModal({
  assinante,
  isOpen,
  onClose,
  onSave,
}: EditarAssinanteModalProps) {
  const [formData, setFormData] = useState<AssinanteParaEdicao | null>(assinante);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Atualiza os dados do formulário quando o assinante muda
  useEffect(() => {
    setFormData(assinante);
  }, [assinante]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar assinante:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) return null;

  return (
    <ModalSimples 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Editar Assinante"
      description="Edite as informações do assinante. Clique em salvar quando terminar."
      className="sm:max-w-[550px]"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                Cidade
              </Label>
              <Input
                id="city"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="state" className="text-right">
                Estado
              </Label>
              <Input
                id="state"
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="biography" className="text-right">
                Biografia
              </Label>
              <Textarea
                id="biography"
                name="biography"
                value={formData.biography || ""}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
      </form>
    </ModalSimples>
  );
}
