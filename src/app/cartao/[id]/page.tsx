'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Phone, 
  Share2, 
  QrCode,
  MapPin,
  MessageCircle,
  ExternalLink,
  Mail
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Tipo para o perfil do usuário
interface ProfileData {
  id: string;
  name: string;
  email: string;
  photo: string;
  phone: string;
  biography: string;
  address: string;
  city: string;
  state: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  whatsapp: string;
  telegram: string;
  tiktok: string;
}

export default function CartaoVirtual() {
  const { toast } = useToast();
  const params = useParams();
  const userId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // Incrementar visualização
    fetch(`/api/assinante/profile/view?userId=${userId}`, {
      method: 'POST'
    }).catch(error => console.error("Erro ao registrar visualização:", error));

    // Carregar dados do perfil
    fetch(`/api/assinante/profile?userId=${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao carregar perfil");
        }
        return response.json();
      })
      .then(data => {
        setProfile(data);
        // Gerar QR code usando uma API pública
        const currentUrl = window.location.href;
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`);
      })
      .catch(error => {
        console.error("Erro ao carregar perfil:", error);
        toast({
          title: "Erro ao carregar cartão",
          description: "Não foi possível carregar as informações deste cartão.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId, toast]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Cartão Virtual de ${profile?.name || 'Profissional'}`,
          text: `Veja o cartão virtual de ${profile?.name || 'Profissional'} no TappyID`,
          url: window.location.href,
        });
        
        // Registrar compartilhamento
        fetch(`/api/assinante/profile/share?userId=${userId}`, {
          method: 'POST'
        }).catch(error => console.error("Erro ao registrar compartilhamento:", error));
        
      } else {
        toast({
          title: "Compartilhamento não suportado",
          description: "Seu navegador não suporta a função de compartilhamento.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  const handleClick = (url: string, type: string) => {
    // Registrar clique
    fetch(`/api/assinante/profile/click?userId=${userId}&type=${type}`, {
      method: 'POST'
    }).catch(error => console.error("Erro ao registrar clique:", error));
    
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#17d300] border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cartão...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cartão não encontrado</h2>
          <p className="text-gray-600 mb-6">Este cartão virtual não existe ou foi removido.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          {/* Cartão Virtual */}
          <Card className="overflow-hidden">
            {/* Cabeçalho */}
            <div className="bg-gradient-to-r from-[#17d300] to-[#15bb00] p-6 text-white">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-2 border-white">
                  <AvatarImage src={profile.photo} />
                  <AvatarFallback className="bg-white text-[#17d300] text-2xl">
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="opacity-90">{profile.email}</p>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              {/* Bio */}
              {profile.biography && (
                <div className="border-b pb-4">
                  <p className="text-gray-700">{profile.biography}</p>
                </div>
              )}

              {/* Contato */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contato</h3>
                <div className="grid gap-3">
                  {profile.phone && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleClick(`tel:${profile.phone}`, 'phone')}
                    >
                      <Phone className="w-4 h-4 mr-3 text-[#17d300]" />
                      {profile.phone}
                    </Button>
                  )}

                  {profile.email && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleClick(`mailto:${profile.email}`, 'email')}
                    >
                      <Mail className="w-4 h-4 mr-3 text-[#17d300]" />
                      {profile.email}
                    </Button>
                  )}

                  {profile.whatsapp && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleClick(`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`, 'whatsapp')}
                    >
                      <MessageCircle className="w-4 h-4 mr-3 text-green-600" />
                      WhatsApp
                    </Button>
                  )}

                  {(profile.address || profile.city || profile.state) && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleClick(`https://maps.google.com/?q=${encodeURIComponent(
                        [profile.address, profile.city, profile.state].filter(Boolean).join(', ')
                      )}`, 'address')}
                    >
                      <MapPin className="w-4 h-4 mr-3 text-red-500" />
                      {[profile.address, profile.city, profile.state]
                        .filter(Boolean)
                        .join(', ')}
                    </Button>
                  )}
                </div>
              </div>

              {/* Redes Sociais */}
              {(profile.facebook || profile.instagram || profile.linkedin || profile.telegram || profile.tiktok) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Redes Sociais</h3>
                  <div className="grid gap-3">
                    {profile.facebook && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleClick(profile.facebook, 'facebook')}
                      >
                        <Facebook className="w-4 h-4 mr-3 text-blue-600" />
                        Facebook
                      </Button>
                    )}

                    {profile.instagram && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleClick(profile.instagram, 'instagram')}
                      >
                        <Instagram className="w-4 h-4 mr-3 text-pink-600" />
                        Instagram
                      </Button>
                    )}

                    {profile.linkedin && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleClick(profile.linkedin, 'linkedin')}
                      >
                        <Linkedin className="w-4 h-4 mr-3 text-blue-700" />
                        LinkedIn
                      </Button>
                    )}

                    {profile.telegram && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleClick(`https://t.me/${profile.telegram.replace('@', '')}`, 'telegram')}
                      >
                        <MessageCircle className="w-4 h-4 mr-3 text-blue-500" />
                        Telegram
                      </Button>
                    )}

                    {profile.tiktok && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleClick(profile.tiktok, 'tiktok')}
                      >
                        <ExternalLink className="w-4 h-4 mr-3 text-black" />
                        TikTok
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* QR Code */}
              <div className="pt-4 border-t">
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Meu QR Code</h3>
                  {qrCodeUrl && (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-48 h-48 mb-4" 
                    />
                  )}
                  <p className="text-sm text-gray-600 text-center mb-4">
                    Escaneie este QR Code para salvar este cartão
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="w-full"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                    
                    <Button
                      className="w-full bg-[#17d300] hover:bg-[#15bb00] text-white"
                      onClick={() => {
                        // Tenta iniciar o compartilhamento NFC se disponível
                        if (navigator && 'nfc' in navigator) {
                          toast({
                            title: "NFC ativado",
                            description: "Aproxime o dispositivo de outro para compartilhar",
                          });
                        } else {
                          toast({
                            title: "NFC não disponível",
                            description: "Seu dispositivo não suporta NFC ou o acesso não foi permitido",
                          });
                        }
                      }}
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Ativar NFC
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé */}
            <div className="bg-gray-50 p-4 text-center border-t">
              <p className="text-xs text-gray-500">
                Criado com <span className="text-red-500">♥</span> por TappyID
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
