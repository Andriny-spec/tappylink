'use client';

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SobreNosPage() {
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

        <div className="container mx-auto px-4 pb-20 relative z-10">
          {/* Título e Subtítulo */}
          <div className="text-center mb-14">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Sobre <span className="text-[#17d300]">Nós</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Conheça a equipe e a missão por trás do Tappy ID, transformando a maneira 
              como profissionais compartilham informações de contato.
            </motion.p>
          </div>

          {/* Seção Nossa História */}
          <motion.section 
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-[#112240] rounded-2xl p-8 md:p-12 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Nossa História</h2>
                  <p className="text-gray-300 mb-4">
                    A Tappy ID nasceu da visão de transformar a maneira como as pessoas se conectam profissionalmente. Em um mundo cada vez mais digital, percebemos a necessidade de uma solução moderna para compartilhamento de informações que fosse ao mesmo tempo tecnológica e pessoal.
                  </p>
                  <p className="text-gray-300 mb-4">
                    Fundada em 2023 por um grupo de empreendedores apaixonados por tecnologia e inovação, nossa empresa cresceu rapidamente, atendendo profissionais de diversos setores que buscam destacar-se em um mercado cada vez mais competitivo.
                  </p>
                  <p className="text-gray-300">
                    Nossa jornada é movida pela crença de que a tecnologia deve simplificar e enriquecer as interações humanas, não substituí-las. É esse princípio que guia cada decisão que tomamos.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#17d300] to-[#15bb00] rounded-2xl blur opacity-20"></div>
                  <div className="relative h-[350px] rounded-2xl overflow-hidden border border-[#233554]">
                    <Image 
                      src="/nossa-historia.jpg" 
                      alt="Nossa História" 
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Seção Missão, Visão e Valores */}
          <motion.section 
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#112240] rounded-2xl p-8 shadow-xl border border-[#233554] hover:border-[#17d300]/50 transition-all duration-300">
                <div className="w-14 h-14 bg-[#17d300]/10 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[#17d300]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Missão</h3>
                <p className="text-gray-300">
                  Capacitar profissionais com ferramentas tecnológicas inovadoras que transformem a maneira como eles se apresentam e conectam-se em um mundo cada vez mais digital, proporcionando experiências memoráveis e eficientes.
                </p>
              </div>
              
              <div className="bg-[#112240] rounded-2xl p-8 shadow-xl border border-[#233554] hover:border-[#17d300]/50 transition-all duration-300">
                <div className="w-14 h-14 bg-[#17d300]/10 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[#17d300]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Visão</h3>
                <p className="text-gray-300">
                  Ser reconhecida globalmente como a principal referência em soluções de networking digital, estabelecendo novos padrões de interação profissional que unem tecnologia e conexões humanas de forma harmoniosa.
                </p>
              </div>
              
              <div className="bg-[#112240] rounded-2xl p-8 shadow-xl border border-[#233554] hover:border-[#17d300]/50 transition-all duration-300">
                <div className="w-14 h-14 bg-[#17d300]/10 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[#17d300]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Valores</h3>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#17d300] mr-2">•</span>
                    <span>Inovação constante</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#17d300] mr-2">•</span>
                    <span>Excelência em experiência do usuário</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#17d300] mr-2">•</span>
                    <span>Compromisso com a sustentabilidade</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#17d300] mr-2">•</span>
                    <span>Ética e transparência</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#17d300] mr-2">•</span>
                    <span>Responsabilidade social</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Seção Equipe */}
          <motion.section 
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 text-center">Nossa Equipe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Carlos Silva",
                  position: "CEO & Fundador",
                  image: "/team-1.jpg"
                },
                {
                  name: "Marina Oliveira",
                  position: "Diretora de Tecnologia",
                  image: "/team-2.jpg"
                },
                {
                  name: "Rafael Santos",
                  position: "Diretor de Marketing",
                  image: "/team-3.jpg"
                },
                {
                  name: "Juliana Costa",
                  position: "Diretora de Operações",
                  image: "/team-4.jpg"
                }
              ].map((member, index) => (
                <motion.div 
                  key={index}
                  className="bg-[#112240] rounded-2xl overflow-hidden shadow-xl border border-[#233554] hover:border-[#17d300]/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative h-60 w-full">
                    <Image 
                      src={member.image} 
                      alt={member.name} 
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-[#17d300]">{member.position}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Nossos Números */}
          <motion.section 
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-[#112240] rounded-2xl p-10 shadow-xl border border-[#233554]">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 text-center">Nossos Números</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { number: "10k+", label: "Usuários Ativos" },
                  { number: "35+", label: "Países Atendidos" },
                  { number: "98%", label: "Satisfação dos Clientes" },
                  { number: "24/7", label: "Suporte Dedicado" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="text-4xl md:text-5xl font-bold text-[#17d300] mb-2">{stat.number}</div>
                    <div className="text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-[#0a192f] to-[#172a46] rounded-[22px] p-8 md:p-12 shadow-xl border border-[#233554]">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{ backgroundImage: "url('/blue-pattern.svg')", backgroundSize: "40px 40px" }}></div>
                <div className="absolute right-0 bottom-0 w-64 h-64 transform translate-x-1/4 translate-y-1/4 bg-[#17d300] rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute left-0 top-0 w-96 h-96 transform -translate-x-1/3 -translate-y-1/3 bg-[#17d300] rounded-full opacity-20 blur-3xl"></div>
              </div>

              <div className="relative z-10 text-center">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold text-white mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Junte-se a nós nessa jornada
                </motion.h2>
                <motion.p 
                  className="text-gray-300 mb-8 max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Descubra como o Tappy ID pode transformar sua presença profissional e ajudá-lo a criar conexões significativas em um mundo digital.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <button 
                    className="bg-[#17d300] hover:bg-[#15bb00] text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300"
                    onClick={() => window.open('/cadastro', '_blank')}
                  >
                    COMECE SUA JORNADA AGORA
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </>
  );
}
