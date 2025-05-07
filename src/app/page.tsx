'use client';

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { PaymentModal } from "@/components/ui/payment-modal";
import { CheckoutModal } from "@/components/ui/checkout-modal";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FeaturesCarousel } from "@/components/ui/features-carousel";
import { motion } from "framer-motion";
import Image from "next/image";
import { Player } from '@lottiefiles/react-lottie-player';
import { InteractiveGlassCard } from "@/components/ui/interactive-glass-card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TypewriterText from "@/components/ui/typewriter-text";
import Sparkles from "@/components/icons/sparkles";

export default function Home() {
  const faqRef = useRef<HTMLDivElement>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [shouldRenderPoints, setShouldRenderPoints] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    id: string;
    title: string;
    price: string;
    originalPrice?: number;
    installments: string;
    checkoutUrl?: string;
  } | null>(null);

  const handleBuyClick = (plan: {
    id: string;
    title: string;
    price: string;
    originalPrice?: number;
    installments: string;
    checkoutUrl?: string;
  }) => {
    setSelectedPlan(plan);
    setIsCheckoutModalOpen(true);
  };

  const steps = [
    {
      title: "Crie seu cartão digital",
      description: "Cadastre-se na plataforma e personalize seu cartão profissional com suas informações essenciais.",
    },
    {
      title: "Ative o NFC ou QR Code",
      description: "Escolha entre a tecnologia NFC ou QR Code para compartilhar seus contatos com facilidade.",
    },
    {
      title: "Comece a compartilhar!",
      description: "Aproxime o celular de um cliente ou faça com que ele escaneie o QR Code para acessar seus dados instantaneamente.",
    },
  ];

  const [plans, setPlans] = useState<Array<{
    id: string;
    title: string;
    price: string;
    originalPrice?: number;
    installments: string;
    features: string[];
    popular?: boolean;
    checkoutUrl?: string;
  }>>([]);
  const [plansError, setPlansError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Serviço de planos temporariamente indisponível.');
  
  // Função para formatar o preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };
  
  // Função para calcular o valor da parcela
  const calculateInstallment = (price: number, installments: number = 6) => {
    const installmentValue = price / installments;
    return `${installments}x de ${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(installmentValue)}`;
  };
  
  // Buscar planos do banco de dados
  useEffect(() => {
    setShouldRenderPoints(true);
  }, []);

  useEffect(() => {
    // Função para calcular o valor da parcela
    const calculateInstallment = (price: number) => {
      // Divisor fixo em 6x
      const installmentCount = 6;
      const installmentValue = price / installmentCount;
      
      return `${installmentCount}x de ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(installmentValue)}`;
    };
    
    // Função para buscar planos da API
    const fetchPlans = async () => {
      try {
        // URL da API do TappyLink que busca planos do Tappy.id
        const apiUrl = '/api/planos/tappy';
        console.log('Buscando planos do Tappy.id para a plataforma TappyLink:', apiUrl);
        
        // Buscar planos da API do Tappy.id específicos para a plataforma TappyLink
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          // Se o serviço está indisponível (status 503)
          if (response.status === 503) {
            console.log('Serviço de planos temporariamente indisponível');
            setPlansError(true);
            setErrorMessage('Os planos estão temporariamente indisponíveis. Por favor, tente novamente mais tarde.');
            return;
          }
          
          throw new Error(`Erro ao buscar planos: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.planos || !Array.isArray(data.planos)) {
          console.error('Formato de resposta inválido:', data);
          setPlansError(true);
          setErrorMessage('Formato de resposta inválido');
          return;
        }
        
        if (data.planos.length === 0) {
          setPlansError(true);
          setErrorMessage('Nenhum plano disponível no momento.');
          return;
        }
        
        // Transformar os dados da API para o formato necessário para o componente
        const formattedPlans = data.planos.map((plan: any, index: number) => ({
          id: plan.id,
          title: plan.name,
          price: plan.price ? formatPrice(Number(plan.price)) : "Sob consulta",
          originalPrice: plan.price,
          installments: plan.price ? calculateInstallment(Number(plan.price)) : "Valores personalizados",
          features: plan.features || [],
          popular: plan.isHighlighted || plan.isFeatured || index === 1, // Usa o campo isHighlighted ou define o segundo plano como popular
          checkoutUrl: plan.checkoutUrl // URL de checkout da Krivano
        }));
        
        console.log('Planos carregados do Tappy.id:', formattedPlans);
        setPlans(formattedPlans);
        setPlansError(false);
      } catch (error) {
        console.error("Erro ao buscar planos do Tappy.id:", error);
        setPlansError(true);
        setErrorMessage('Serviço de planos temporariamente indisponível. Tente novamente mais tarde.');
      }
    };
    
    fetchPlans();
  }, []);

  const faqs = [
    {
      question: "O que é o Tappy ID?",
      answer: "O Tappy ID é uma solução moderna de cartão de visita digital que utiliza tecnologia NFC e QR Code para compartilhar suas informações profissionais de forma rápida e elegante.",
    },
    {
      question: "Como funciona o NFC e QR Code?",
      answer: "O NFC permite compartilhar informações aproximando dois dispositivos, enquanto o QR Code pode ser escaneado pela câmera do celular. Ambos direcionam para seu perfil profissional digital.",
    },
    {
      question: "Preciso instalar algum aplicativo?",
      answer: "Não é necessário instalar nenhum aplicativo. O Tappy ID funciona diretamente pelo navegador do celular.",
    },
    {
      question: "Posso atualizar meus dados depois?",
      answer: "Sim! Você pode atualizar suas informações a qualquer momento através da plataforma, sem precisar de um novo cartão.",
    },
    {
      question: "O Tappy ID funciona em todos os celulares?",
      answer: "Sim! O QR Code funciona em qualquer celular com câmera. Para NFC, é necessário que o dispositivo tenha suporte a esta tecnologia.",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-[200vh] bg-[#0a192f] pt-40 relative">
        {/* Background com efeitos visuais animados */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grade de fundo */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30" />
          
          {/* Blur verde superior com movimento fluido */}
          <motion.div 
            className="absolute w-full h-[600px] bg-[#17d300]/40 blur-[120px]"
            animate={{
              x: ['-5%', '5%', '-5%'],
              y: ['5%', '-5%', '5%']
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear"
            }}
            style={{ top: 0, left: 0 }}
          />
          
          {/* Blur verde centro-direita com movimento */}
          <motion.div 
            className="absolute w-[800px] h-[600px] bg-[#17d300]/40 blur-[100px]"
            animate={{
              x: ['5%', '-5%', '5%'],
              y: ['10%', '0%', '10%']
            }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "linear"
            }}
            style={{ top: '700px', right: 0 }}
          />
          
          {/* Blur azul escuro centro-esquerda com movimento */}
          <motion.div 
            className="absolute w-[800px] h-[600px] bg-[#112240]/60 blur-[100px]"
            animate={{
              x: ['-10%', '10%', '-10%'],
              y: ['10%', '-5%', '10%']
            }}
            transition={{
              repeat: Infinity,
              duration: 30,
              ease: "linear"
            }}
            style={{ top: '1200px', left: 0 }}
          />
          
          {/* Blur verde adicional para mais movimento */}
          <motion.div 
            className="absolute w-[500px] h-[500px] bg-[#17d300]/30 blur-[90px] rounded-full"
            animate={{
              x: ['0%', '10%', '0%', '-10%', '0%'],
              y: ['0%', '-10%', '-20%', '-10%', '0%']
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: "linear"
            }}
            style={{ top: '400px', right: '20%' }}
          />
        </div>
        
        {/* Pontos flutuantes - renderizados apenas no cliente para evitar erro de hidratação */}
        {shouldRenderPoints && (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#17d300]/50"
                initial={{ 
                  x: Math.random() * 100 + "%", 
                  y: Math.random() * 100 + "%",
                  opacity: 0.3,
                  scale: 0.3
                }}
                animate={{ 
                  opacity: [0.3, 0.7, 0.3],
                  scale: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3 + Math.random() * 4,
                  ease: "easeInOut"
                }}
                style={{
                  width: 8 + Math.random() * 16,
                  height: 8 + Math.random() * 16,
                }}
              />
            ))}
          </div>
        )}
        
        {/* Filtro semi-transparente para o efeito glassmorphism */}
        <div className="absolute inset-0 bg-[#0a192f]/80 backdrop-blur-md" />
        
        {/* Container principal para todo o conteúdo */}
        <div className="relative w-full pt-10 z-10">
        
          {/* Hero Section */}
          <section className="relative py-20 overflow-hidden">
            <div className="container px-4 mx-auto text-center">
              <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
                <motion.div 
                  className="h-[120px] mb-6 flex items-center justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold font-['Poppins']">
                    <TypewriterText 
                      texts={[
                        "Torne sua identidade digital mais profissional!",
                        "Compartilhe seus contatos de forma moderna e prática!",
                        "Impressione seus clientes com o Tappy ID!"
                      ]}
                      typingSpeed={50}
                      deletingSpeed={30}
                      pauseBetweenTexts={2500}
                      loop={true}
                      highlightSecondWord={true}
                    />
                  </h1>
                </motion.div>
                <motion.p 
                  className="text-xl text-gray-300 mb-8 font-['Poppins']"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  A forma mais moderna e prática de compartilhar seu contato profissional!
                </motion.p>
                <motion.p 
                  className="text-gray-400 mb-8 font-['Poppins'] max-w-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  Pare de perder oportunidades por falta de um cartão de visita atualizado! O Tappy ID permite que você compartilhe suas informações de forma simples, elegante e digital, utilizando NFC e QR Code.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#17d300] to-[#15bb00] rounded-full opacity-70 blur-md group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  <Button
                    className="bg-[#17d300] hover:bg-[#15bb00] text-white font-['Poppins'] font-semibold py-6 px-10 rounded-full relative z-10 shadow-lg shadow-[#17d300]/20"
                    size="lg"
                    onClick={() => faqRef.current?.scrollIntoView({ behavior: "smooth" })}
                  >
                    TESTE GRÁTIS AGORA
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>

          <FeaturesCarousel />

          {/* How it Works Section */}
          <section className="py-20" id="como-funciona">
            <div className="container px-4 mx-auto">
              <div className="flex flex-col items-center mb-16">
                <motion.div
                  className="px-3 py-1 rounded-full bg-[#17d300]/20 border border-[#17d300]/40 mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-[#17d300] text-sm font-semibold font-poppins">SIMPLES E PRÁTICO</span>
                </motion.div>
                <motion.h2 
                  className="text-3xl md:text-5xl font-bold text-center text-white mb-4 font-poppins"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Como funciona o <span className="bg-gradient-to-r from-[#17d300] to-[#15bb00] bg-clip-text text-transparent">Tappy ID</span>?
                </motion.h2>
                <motion.p
                  className="text-gray-400 text-center max-w-2xl mb-10 font-poppins"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Três passos simples para revolucionar a forma como você compartilha seus contatos profissionais
                </motion.p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center px-6 py-8 rounded-xl backdrop-blur-sm bg-[#112240]/50 border border-[#233554] shadow-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index, duration: 0.8 }}
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(23, 211, 0, 0.1)" }}
                  >
                    <motion.div 
                      className="w-16 h-16 rounded-full bg-[#17d300] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6 shadow-md shadow-[#17d300]/30"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {index + 1}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-4 font-poppins">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 font-poppins">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="py-24 backdrop-blur-sm" id="planos">
            <div className="container px-4 mx-auto">
              <div className="flex flex-col items-center mb-16">
                <motion.div
                  className="px-3 py-1 rounded-full bg-[#17d300]/20 border border-[#17d300]/40 mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-[#17d300] text-sm font-semibold font-poppins">ESCOLHA SEU PLANO</span>
                </motion.div>
                <motion.h2 
                  className="text-3xl md:text-5xl font-bold text-center text-white mb-4 font-poppins"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Planos <span className="bg-gradient-to-r from-[#17d300] to-[#15bb00] bg-clip-text text-transparent">acessíveis</span> para todos
                </motion.h2>
                <motion.p
                  className="text-gray-400 text-center max-w-2xl mb-10 font-poppins"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Escolha o plano ideal para suas necessidades e comece a compartilhar seu contato de forma profissional
                </motion.p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 pt-6">
                {plansError ? (
                  <div className="col-span-1 md:col-span-3 text-center py-12">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-[#0a192f]/80 p-8 rounded-2xl border border-[#233554] max-w-2xl mx-auto"
                    >
                      <h3 className="text-xl text-white font-semibold mb-4">Indisponível no momento</h3>
                      <p className="text-gray-300 mb-6">{errorMessage}</p>
                      <Button 
                        variant="outline" 
                        className="bg-[#233554] text-white hover:bg-[#17d300] border-gray-600"
                        onClick={() => window.location.reload()}
                      >
                        Tentar novamente
                      </Button>
                    </motion.div>
                  </div>
                ) : plans.length > 0 ? (
                  plans.map((plan, index) => (
                    <div key={index} className="relative">
                      {/* Badge Popular */}
                      {plan.popular && (
                        <div className="absolute -top-6 inset-x-0 flex justify-center z-50">
                          <motion.div 
                            className="bg-[#17d300] text-white px-6 py-1.5 rounded-full text-sm font-medium shadow-xl shadow-[#17d300]/20 border border-[#ffffff]/20 font-poppins"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: [0.9, 1.1, 1] }}
                            transition={{ duration: 0.5 }}
                          >
                            MAIS POPULAR
                          </motion.div>
                        </div>
                      )}
                      
                      {/* Card principal */}
                      <motion.div
                        className={`backdrop-blur-md bg-[#0a192f]/40 p-0 rounded-3xl overflow-hidden flex flex-col h-full ${plan.popular || plan.title === "Plano Empresarial" ? "ring-2 ring-[#17d300]" : "ring-1 ring-[#233554]/50"}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 * index, duration: 0.8 }}
                        whileHover={{ 
                          y: -10,
                          boxShadow: plan.popular
                            ? "0 20px 40px -10px rgba(23, 211, 0, 0.3)"
                            : "0 20px 40px -15px rgba(10, 25, 47, 0.5)" 
                        }}
                      >
                        {/* Header do card com gradiente */}
                        <div className={`p-1 ${plan.popular ? "bg-gradient-to-r from-[#17d300] to-[#17d300]/80" : "bg-gradient-to-r from-[#233554] to-[#0a192f]"}` }>
                          <div className={`p-4 ${plan.popular ? "bg-[#17d300]/10" : "bg-[#0a192f]/80"} rounded-t-2xl`}>
                            <h3 className="text-2xl font-bold text-white text-center font-poppins pt-1">{plan.title}</h3>
                          </div>
                        </div>
                        
                        {/* Conteúdo do card */}
                        <div className="p-8 flex flex-col flex-grow">
                          {/* Preço com design destacado */}
                          <div className="flex flex-col items-center mb-8">
                            <p className="text-5xl font-bold text-white mb-1 font-poppins">
                              <span className={`${plan.popular ? "text-[#17d300]" : "text-white"}`}>{plan.price}</span>
                            </p>
                            <p className="text-gray-400 font-poppins">ou {plan.installments}</p>
                          </div>
                          
                          {/* Linha divisória com gradiente */}
                          <div className={`h-px w-full my-4 ${plan.popular ? "bg-gradient-to-r from-transparent via-[#17d300]/30 to-transparent" : "bg-gradient-to-r from-transparent via-[#233554]/50 to-transparent"}`}></div>
                          
                          {/* Lista de features */}
                          <ul className="space-y-5 mb-8 flex-grow">
                            {plan.features.map((feature, featureIndex) => (
                              <motion.li 
                                key={featureIndex} 
                                className="flex items-start gap-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 * featureIndex, duration: 0.5 }}
                              >
                                <Check className="text-[#17d300] w-6 h-6" />
                                <span className="text-gray-300">{feature}</span>
                              </motion.li>
                            ))}
                          </ul>
                          
                          {/* Botão de compra */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative"
                          >
                            <div className="absolute -inset-1 bg-[#17d300]/30 rounded-full blur-md animate-pulse"></div>
                            <Button
                              className="bg-[#17d300] text-white hover:bg-[#15bb00] font-poppins font-semibold py-6 px-10 rounded-full relative z-10 shadow-lg"
                              size="lg"
                              onClick={() => handleBuyClick(plan)}
                            >
                              {plan.title === "Plano Empresarial"
                                ? "SOLICITAR ORÇAMENTO"
                                : "COMPRAR AGORA"}
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-3 text-center py-12">
                    <div className="flex justify-center">
                      <div className="h-16 w-16 rounded-full border-4 border-t-[#17d300] border-r-[#17d300] border-b-transparent border-l-transparent animate-spin"></div>
                    </div>
                    <p className="text-gray-300 mt-4">Carregando planos...</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <div className="relative overflow-hidden bg-gradient-to-r from-[#0a192f] to-[#172a46] rounded-[22px] p-8 md:p-12 shadow-xl">
                {/* Pattern background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{ backgroundImage: "url('/blue-pattern.svg')", backgroundSize: "40px 40px" }}></div>
                  <div className="absolute right-0 bottom-0 w-64 h-64 transform translate-x-1/4 translate-y-1/4 bg-[#17d300] rounded-full opacity-20 blur-2xl"></div>
                  <div className="absolute left-0 top-0 w-96 h-96 transform -translate-x-1/3 -translate-y-1/3 bg-[#17d300] rounded-full opacity-20 blur-3xl"></div>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="">
                    <motion.h2 
                      className="text-3xl md:text-4xl font-bold text-white mb-3 font-poppins"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      Pronto para transformar sua presença profissional?
                    </motion.h2>
                    <motion.h3 
                      className="text-xl font-semibold text-white/90 mb-4 font-poppins"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      Dê um passo à frente com o Tappy ID
                    </motion.h3>
                    <motion.p 
                      className="text-white/80 mb-8 text-lg font-poppins"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      Junte-se a milhares de profissionais que já estão usando o Tappy ID para compartilhar suas informações de contato de forma moderna, prática e profissional. Nosso cartão digital é a chave para criar conexões mais significativas e duradouras.
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative inline-block"
                    >
                      <div className="absolute -inset-1 bg-[#17d300]/30 rounded-full blur-md animate-pulse"></div>
                      <Button
                        className="bg-[#17d300] text-white hover:bg-[#15bb00] font-poppins font-semibold py-6 px-10 rounded-full relative z-10 shadow-lg"
                        size="lg"
                        onClick={() => window.open('/cadastro', '_blank')}
                      >
                        COMEÇAR AGORA
                      </Button>
                    </motion.div>
                  </div>
                  
                  {/* Animação Lottie */}
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="relative w-full max-w-md"
                    >
                      <div className="w-full flex items-center justify-center">
                        <InteractiveGlassCard />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20" ref={faqRef} id="faq">
            <div className="container px-4 mx-auto">
              <div className="flex flex-col items-center mb-16">
                <motion.div
                  className="px-3 py-1 rounded-full bg-[#17d300]/20 border border-[#17d300]/40 mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-[#17d300] text-sm font-semibold font-poppins">TIRE SUAS DÚVIDAS</span>
                </motion.div>
                <motion.h2 
                  className="text-3xl md:text-5xl font-bold text-center text-white mb-4 font-poppins"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Perguntas <span className="bg-gradient-to-r from-[#17d300] to-[#15bb00] bg-clip-text text-transparent">frequentes</span>
                </motion.h2>
                <motion.p
                  className="text-gray-400 text-center max-w-2xl mb-10 font-poppins"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Encontre respostas para as principais dúvidas sobre o Tappy ID e como ele pode ajudar sua carreira
                </motion.p>
              </div>
              <motion.div 
                className="max-w-3xl mx-auto rounded-2xl bg-[#112240]/50 backdrop-blur-sm p-6 border border-[#233554] shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem 
                      key={`faq-${index}`} 
                      value={`faq-${index}`}
                      className="border-b border-[#233554] last:border-0"
                    >
                      <AccordionTrigger className="text-white hover:text-white font-poppins font-medium py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400 font-poppins pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
              <motion.div 
                className="text-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className="text-gray-300 mb-6 font-poppins">
                  Ainda tem dúvidas? Nossa equipe está pronta para ajudar!
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="bg-[#17d300] hover:bg-[#15bb00] text-white font-['Poppins'] rounded-full shadow-md shadow-[#17d300]/20 py-2 px-6"
                    onClick={() => window.location.href = "mailto:suporte@tappyid.com"}
                  >
                    ENTRAR EM CONTATO COM O SUPORTE
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </section>


        </div>
      </main>
      <Footer />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan}
      />
      
      {/* Modal de Checkout Tappy.id */}
      {selectedPlan && (
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          plan={selectedPlan}
        />
      )}
    </>
  );
}
