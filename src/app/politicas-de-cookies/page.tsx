'use client';

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { motion } from "framer-motion";

export default function PoliticasCookiesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a192f] pt-40 relative">
        {/* Background com efeitos visuais animados */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grade de fundo */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
          
          {/* Círculos luminosos */}
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
              Políticas de <span className="text-[#17d300]">Cookies</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Entenda como utilizamos cookies para melhorar sua experiência
            </motion.p>
          </div>

          {/* Conteúdo das Políticas */}
          <motion.div 
            className="bg-[#112240] rounded-2xl p-8 md:p-12 shadow-xl mb-10 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="prose prose-invert prose-lg max-w-none">
              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6">O que são Cookies?</h2>
              <p className="text-gray-300">
                Cookies são pequenos arquivos de texto que são armazenados em seu computador ou dispositivo móvel quando você visita um site. Eles são amplamente utilizados para fazer com que os sites funcionem de maneira mais eficiente, bem como para fornecer informações aos proprietários do site.
              </p>
              <p className="text-gray-300">
                Os cookies podem ser "cookies persistentes" ou "cookies de sessão". Cookies persistentes permanecem em seu computador ou dispositivo móvel quando você fica offline, enquanto cookies de sessão são excluídos assim que você fecha o navegador.
              </p>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">Como Utilizamos os Cookies</h2>
              <p className="text-gray-300">
                Na Tappy ID, utilizamos cookies para diversos fins. Alguns cookies são necessários por razões técnicas para que nosso site e aplicativo funcionem corretamente, e os chamamos de cookies "essenciais" ou "estritamente necessários".
              </p>
              <p className="text-gray-300">
                Outros cookies também nos permitem rastrear e direcionar os interesses de nossos usuários para melhorar a experiência em nosso site. Terceiros nos servem cookies para análise e marketing, conforme detalhado abaixo.
              </p>
              
              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">Tipos de Cookies que Utilizamos</h2>
              
              <h3 className="text-[#17d300] text-xl font-semibold mt-6 mb-3">Cookies Necessários</h3>
              <p className="text-gray-300">
                Estes cookies são essenciais para fornecer a você os serviços disponíveis em nosso site e permitir que você use alguns de seus recursos. Sem esses cookies, os serviços que você solicita não podem ser fornecidos. Esses cookies não coletam informações sobre você que poderiam ser usadas para marketing ou para lembrar onde você esteve na internet.
              </p>
              <div className="mt-4 mb-6">
                <div className="bg-[#0a192f] p-4 rounded-lg border border-[#233554]">
                  <p className="text-sm text-gray-400 mb-2"><span className="text-[#17d300] font-semibold">Nome do Cookie:</span> session_id</p>
                  <p className="text-sm text-gray-400 mb-2"><span className="text-[#17d300] font-semibold">Finalidade:</span> Gerenciar sua sessão e manter você conectado</p>
                  <p className="text-sm text-gray-400"><span className="text-[#17d300] font-semibold">Duração:</span> Sessão</p>
                </div>
              </div>
              
              <h3 className="text-[#17d300] text-xl font-semibold mt-6 mb-3">Cookies de Funcionalidade</h3>
              <p className="text-gray-300">
                Estes cookies são usados para reconhecer você quando você retorna ao nosso site. Isso nos permite personalizar nosso conteúdo para você, cumprimentá-lo pelo nome e lembrar suas preferências (por exemplo, sua escolha de idioma ou região).
              </p>
              <div className="mt-4 mb-6">
                <div className="bg-[#0a192f] p-4 rounded-lg border border-[#233554]">
                  <p className="text-sm text-gray-400 mb-2"><span className="text-[#17d300] font-semibold">Nome do Cookie:</span> user_preferences</p>
                  <p className="text-sm text-gray-400 mb-2"><span className="text-[#17d300] font-semibold">Finalidade:</span> Armazenar suas preferências de idioma e tema</p>
                  <p className="text-sm text-gray-400"><span className="text-[#17d300] font-semibold">Duração:</span> 1 ano</p>
                </div>
              </div>
              
              <h3 className="text-[#17d300] text-xl font-semibold mt-6 mb-3">Cookies Analíticos e de Desempenho</h3>
              <p className="text-gray-300">
                Esses cookies nos permitem contar visitas e fontes de tráfego para que possamos medir e melhorar o desempenho do nosso site. Eles nos ajudam a saber quais páginas são as mais e menos populares e ver como os visitantes se movem pelo site.
              </p>
              <div className="mt-4 mb-6">
                <div className="bg-[#0a192f] p-4 rounded-lg border border-[#233554]">
                  <p className="text-sm text-gray-400 mb-2"><span className="text-[#17d300] font-semibold">Nome do Cookie:</span> _ga (Google Analytics)</p>
                  <p className="text-sm text-gray-400 mb-2"><span className="text-[#17d300] font-semibold">Finalidade:</span> Gerar dados estatísticos sobre como os visitantes usam o site</p>
                  <p className="text-sm text-gray-400"><span className="text-[#17d300] font-semibold">Duração:</span> 2 anos</p>
                </div>
              </div>
              
              <h3 className="text-[#17d300] text-xl font-semibold mt-6 mb-3">Cookies de Marketing</h3>
              <p className="text-gray-300">
                Esses cookies são usados para rastrear os visitantes em sites. A intenção é exibir anúncios que sejam relevantes e envolventes para o usuário individual e, portanto, mais valiosos para editores e anunciantes terceirizados.
              </p>
              <div className="mt-4 mb-6">
                <div className="bg-[#0a192f] p-4 rounded-lg border border-[#233554]">
                  <p className="text-sm text-gray-400 mb-2"><span className="text-[#17d300] font-semibold">Nome do Cookie:</span> _fbp (Facebook Pixel)</p>
                  <p className="text-sm text-gray-400 mb-2"><span className="text-[#17d300] font-semibold">Finalidade:</span> Rastrear conversões de anúncios do Facebook</p>
                  <p className="text-sm text-gray-400"><span className="text-[#17d300] font-semibold">Duração:</span> 3 meses</p>
                </div>
              </div>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">Como Controlar os Cookies</h2>
              <p className="text-gray-300">
                Você pode configurar seu navegador para recusar todos ou alguns cookies do navegador, ou para alertá-lo quando os sites definem ou acessam cookies. Se você desabilitar ou recusar cookies, observe que algumas partes deste site podem se tornar inacessíveis ou não funcionar corretamente.
              </p>
              <p className="text-gray-300">
                A maioria dos navegadores permite algum controle da maioria dos cookies através das configurações do navegador. Para saber mais sobre cookies, incluindo como ver quais cookies foram configurados e como gerenciá-los e excluí-los, visite <a href="https://www.allaboutcookies.org" className="text-[#17d300] hover:underline" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.
              </p>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">Cookies de Terceiros</h2>
              <p className="text-gray-300">
                Além de nossos próprios cookies, podemos também usar vários cookies de terceiros para reportar estatísticas de uso do site, entregar anúncios em nosso site, e assim por diante. Esses cookies podem ser de:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mt-4 mb-6">
                <li>Google Analytics</li>
                <li>Facebook</li>
                <li>LinkedIn</li>
                <li>Hotjar</li>
                <li>Entre outros</li>
              </ul>
              
              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">Alterações a Esta Política de Cookies</h2>
              <p className="text-gray-300">
                Podemos atualizar nossa Política de Cookies de tempos em tempos. Notificaremos você sobre quaisquer alterações publicando a nova Política de Cookies nesta página.
              </p>
              <p className="text-gray-300">
                Recomendamos que você revise esta Política de Cookies periodicamente para quaisquer alterações. As alterações a esta Política de Cookies são efetivas quando publicadas nesta página.
              </p>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">Contato</h2>
              <p className="text-gray-300">
                Se você tiver dúvidas sobre esta Política de Cookies, entre em contato conosco:
              </p>
              <ul className="list-none pl-0 text-gray-300 mt-4 mb-6">
                <li><strong>E-mail:</strong> privacidade@tappyid.com.br</li>
                <li><strong>Telefone:</strong> (11) 4002-8922</li>
                <li><strong>Endereço:</strong> Av. Paulista, 1000, São Paulo - SP, CEP 01310-100</li>
              </ul>
            </div>
          </motion.div>

          {/* Botão de Aceitar Cookies */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-[#172a46] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <p className="text-gray-300 text-center md:text-left">
                Ao clicar em "Aceitar Todos os Cookies", você concorda com o armazenamento de cookies em seu dispositivo para melhorar a navegação no site, analisar o uso do site e auxiliar em nossos esforços de marketing.
              </p>
              <button className="bg-[#17d300] hover:bg-[#15bb00] text-white font-semibold py-3 px-6 rounded-lg whitespace-nowrap transition-colors duration-300">
                Aceitar Todos os Cookies
              </button>
            </motion.div>
          </div>

          {/* Data de Atualização */}
          <motion.div 
            className="text-center text-gray-400 text-sm mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Última atualização: 10 de Março de 2025
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
