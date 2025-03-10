'use client';

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { Search, ChevronDown, Mail, Phone, MessageSquare } from "lucide-react";

export default function CentralAjudaPage() {
  const [activeTab, setActiveTab] = useState('faq');
  const [activeCategory, setActiveCategory] = useState('geral');
  const [searchQuery, setSearchQuery] = useState('');

  // Categorias de FAQ
  const categories = [
    { id: 'geral', name: 'Geral' },
    { id: 'conta', name: 'Conta e Perfil' },
    { id: 'pagamentos', name: 'Pagamentos' },
    { id: 'cartoes', name: 'Cartões Digitais' },
    { id: 'seguranca', name: 'Segurança' },
  ];

  // FAQs
  const faqs = {
    geral: [
      {
        question: 'O que é o Tappy ID?',
        answer: 'O Tappy ID é uma plataforma digital que revoluciona a forma como você compartilha suas informações de contato. Com apenas um toque ou escaneamento, você pode compartilhar seu perfil profissional, redes sociais e informações de contato instantaneamente.'
      },
      {
        question: 'Como funciona o Tappy ID?',
        answer: 'O Tappy ID utiliza tecnologia NFC (Near Field Communication) e QR Code para permitir o compartilhamento instantâneo de informações. Basta aproximar seu cartão ou dispositivo com Tappy ID de um smartphone compatível ou escanear o QR Code para compartilhar suas informações.'
      },
      {
        question: 'Quais dispositivos são compatíveis com o Tappy ID?',
        answer: 'A maioria dos smartphones modernos são compatíveis com o Tappy ID. Para a funcionalidade NFC, seu smartphone precisa ter suporte a NFC (a maioria dos smartphones Android e iPhones a partir do iPhone 7). Para o QR Code, qualquer smartphone com câmera é compatível.'
      },
    ],
    conta: [
      {
        question: 'Como criar uma conta no Tappy ID?',
        answer: 'Para criar uma conta, basta acessar nosso site ou aplicativo, clicar em "Cadastrar", preencher seus dados básicos como nome, e-mail e senha, e seguir as instruções para configurar seu perfil.'
      },
      {
        question: 'Posso ter múltiplos perfis em uma única conta?',
        answer: 'Sim! Com a conta Premium, você pode criar múltiplos perfis para diferentes contextos (profissional, pessoal, networking, etc.) e alternar facilmente entre eles conforme necessário.'
      },
      {
        question: 'Como atualizar minhas informações de perfil?',
        answer: 'Acesse sua conta, vá para "Configurações de Perfil" e você poderá editar todas as suas informações, adicionar novos links e personalizar a aparência do seu perfil.'
      },
    ],
    pagamentos: [
      {
        question: 'Quais são os planos disponíveis?',
        answer: 'Oferecemos um plano Básico gratuito com funcionalidades essenciais, e planos Premium com recursos avançados como múltiplos perfis, analytics e personalização avançada. Consulte nossa página de preços para informações atualizadas.'
      },
      {
        question: 'Quais formas de pagamento são aceitas?',
        answer: 'Aceitamos cartões de crédito (Visa, Mastercard, American Express), PayPal, Pix e boleto bancário para pagamentos no Brasil.'
      },
      {
        question: 'Como cancelar minha assinatura Premium?',
        answer: 'Você pode cancelar sua assinatura a qualquer momento através da seção "Assinatura" nas configurações da sua conta. O acesso Premium continuará disponível até o final do período pago.'
      },
    ],
    cartoes: [
      {
        question: 'Como ativar meu cartão Tappy ID?',
        answer: 'Após receber seu cartão, acesse sua conta Tappy ID, vá para "Dispositivos", selecione "Adicionar Novo Cartão" e siga as instruções para vinculá-lo ao seu perfil.'
      },
      {
        question: 'O que fazer se perder meu cartão Tappy ID?',
        answer: 'Acesse imediatamente sua conta e desative o cartão perdido na seção "Dispositivos". Isso impedirá que ele seja usado para acessar suas informações. Você pode solicitar um novo cartão através da plataforma.'
      },
      {
        question: 'Posso personalizar a aparência do meu cartão Tappy ID?',
        answer: 'Sim! Oferecemos diversas opções de personalização para o design do seu cartão, incluindo cores, logotipos e acabamentos especiais. Essas opções estão disponíveis durante o processo de pedido do cartão.'
      },
    ],
    seguranca: [
      {
        question: 'Minhas informações estão seguras com o Tappy ID?',
        answer: 'Sim. Utilizamos criptografia de ponta a ponta e seguimos rigorosos protocolos de segurança para proteger seus dados. Além disso, você tem controle total sobre quais informações compartilhar em cada situação.'
      },
      {
        question: 'Posso controlar quais informações são compartilhadas?',
        answer: 'Absolutamente! O Tappy ID permite que você crie perfis personalizados com diferentes níveis de informação. Você decide exatamente quais dados compartilhar em cada contexto.'
      },
      {
        question: 'O Tappy ID está em conformidade com a LGPD?',
        answer: 'Sim, estamos totalmente em conformidade com a Lei Geral de Proteção de Dados (LGPD) e outras legislações internacionais de proteção de dados. Detalhes completos podem ser encontrados em nossa Política de Privacidade.'
      },
    ]
  };

  // Artigos de suporte
  const supportArticles = [
    {
      title: 'Primeiros passos com o Tappy ID',
      category: 'Guia Básico',
      icon: '🚀',
      views: '4.2K'
    },
    {
      title: 'Como configurar seu perfil profissional',
      category: 'Perfil',
      icon: '👔',
      views: '3.8K'
    },
    {
      title: 'Integrando redes sociais ao seu Tappy ID',
      category: 'Integração',
      icon: '🔄',
      views: '2.9K'
    },
    {
      title: 'Problemas com NFC? Soluções rápidas',
      category: 'Solução de Problemas',
      icon: '🛠️',
      views: '5.1K'
    },
    {
      title: 'Guia de personalização avançada',
      category: 'Personalização',
      icon: '✨',
      views: '1.7K'
    },
    {
      title: 'Segurança e privacidade: Melhores práticas',
      category: 'Segurança',
      icon: '🔒',
      views: '3.3K'
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a192f] pt-40 relative">
        {/* Background com efeitos visuais */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
          <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#17d300]/20 rounded-full filter blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#17d300]/20 rounded-full filter blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Título e Subtítulo */}
          <div className="text-center mb-14">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Central de <span className="text-[#17d300]">Ajuda</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Encontre respostas rápidas para suas dúvidas sobre o Tappy ID
            </motion.p>
          </div>

          {/* Barra de Pesquisa */}
          <motion.div 
            className="max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por palavras-chave ou perguntas..."
                className="w-full py-4 pl-12 pr-4 bg-[#172a46] border border-[#233554] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#17d300]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                className="absolute right-3 top-3 px-4 py-1 bg-[#17d300] hover:bg-[#15bb00] text-white font-medium rounded-lg transition-colors duration-200"
              >
                Buscar
              </button>
            </div>
          </motion.div>

          {/* Conteúdo Principal */}
          <div className="max-w-6xl mx-auto">
            {/* Navegação de Tabs */}
            <motion.div 
              className="flex flex-wrap justify-center mb-8 gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button 
                onClick={() => setActiveTab('faq')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  activeTab === 'faq' 
                    ? 'bg-[#17d300] text-white' 
                    : 'bg-[#172a46] text-gray-300 hover:bg-[#233554]'
                }`}
              >
                Perguntas Frequentes
              </button>
              <button 
                onClick={() => setActiveTab('articles')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  activeTab === 'articles' 
                    ? 'bg-[#17d300] text-white' 
                    : 'bg-[#172a46] text-gray-300 hover:bg-[#233554]'
                }`}
              >
                Artigos de Suporte
              </button>
              <button 
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  activeTab === 'contact' 
                    ? 'bg-[#17d300] text-white' 
                    : 'bg-[#172a46] text-gray-300 hover:bg-[#233554]'
                }`}
              >
                Contato
              </button>
            </motion.div>
            
            {/* Conteúdo da Tab */}
            <div className="bg-[#112240] rounded-2xl shadow-xl overflow-hidden">
              {/* FAQ */}
              {activeTab === 'faq' && (
                <div className="p-8">
                  {/* Categorias */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeCategory === category.id ? 'bg-[#17d300] text-white' : 'bg-[#172a46] text-gray-300 hover:bg-[#233554]'}`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                  
                  {/* Perguntas e Respostas */}
                  <div className="space-y-4">
                    {faqs[activeCategory as keyof typeof faqs].map((faq, index) => (
                      <motion.div 
                        key={index}
                        className="bg-[#172a46] rounded-xl overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-white flex items-start gap-3">
                            <span className="text-[#17d300] min-w-[24px]">Q:</span>
                            {faq.question}
                          </h3>
                          <div className="mt-4 pl-9 text-gray-300">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Artigos de Suporte */}
              {activeTab === 'articles' && (
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {supportArticles.map((article, index) => (
                      <motion.div
                        key={index}
                        className="bg-[#172a46] rounded-xl p-6 hover:bg-[#233554] transition-colors duration-200 cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <div className="text-3xl mb-3">{article.icon}</div>
                        <div className="text-xs font-medium text-[#17d300] mb-2">{article.category}</div>
                        <h3 className="text-lg font-semibold text-white mb-4">{article.title}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">{article.views} visualizações</span>
                          <span className="text-sm text-[#17d300]">Ler artigo</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Contato */}
              {activeTab === 'contact' && (
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">Entre em contato</h2>
                      <p className="text-gray-300 mb-8">
                        Nossa equipe de suporte está disponível para ajudar com quaisquer dúvidas ou problemas que você possa ter com o Tappy ID.
                      </p>
                      
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-[#17d300]/20 p-3 rounded-full">
                            <Mail className="h-6 w-6 text-[#17d300]" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Email</p>
                            <p className="text-white font-medium">suporte@tappyid.com.br</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="bg-[#17d300]/20 p-3 rounded-full">
                            <Phone className="h-6 w-6 text-[#17d300]" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Telefone</p>
                            <p className="text-white font-medium">(11) 4002-8922</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="bg-[#17d300]/20 p-3 rounded-full">
                            <MessageSquare className="h-6 w-6 text-[#17d300]" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Chat</p>
                            <p className="text-white font-medium">Disponível em dias úteis, 9h às 18h</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-white mb-2">Nome</label>
                          <input 
                            type="text" 
                            id="name" 
                            className="w-full bg-[#172a46] border border-[#233554] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#17d300]"
                            placeholder="Seu nome"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-white mb-2">Email</label>
                          <input 
                            type="email" 
                            id="email" 
                            className="w-full bg-[#172a46] border border-[#233554] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#17d300]"
                            placeholder="seu.email@exemplo.com"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="subject" className="block text-white mb-2">Assunto</label>
                          <input 
                            type="text" 
                            id="subject" 
                            className="w-full bg-[#172a46] border border-[#233554] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#17d300]"
                            placeholder="Assunto da mensagem"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-white mb-2">Mensagem</label>
                          <textarea 
                            id="message" 
                            rows={5}
                            className="w-full bg-[#172a46] border border-[#233554] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#17d300]"
                            placeholder="Descreva sua dúvida ou problema detalhadamente..."
                          ></textarea>
                        </div>
                        
                        <button 
                          type="submit"
                          className="bg-[#17d300] hover:bg-[#15bb00] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 w-full"
                        >
                          Enviar Mensagem
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* CTA para Base de Conhecimento */}
            <motion.div
              className="mt-16 mb-20 bg-gradient-to-r from-[#112240] to-[#172a46] rounded-2xl p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Não encontrou o que procurava?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Acesse nossa base de conhecimento completa com tutoriais detalhados, guias e mais recursos para ajudar você a aproveitar ao máximo o Tappy ID.
              </p>
              <button className="bg-[#17d300] hover:bg-[#15bb00] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
                Explorar Base de Conhecimento
              </button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
