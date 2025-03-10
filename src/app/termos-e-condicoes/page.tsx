'use client';

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { motion } from "framer-motion";

export default function TermosCondicoesPage() {
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
              Termos e <span className="text-[#17d300]">Condições</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Entenda os termos e condições de uso dos nossos serviços
            </motion.p>
          </div>

          {/* Conteúdo dos Termos */}
          <motion.div 
            className="bg-[#112240] rounded-2xl p-8 md:p-12 shadow-xl mb-10 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="prose prose-invert prose-lg max-w-none">
              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6">1. Introdução</h2>
              <p className="text-gray-300">
                Bem-vindo ao Tappy ID. Estes Termos e Condições regem o uso do nosso site, aplicativo móvel e serviços relacionados ("Serviços"). Ao acessar ou usar nossos Serviços, você concorda com estes termos. Se você não concordar com qualquer parte destes termos, não poderá acessar ou usar nossos Serviços.
              </p>
              <p className="text-gray-300">
                Estes Termos e Condições constituem um acordo legal vinculativo entre você, seja pessoalmente ou em nome de uma entidade ("você"), e Tappy ID Tecnologia Ltda. ("Empresa", "nós", "nos" ou "nosso"), em relação ao seu acesso e uso dos Serviços.
              </p>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">2. Definições</h2>
              <ul className="list-disc pl-6 text-gray-300 mt-4 mb-6">
                <li><strong>"Conteúdo do Usuário"</strong> significa qualquer informação ou dados que você enviar, postar ou transmitir através dos Serviços.</li>
                <li><strong>"Serviços"</strong> referem-se ao site, aplicativo móvel e quaisquer outros produtos ou serviços oferecidos pela Empresa.</li>
                <li><strong>"Assinatura"</strong> refere-se a qualquer plano pago que você contrata para acessar recursos específicos dos Serviços.</li>
                <li><strong>"Termos"</strong> referem-se a estes Termos e Condições.</li>
              </ul>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">3. Cadastro e Contas</h2>
              <p className="text-gray-300">
                Para utilizar certos aspectos dos Serviços, você pode precisar se cadastrar e criar uma conta. Você concorda em fornecer informações precisas, atuais e completas durante o processo de cadastro e em atualizar tais informações para mantê-las precisas, atuais e completas.
              </p>
              <p className="text-gray-300">
                Você é responsável por manter a confidencialidade de sua senha e pelo controle de acesso à sua conta. Você concorda em aceitar a responsabilidade por todas as atividades que ocorram sob sua conta ou senha. Reservamo-nos o direito de recusar o serviço, encerrar contas, remover ou editar conteúdo a nosso critério exclusivo.
              </p>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">4. Assinaturas e Pagamentos</h2>
              <p className="text-gray-300">
                Alguns aspectos dos Serviços podem estar disponíveis apenas mediante assinatura paga. Ao assinar, você concorda em pagar todas as taxas aplicáveis conforme descrito nos planos de assinatura.
              </p>
              <p className="text-gray-300">
                As taxas de assinatura são cobradas antecipadamente e não são reembolsáveis, exceto quando exigido por lei ou conforme estabelecido nestes Termos. A menos que você cancele sua assinatura, ela será renovada automaticamente pelo mesmo período e pela taxa então em vigor.
              </p>
              <p className="text-gray-300">
                Reservamo-nos o direito de alterar nossas taxas de assinatura a qualquer momento, com aviso prévio de pelo menos 30 dias antes de qualquer alteração entrar em vigor. Se você não concordar com a alteração nas taxas, poderá cancelar sua assinatura antes que a alteração entre em vigor.
              </p>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">5. Propriedade Intelectual</h2>
              <p className="text-gray-300">
                Os Serviços e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva da Empresa e seus licenciadores. Os Serviços são protegidos por direitos autorais, marcas registradas, patentes, segredos comerciais e outras leis de propriedade intelectual ou direitos de propriedade.
              </p>
              <p className="text-gray-300">
                Ao fornecer Conteúdo do Usuário para os Serviços, você concede à Empresa uma licença mundial, não exclusiva, isenta de royalties, sublicenciável e transferível para usar, reproduzir, distribuir, preparar trabalhos derivados, exibir e executar o Conteúdo do Usuário em conexão com os Serviços e os negócios da Empresa, incluindo, sem limitação, para promover e redistribuir parte ou todos os Serviços.
              </p>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">6. Conteúdo Proibido</h2>
              <p className="text-gray-300">
                Você concorda em não usar os Serviços para:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mt-4 mb-6">
                <li>Publicar, transmitir ou compartilhar qualquer conteúdo ilegal, prejudicial, ameaçador, abusivo, assediador, difamatório, vulgar, obsceno, invasivo da privacidade de outra pessoa, odioso ou racialmente, etnicamente ou de outra forma censurável.</li>
                <li>Personificar qualquer pessoa ou entidade, ou falsamente afirmar ou representar sua afiliação com uma pessoa ou entidade.</li>
                <li>Manipular identificadores para disfarçar a origem de qualquer conteúdo transmitido através dos Serviços.</li>
                <li>Carregar, postar, enviar por e-mail, transmitir ou disponibilizar qualquer material que contenha vírus de software ou qualquer outro código de computador, arquivos ou programas projetados para interromper, destruir ou limitar a funcionalidade de qualquer software ou hardware ou equipamento de telecomunicações.</li>
                <li>Interferir ou interromper os Serviços ou servidores ou redes conectadas aos Serviços, ou desobedecer quaisquer requisitos, procedimentos, políticas ou regulamentos de redes conectadas aos Serviços.</li>
              </ul>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">7. Limitação de Responsabilidade</h2>
              <p className="text-gray-300">
                Em nenhum caso a Empresa, seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis, resultantes de:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mt-4 mb-6">
                <li>Seu acesso ou uso ou incapacidade de acessar ou usar os Serviços;</li>
                <li>Qualquer conduta ou conteúdo de terceiros nos Serviços;</li>
                <li>Qualquer conteúdo obtido dos Serviços; e</li>
                <li>Acesso não autorizado, uso ou alteração de suas transmissões ou conteúdo.</li>
              </ul>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">8. Indenização</h2>
              <p className="text-gray-300">
                Você concorda em defender, indenizar e isentar a Empresa, seus funcionários, diretores, agentes, afiliados e terceiros, de e contra quaisquer reclamações, danos, obrigações, perdas, responsabilidades, custos ou dívidas e despesas (incluindo, mas não se limitando a honorários advocatícios) decorrentes de:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mt-4 mb-6">
                <li>Seu uso e acesso aos Serviços;</li>
                <li>Sua violação destes Termos;</li>
                <li>Sua violação de quaisquer direitos de terceiros, incluindo, sem limitação, quaisquer direitos autorais, de propriedade ou de privacidade; ou</li>
                <li>Qualquer alegação de que seu Conteúdo do Usuário causou danos a terceiros.</li>
              </ul>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">9. Legislação Aplicável</h2>
              <p className="text-gray-300">
                Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem levar em consideração seus princípios de conflito de leis.
              </p>
              <p className="text-gray-300">
                Qualquer disputa, controvérsia ou reclamação decorrente ou relacionada a estes Termos ou à violação, rescisão ou invalidade deles será resolvida pela Justiça da Comarca de São Paulo - SP, com renúncia expressa a qualquer outro foro, por mais privilegiado que seja.
              </p>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">10. Alterações aos Termos</h2>
              <p className="text-gray-300">
                Reservamo-nos o direito, a nosso critério exclusivo, de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer pelo menos 30 dias de aviso antes que quaisquer novos termos entrem em vigor. O que constitui uma alteração material será determinado a nosso critério exclusivo.
              </p>
              <p className="text-gray-300">
                Ao continuar a acessar ou usar nossos Serviços após essas revisões entrarem em vigor, você concorda em estar vinculado aos termos revisados. Se você não concordar com os novos termos, deixe de usar os Serviços.
              </p>

              <h2 className="text-white text-2xl font-bold border-b border-[#233554] pb-4 mb-6 mt-10">11. Contato</h2>
              <p className="text-gray-300">
                Se você tiver dúvidas sobre estes Termos e Condições, entre em contato conosco:
              </p>
              <ul className="list-none pl-0 text-gray-300 mt-4 mb-6">
                <li><strong>E-mail:</strong> juridico@tappyid.com.br</li>
                <li><strong>Telefone:</strong> (11) 4002-8922</li>
                <li><strong>Endereço:</strong> Av. Paulista, 1000, São Paulo - SP, CEP 01310-100</li>
              </ul>
            </div>
          </motion.div>

          {/* Botão de Aceitação */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-[#172a46] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <p className="text-gray-300 text-center md:text-left">
                Ao clicar em "Aceito os Termos", você confirma que leu e concorda com todos os termos e condições apresentados nesta página.
              </p>
              <button className="bg-[#17d300] hover:bg-[#15bb00] text-white font-semibold py-3 px-6 rounded-lg whitespace-nowrap transition-colors duration-300">
                Aceito os Termos
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
