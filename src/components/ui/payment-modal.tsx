"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PatternFormat } from 'react-number-format';
import { CreditCard, QrCode, Copy, Check } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    title: string;
    price: string;
    installments: string;
  } | null;
}

export function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [copied, setCopied] = useState(false);
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  });

  const handleCardDataChange = (field: keyof typeof cardData) => (
    value: string
  ) => {
    setCardData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCopyPix = async () => {
    const pixCode = "00020126580014BR.GOV.BCB.PIX0136f5c32925-6af4-4fea-b5bf-7d9605f87c4852040000530398654040.005802BR5925TAPPY WHATS TECNOLOGIA LT6009SAO PAULO62070503***6304D475";
    
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast({
        title: "Código PIX copiado!",
        description: "Cole o código no seu aplicativo de pagamento",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Tente copiar manualmente",
        variant: "destructive",
      });
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'card') {
      // Validar dados do cartão
      if (!cardData.name || !cardData.number || !cardData.expiry || !cardData.cvv) {
        toast({
          title: "Dados incompletos",
          description: "Preencha todos os campos do cartão",
          variant: "destructive",
        });
        return;
      }
      
      // Simular processamento
      toast({
        title: "Processando pagamento...",
        description: "Aguarde enquanto processamos sua compra",
      });
    } else {
      handleCopyPix();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">
            Finalizar Compra
          </DialogTitle>
        </DialogHeader>
        {plan ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">{plan.title}</h3>
              <p className="text-2xl font-bold text-[#17d300]">{plan.price}</p>
              <p className="text-sm text-gray-500">ou {plan.installments}</p>
            </div>

            <RadioGroup
              defaultValue="pix"
              className="grid grid-cols-2 gap-4"
              onValueChange={(value) => setPaymentMethod(value as 'pix' | 'card')}
            >
              <div>
                <RadioGroupItem
                  value="pix"
                  id="pix"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="pix"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#17d300] [&:has([data-state=checked])]:border-[#17d300] cursor-pointer"
                  )}
                >
                  <QrCode className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">PIX</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="card"
                  id="card"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="card"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#17d300] [&:has([data-state=checked])]:border-[#17d300] cursor-pointer"
                  )}
                >
                  <CreditCard className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Cartão</span>
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === 'pix' ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center">
                  <img
                    src="/qr-code-example.svg"
                    alt="QR Code PIX"
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-sm text-center text-gray-500">
                  Escaneie o QR Code com seu aplicativo de pagamento ou copie o código PIX
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome no cartão</Label>
                  <Input
                    id="name"
                    placeholder="Nome impresso no cartão"
                    value={cardData.name}
                    onChange={(e) => handleCardDataChange('name')(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Número do cartão</Label>
                  <PatternFormat
                    format="#### #### #### ####"
                    value={cardData.number}
                    onValueChange={(values) => handleCardDataChange('number')(values.value)}
                    customInput={Input}
                    placeholder="0000 0000 0000 0000"
                    id="number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Validade</Label>
                    <PatternFormat
                      format="##/##"
                      value={cardData.expiry}
                      onValueChange={(values) => handleCardDataChange('expiry')(values.value)}
                      customInput={Input}
                      placeholder="MM/AA"
                      id="expiry"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <PatternFormat
                      format="###"
                      value={cardData.cvv}
                      onValueChange={(values) => handleCardDataChange('cvv')(values.value)}
                      customInput={Input}
                      placeholder="000"
                      id="cvv"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button
              className="w-full bg-[#17d300] hover:bg-[#15bb00] text-white"
              size="lg"
              onClick={handlePayment}
            >
              {paymentMethod === 'pix' ? (
                <span className="flex items-center gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Código copiado!' : 'Copiar código PIX'}
                </span>
              ) : (
                'Finalizar pagamento'
              )}
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
