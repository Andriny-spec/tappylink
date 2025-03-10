'use client';

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { motion } from "framer-motion";

export default function PoliticasPrivacidadePage() {
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
              Políticas de <span className="text-[#17d300]">Privacidade</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Entenda como coletamos, utilizamos e protegemos suas informações
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
              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6">Introdução</h2>
              <p className="text-gray-300">
                A Tappy ID valoriza a privacidade dos usuários e está comprometida em proteger suas informações pessoais. Esta Política de Privacidade descreve como coletamos, usamos, compartilhamos e protegemos suas informações quando você utiliza nosso aplicativo, website e serviços relacionados.
              </p>
              <p className="text-gray-300">
                Ao utilizar nossos serviços, você concorda com a coleta e uso de informações de acordo com esta política. As informações pessoais que coletamos são utilizadas para fornecer e melhorar nossos serviços. Não utilizaremos ou compartilharemos suas informações com ninguém, exceto conforme descrito nesta Política de Privacidade.
              </p>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">Coleta e Uso de Informações</h2>
              <p className="text-gray-300">
                Para proporcionar uma melhor experiência durante a utilização dos nossos serviços, podemos solicitar que você nos forneça certas informações pessoais identificáveis, incluindo, mas não se limitando a:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mt-4 mb-6">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Número de telefone</li>
                <li>Informações profissionais (cargo, empresa, etc.)</li>
                <li>Foto de perfil</li>
                <li>Redes sociais e informações de contato</li>
              </ul>
              <p className="text-gray-300">
                As informações que solicitamos serão armazenadas por nós e utilizadas conforme descrito nesta política de privacidade. Também podemos coletar informações que seu navegador envia sempre que você visita nosso site ou acessa o aplicativo. Esses dados de registro podem incluir informações como o endereço de Protocolo de Internet (IP) do seu computador, tipo de navegador, versão do navegador, as páginas que você visita, a hora e data da sua visita, o tempo gasto nessas páginas e outras estatísticas.
              </p>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">Uso de Cookies</h2>
              <p className="text-gray-300">
                Cookies são arquivos com pequena quantidade de dados, que podem incluir um identificador exclusivo anônimo. Os cookies são enviados para o seu navegador a partir de um site e armazenados no disco rígido do seu dispositivo.
              </p>
              <p className="text-gray-300">
                Utilizamos cookies para coletar informações. Você pode instruir seu navegador a recusar todos os cookies ou a indicar quando um cookie está sendo enviado. No entanto, se você não aceitar cookies, você pode não ser capaz de usar algumas partes do nosso serviço.
              </p>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">Compartilhamento de Informações</h2>
              <p className="text-gray-300">
                Não compartilhamos suas informações pessoais com terceiros, exceto nas seguintes circunstâncias:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mt-4 mb-6">
                <li>Com o seu consentimento expresso.</li>
                <li>Para cumprir qualquer lei aplicável, regulamento, processo legal ou solicitação governamental.</li>
                <li>Para proteger os direitos, propriedade ou segurança da Tappy ID, nossos usuários ou o público.</li>
                <li>Em caso de fusão, venda ou transferência de ativos, suas informações podem ser transferidas como parte desse processo.</li>
              </ul>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">Segurança</h2>
              <p className="text-gray-300">
                A segurança das suas informações pessoais é importante para nós, mas lembre-se que nenhum método de transmissão pela internet ou método de armazenamento eletrônico é 100% seguro. Embora nos esforcemos para usar meios comercialmente aceitáveis para proteger suas informações pessoais, não podemos garantir sua segurança absoluta.
              </p>
              
              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">Seus Direitos</h2>
              <p className="text-gray-300">
                De acordo com a Lei Geral de Proteção de Dados (LGPD) e outras leis de proteção de dados aplicáveis, você tem os seguintes direitos:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mt-4 mb-6">
                <li>Direito de acesso às suas informações pessoais.</li>
                <li>Direito de retificação de informações imprecisas ou incompletas.</li>
                <li>Direito de exclusão de suas informações pessoais.</li>
                <li>Direito de restringir o processamento de suas informações.</li>
                <li>Direito à portabilidade de dados.</li>
                <li>Direito de oposição ao processamento de suas informações pessoais.</li>
              </ul>
              <p className="text-gray-300">
                Para exercer qualquer um desses direitos, entre em contato conosco através dos canais indicados abaixo.
              </p>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">Alterações a Esta Política de Privacidade</h2>
              <p className="text-gray-300">
                Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos sobre quaisquer alterações publicando a nova Política de Privacidade nesta página e, se as alterações forem significativas, enviaremos um aviso por e-mail ou através de nosso aplicativo.
              </p>
              <p className="text-gray-300">
                Recomendamos que você revise esta Política de Privacidade periodicamente para quaisquer alterações. As alterações a esta Política de Privacidade são efetivas quando publicadas nesta página.
              </p>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">Contato</h2>
              <p className="text-gray-300">
                Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco:
              </p>
              <ul className="list-none pl-0 text-gray-300 mt-4 mb-6">
                <li><strong>E-mail:</strong> privacidade@tappyid.com.br</li>
                <li><strong>Telefone:</strong> (11) 4002-8922</li>
                <li><strong>Endereço:</strong> Av. Paulista, 1000, São Paulo - SP, CEP 01310-100</li>
              </ul>
            </div>
          </motion.div>

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
