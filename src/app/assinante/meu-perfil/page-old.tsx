'use client';

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
// Removendo temporariamente o Framer Motion para resolver problemas de compatibilidade
import SocialMediaSection from "./components/social-media-section";
import PhoneInput from "./components/phone-input";
import BioSection from "./components/bio-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  LogOut,
  Shield,
  Clock,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Edit3,
  Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { usePWA } from "@/hooks/use-pwa";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

/**
 * Profile component for user profile management.
 * 
 * This component provides a detailed user interface for managing and displaying
 * user profile information, including personal details, contact information, 
 * social media links, and subscription details. It interacts with external APIs 
 * to fetch and update profile and subscription data, and utilizes various UI 
 * components to render the user's profile in a structured and interactive manner.
 * 
 * Features:
 * - Fetching and displaying user profile information, including name, bio, photo, 
 *   address, and social media links.
 * - Fetching and displaying subscription information, including plan name, 
 *   status, and remaining time.
 * - Interface for editing and updating profile information.
 * - Integration with PWA for app installation.
 * - Handles loading states and error notifications.
 */
export default function Profile() {
  const { toast } = useToast();
  const { isInstallable, install } = usePWA();
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [bioAnimation, setBioAnimation] = useState(false);
  // @ts-ignore - ignorando TypeScript para o useRef pois o tipo é compatível
  const bioButtonRef = useRef<HTMLButtonElement>(null);
  
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

  // Interface para tipagem do perfil
  interface ProfileData {
    name: string;
    bio: string;
    photo: string;
    role?: string; // Profissão/cargo do usuário
    phone: string;
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

  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    bio: "",
    photo: "",
    role: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    whatsapp: "",
    telegram: "",
    tiktok: ""
  });

  interface Subscription {
    planName: string;
    status: string;
    startDate: string | null;
    endDate: string | null;
    daysRemaining: number;
    hoursRemaining: number;
    minutesRemaining: number;
    percentRemaining: number;
  }

  const [subscription, setSubscription] = useState<Subscription>({
    planName: "",
    status: "",
    startDate: null,
    endDate: null,
    daysRemaining: 0,
    hoursRemaining: 0,
    minutesRemaining: 0,
    percentRemaining: 0
  });
  
  interface Metrics {
    views: number;
    shares: number;
    clicks: number;
  }
  
  const [metrics, setMetrics] = useState<Metrics>({
    views: 0,
    shares: 0,
    clicks: 0
  });

  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);

  // Efeito para buscar dados do perfil
  useEffect(() => {
    const fetchProfile = async () => {
      if (status === 'loading') return;
      
      if (status === 'unauthenticated') {
        window.location.href = '/login';
        return;
      }
      
      setIsLoading(true);
      
      try {
        const response = await fetch('/api/assinante/profile');
        
        if (response.ok) {
          const data = await response.json();
          
          setProfile({
            name: data.profile.name || "",
            bio: data.profile.bio || "",
            photo: data.profile.photo || "",
            role: data.profile.role || "",
            phone: data.profile.phone || "",
            address: data.profile.address || "",
            city: data.profile.city || "",
            state: data.profile.state || "",
            facebook: data.profile.facebook || "",
            instagram: data.profile.instagram || "",
            linkedin: data.profile.linkedin || "",
            whatsapp: data.profile.whatsapp || "",
            telegram: data.profile.telegram || "",
            tiktok: data.profile.tiktok || ""
          });
          
          // Carregar o estado selecionado
          if (data.profile.state) {
            setSelectedEstado(data.profile.state);
          }
          
          // Carregar métricas
          if (data.metrics) {
            setMetrics({
              views: data.metrics.views || 0,
              shares: data.metrics.shares || 0,
              clicks: data.metrics.clicks || 0
            });
          }
          
        } else {
          console.error('Erro ao carregar perfil');
          toast({
            title: "Erro ao carregar perfil",
            description: "Não foi possível carregar suas informações. Tente novamente mais tarde.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Ocorreu um erro ao tentar carregar suas informações.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // Buscar dados da assinatura
    const fetchSubscription = async () => {
      if (status === 'loading' || status === 'unauthenticated') return;
      
      try {
        const response = await fetch('/api/assinante/subscription');
        
        if (response.ok) {
          const data = await response.json();
          
          // Calcular tempo restante
          let daysRemaining = 0;
          let hoursRemaining = 0;
          let minutesRemaining = 0;
          let percentRemaining = 0;
          
          if (data.subscription && data.subscription.endDate) {
            const now = new Date();
            const endDate = new Date(data.subscription.endDate);
            const startDate = data.subscription.startDate ? new Date(data.subscription.startDate) : now;
            
            // Diferença em milissegundos
            const totalDuration = endDate.getTime() - startDate.getTime();
            const timeLeft = endDate.getTime() - now.getTime();
            
            // Calcular tempo restante apenas se positivo
            if (timeLeft > 0) {
              daysRemaining = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
              hoursRemaining = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              minutesRemaining = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
              
              // Calcular percentual restante
              percentRemaining = Math.round((timeLeft / totalDuration) * 100);
            }
          }
          
          setSubscription({
            planName: data.subscription?.planName || "Plano Grátis",
            status: data.subscription?.status || "PENDENTE",
            startDate: data.subscription?.startDate || null,
            endDate: data.subscription?.endDate || null,
            daysRemaining,
            hoursRemaining,
            minutesRemaining,
            percentRemaining
          });
          
        } else {
          // Caso não consiga recuperar, usar dados padrão
          setSubscription({
            planName: "Plano Grátis",
            status: "PENDENTE",
            startDate: null,
            endDate: null,
            daysRemaining: 0,
            hoursRemaining: 0,
            minutesRemaining: 0,
            percentRemaining: 0
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados da assinatura:', error);
        // Usar valores padrão em caso de erro
        setSubscription({
          planName: "Erro ao carregar plano",
          status: "ERRO",
          startDate: null,
          endDate: null,
          daysRemaining: 0,
          hoursRemaining: 0,
          minutesRemaining: 0,
          percentRemaining: 0
        });
      }
    };
    
    // Buscar estados
    const fetchEstados = async () => {
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        if (response.ok) {
          const data = await response.json();
          setEstados(data);
        }
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
      }
    };
    
    fetchProfile();
    fetchSubscription();
    fetchEstados();
  }, [status, toast]);
  
  // Carregar cidades quando um estado for selecionado
  useEffect(() => {
    const fetchCidades = async () => {
      if (!selectedEstado) return;
      
      try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedEstado}/municipios?orderBy=nome`);
        if (response.ok) {
          const data = await response.json();
          setCidades(data);
        }
      } catch (error) {
        console.error('Erro ao carregar cidades:', error);
      }
    };
    
    fetchCidades();
  }, [selectedEstado]);
  
  // Salvar alterações no perfil
  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/assinante/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
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
          role: profile.role,
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
        // Usando animação ao trocar a foto
        setProfile(prev => ({ ...prev, photo: reader.result as string }));
        toast({
          title: "Foto atualizada",
          description: "Clique em salvar para confirmar as alterações.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para gerar biografia usando a API DeepSeek
  const generateBio = async () => {
    try {
      setIsGeneratingBio(true);
      setBioAnimation(true);
      
      const profissao = profile.role || "profissional";
      const nome = profile.name || "usuário";
      const cidade = profile.city || "";
      const estado = profile.state || "";
      
      const prompt = `Crie uma biografia profissional (entre 150 e 400 caracteres) para ${nome}, que é ${profissao}${cidade ? ` de ${cidade}` : ''}${estado ? `, ${estado}` : ''}. A bio deve ser atraente, impactante e destacar qualidades profissionais. Inclua algumas palavras-chave relevantes para a área.`;
      
      const response = await fetch('/api/generate-bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(prev => ({ ...prev, bio: data.bio }));
        toast({
          title: "Biografia gerada!",
          description: "Uma nova biografia foi criada para o seu perfil.",
        });
      } else {
        throw new Error('Falha ao gerar biografia');
      }
    } catch (error) {
      console.error("Erro ao gerar biografia:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar uma biografia. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingBio(false);
      setTimeout(() => setBioAnimation(false), 500);
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
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-down">
          {/* Header - mesmo estilo da página de planos */}
          <div className="text-center mb-8 max-w-lg mx-auto">
            <Badge className="bg-[#17d300]/10 text-[#106e00] hover:bg-[#17d300]/20 border-0 mb-3">
              Área do Assinante
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Meu Perfil Profissional
            </h1>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
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
                    <Edit3 className="w-5 h-5" />
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-sm text-gray-600">{profile.role || "Profissional"}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <Input
                    {... isEditing 
                      ? { 
                        value: profile.name,
                        onChange: (e) => setProfile(prev => ({ ...prev, name: e.target.value })) 
                      } 
                      : { defaultValue: profile.name }
                    }
                    placeholder="Seu nome completo"
                    disabled={!isEditing}
                  />
                </div>

                {/* Descrição */}
                <BioSection 
                  bio={profile.bio}
                  isEditing={isEditing}
                  isGenerating={isGeneratingBio}
                  bioAnimation={bioAnimation}
                  bioButtonRef={bioButtonRef}
                  onBioChange={(value) => setProfile(prev => ({ ...prev, bio: value }))}
                  onGenerateBio={generateBio}
                />

                {/* Contato */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contato
                  </h3>
                  
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <PhoneInput
                        id="phone"
                        value={profile.phone}
                        onChange={(value) => setProfile(prev => ({ ...prev, phone: value }))}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      <PhoneInput
                        id="whatsapp"
                        value={profile.whatsapp}
                        onChange={(value) => setProfile(prev => ({ ...prev, whatsapp: value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Localização */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Localização
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <Input
                        {... isEditing 
                          ? { 
                            value: profile.address,
                            onChange: (e) => setProfile(prev => ({ ...prev, address: e.target.value })) 
                          } 
                          : { defaultValue: profile.address }
                        }
                        placeholder="Seu endereço"
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Select
                          disabled={!isEditing}
                          {...(isEditing
                            ? {
                                value: profile.state,
                                onValueChange: (value) => {
                                  setSelectedEstado(value);
                                  setProfile(prev => ({ ...prev, state: value }));
                                }
                              }
                            : { defaultValue: profile.state }
                          )}
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
                          {...(isEditing && selectedEstado
                            ? {
                                value: profile.city,
                                onValueChange: (value) => {
                                  setProfile(prev => ({ ...prev, city: value }));
                                }
                              }
                            : { defaultValue: profile.city }
                          )}
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

                {/* Redes Sociais - Usando o componente separado */}
                <SocialMediaSection 
                  profile={profile}
                  setProfile={setProfile}
                  isEditing={isEditing}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row gap-4">
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
                    {/* Métricas - Cards com visualizações, compartilhamentos e cliques */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                      <Card className="p-2 sm:p-4 text-center">
                        <Eye className="w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-blue-500" />
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">{metrics.views}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Visualizações</div>
                      </Card>
                      
                      <Card className="p-2 sm:p-4 text-center">
                        <Share className="w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-green-500" />
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">{metrics.shares}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Compartilhamentos</div>
                      </Card>
                      
                      <Card className="p-2 sm:p-4 text-center">
                        <MousePointerClick className="w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-purple-500" />
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">{metrics.clicks}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Cliques</div>
                      </Card>
                    </div>
                    
                    {/* Plano atual - Alternativa animada */}
                    <div className="mb-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm overflow-hidden relative animate-fade-in-down">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-green-400 opacity-10 rounded-full -mr-6 -mt-6"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-emerald-400 opacity-10 rounded-full -ml-4 -mb-4"></div>
                      
                      <div className="text-sm font-medium text-green-800 mb-3 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-green-600" />
                        <span>Seu plano atual:</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-green-700">{subscription.planName}</h3>
                          <p className="text-xs text-green-600 mt-1 flex items-center">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Ativo
                          </p>
                        </div>
                        
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-green-100 hover:scale-105 transition-transform">
                          <Shield className="w-8 h-8 text-green-500" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Botão de Ver meu Cartão */}
                    <div className="hover:scale-[1.02] active:scale-[0.98] transition-transform">
                      <Button 
                        variant="outline" 
                        className="w-full mb-4 group relative overflow-hidden"
                        onClick={() => window.open(`/${session?.user?.id}`, '_blank')}
                      >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-100/0 via-blue-100/40 to-blue-100/0 transition-all duration-700 ease-in-out -translate-x-full group-hover:translate-x-full"></div>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver meu Cartão Virtual
                      </Button>
                    </motion.div>
                    </LazyMotion>
                    
                    {/* Botão de Atualizar Plano */}
                    <Button 
                      variant="outline" 
                      className="w-full mb-4"
                      onClick={() => window.location.href = "/#planos"}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Conheça o Tappy Whats
                    </Button>
                    
                    {/* Botão de Logout */}
                    <Button 
                      variant="ghost" 
                      className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      onClick={() => signOut({ callbackUrl: '/login' })}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair da Conta
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
