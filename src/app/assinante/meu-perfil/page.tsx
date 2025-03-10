'use client';

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Phone, 
  Share2, 
  Download, 
  QrCode,
  MapPin,
  Eye,
  Share,
  MousePointerClick,
  MessageCircle,
  Music2,
  LogOut
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { usePWA } from "@/hooks/use-pwa";

export default function Profile() {
  const { toast } = useToast();
  const { isInstallable, install } = usePWA();
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Interfaces para tipagem
interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

interface Cidade {
  id: number;
  nome: string;
}

const [profile, setProfile] = useState({
    name: "",
    bio: "",
    photo: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    whatsapp: "",
    telegram: "",
    tiktok: "",
  });

  const [metrics, setMetrics] = useState({
    views: 0,
    shares: 0,
    clicks: 0
  });
  
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [selectedEstado, setSelectedEstado] = useState("");
  
  useEffect(() => {
    // Carregar estados do IBGE
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => response.json())
      .then(data => setEstados(data))
      .catch(error => console.error('Erro ao carregar estados:', error));
  }, []);
  
  // Carregar cidades quando o estado for selecionado
  useEffect(() => {
    if (selectedEstado) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedEstado}/municipios?orderBy=nome`)
        .then(response => response.json())
        .then(data => setCidades(data))
        .catch(error => console.error('Erro ao carregar cidades:', error));
    } else {
      setCidades([]);
    }
  }, [selectedEstado]);

  // Atualizar selectedEstado quando profile.state mudar e não for vazio
  useEffect(() => {
    if (profile.state && estados.length > 0) {
      // Tentar encontrar o estado pelo nome
      const estadoEncontrado = estados.find(estado => estado.nome === profile.state);
      if (estadoEncontrado) {
        setSelectedEstado(estadoEncontrado.id.toString());
      }
    }
  }, [profile.state, estados]);
  
  useEffect(() => {
    async function loadProfile() {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const response = await fetch(`/api/assinante/profile?userId=${session.user.id}`);
          
          if (response.ok) {
            const data = await response.json();
            
            setProfile({
              name: data.name || "",
              bio: data.biography || "",
              photo: data.photo || "",
              phone: data.phone || "",
              address: data.address || "",
              city: data.city || "",
              state: data.state || "",
              facebook: data.facebook || "",
              instagram: data.instagram || "",
              linkedin: data.linkedin || "",
              whatsapp: data.whatsapp || "",
              telegram: data.telegram || "",
              tiktok: data.tiktok || "",
            });
            
            setMetrics({
              views: data.views || 0,
              shares: data.shares || 0,
              clicks: data.clicks || 0
            });
          } else {
            toast({
              title: "Erro ao carregar perfil",
              description: "Não foi possível carregar suas informações. Tente novamente.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
          toast({
            title: "Erro ao carregar perfil",
            description: "Ocorreu um erro ao acessar o servidor.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
    
    loadProfile();
  }, [session, status, toast]);

  const handleSave = async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/assinante/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          name: profile.name,
          biography: profile.bio,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          facebook: profile.facebook,
          instagram: profile.instagram,
          linkedin: profile.linkedin,
          whatsapp: profile.whatsapp,
          telegram: profile.telegram,
          tiktok: profile.tiktok,
          photo: profile.photo,
        }),
      });
      
      if (response.ok) {
        setIsEditing(false);
        toast({
          title: "Perfil salvo!",
          description: "Suas informações foram atualizadas com sucesso.",
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao salvar perfil');
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas informações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInstallPWA = async () => {
    try {
      // Passamos true para redirecionar para a visão de cartão virtual
      const installed = await install(true);
      if (installed) {
        toast({
          title: "Cartão virtual aberto!",
          description: "Seu cartão virtual foi aberto. Adicione-o à tela inicial para fácil acesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao abrir cartão",
        description: "Não foi possível abrir seu cartão virtual. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Meu Perfil Profissional
            </h1>
            <p className="text-gray-600">
              Personalize seu cartão virtual e compartilhe com seus clientes
            </p>
          </div>

          {/* Profile Card */}
          <Card className="p-8">
            <div className="space-y-8">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profile.photo} />
                    <AvatarFallback className="bg-[#17d300] text-white text-2xl">
                      {profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="photo-upload"
                    className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center text-white transition-opacity"
                  >
                    Alterar foto
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome completo"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biografia
                  </label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Conte um pouco sobre você"
                    disabled={!isEditing}
                    className="h-32"
                  />
                </div>

                {/* Contato */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contato
                  </h3>
                  
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Seu telefone"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Endereço
                  </h3>
                  
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <Input
                        value={profile.address}
                        onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Seu endereço"
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Select
                          disabled={!isEditing}
                          value={selectedEstado}
                          onValueChange={(value) => {
                            setSelectedEstado(value);
                            // Encontra o nome do estado selecionado
                            const estadoObj = estados.find(estado => estado.id.toString() === value);
                            if (estadoObj) {
                              setProfile(prev => ({ ...prev, state: estadoObj.nome }));
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {estados.map(estado => (
                              <SelectItem key={estado.id} value={estado.id.toString()}>
                                {estado.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Select
                          disabled={!isEditing || !selectedEstado}
                          value={profile.city}
                          onValueChange={(value) => {
                            setProfile(prev => ({ ...prev, city: value }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Cidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {cidades.map(cidade => (
                              <SelectItem key={cidade.id} value={cidade.nome}>
                                {cidade.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Redes Sociais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Redes Sociais
                  </h3>
                  
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                      <Facebook className="w-5 h-5 text-blue-600" />
                      <Input
                        value={profile.facebook}
                        onChange={(e) => setProfile(prev => ({ ...prev, facebook: e.target.value }))}
                        placeholder="Seu perfil no Facebook"
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-pink-600" />
                      <Input
                        value={profile.instagram}
                        onChange={(e) => setProfile(prev => ({ ...prev, instagram: e.target.value }))}
                        placeholder="Seu perfil no Instagram"
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5 text-blue-700" />
                      <Input
                        value={profile.linkedin}
                        onChange={(e) => setProfile(prev => ({ ...prev, linkedin: e.target.value }))}
                        placeholder="Seu perfil no LinkedIn"
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      <Input
                        value={profile.whatsapp}
                        onChange={(e) => setProfile(prev => ({ ...prev, whatsapp: e.target.value }))}
                        placeholder="Seu WhatsApp"
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-blue-500" />
                      <Input
                        value={profile.telegram}
                        onChange={(e) => setProfile(prev => ({ ...prev, telegram: e.target.value }))}
                        placeholder="Seu Telegram"
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Music2 className="w-5 h-5 text-black" />
                      <Input
                        value={profile.tiktok}
                        onChange={(e) => setProfile(prev => ({ ...prev, tiktok: e.target.value }))}
                        placeholder="Seu TikTok"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                {isEditing ? (
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1 bg-[#17d300] hover:bg-[#15bb00] text-white"
                      onClick={handleSave}
                    >
                      Salvar Alterações
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="bg-[#17d300] hover:bg-[#15bb00] text-white"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar Perfil
                  </Button>
                )}

                {!isEditing && (
                  <>
                    <div className="relative">
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-[#17d300] text-white text-xs px-2 py-1 rounded-full">
                          Novo!
                        </span>
                      </div>
                      <Button
                        className="w-full bg-black hover:bg-gray-800 text-white"
                        onClick={handleInstallPWA}
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        Abrir Cartão Virtual
                      </Button>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          // TODO: Implementar compartilhamento NFC
                          toast({
                            title: "Aproxime do outro dispositivo",
                            description: "Mantenha os dispositivos próximos para compartilhar via NFC",
                          });
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartilhar NFC
                      </Button>

                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          // Redirecionar para a página do cartão virtual
                          if (session?.user?.id) {
                            window.open(`/cartao/${session.user.id}`, '_blank');
                          } else {
                            toast({
                              title: "Erro ao gerar QR Code",
                              description: "Não foi possível identificar seu usuário",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        Gerar QR Code
                      </Button>
                    </div>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <Card className="p-4 text-center">
                        <Eye className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold text-gray-900">{metrics.views}</div>
                        <div className="text-sm text-gray-600">Visualizações</div>
                      </Card>
                      
                      <Card className="p-4 text-center">
                        <Share className="w-6 h-6 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-bold text-gray-900">{metrics.shares}</div>
                        <div className="text-sm text-gray-600">Compartilhamentos</div>
                      </Card>
                      
                      <Card className="p-4 text-center">
                        <MousePointerClick className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                        <div className="text-2xl font-bold text-gray-900">{metrics.clicks}</div>
                        <div className="text-sm text-gray-600">Cliques</div>
                      </Card>
                    </div>
                    
                    {/* Botão de Logout */}
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
