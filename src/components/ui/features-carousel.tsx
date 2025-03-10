"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import { Shield, CreditCard, Award, Gift, Zap, Users, Globe, Lock } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Segurança Avançada",
    description: "Proteção de dados com criptografia de ponta a ponta e autenticação em dois fatores.",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: Zap,
    title: "Ultra Rápido",
    description: "Compartilhe seus contatos em milissegundos com tecnologia NFC de última geração.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Rede Global",
    description: "Conecte-se com profissionais de todo o mundo através de nossa plataforma.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Globe,
    title: "Multiplataforma",
    description: "Acesse seu perfil de qualquer lugar, em qualquer dispositivo, a qualquer momento.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Lock,
    title: "Privacidade Total",
    description: "Controle total sobre suas informações com configurações granulares de privacidade.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Gift,
    title: "Recompensas",
    description: "Ganhe pontos e benefícios exclusivos ao usar e indicar o Tappy ID.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Award,
    title: "Líder do Mercado",
    description: "Reconhecido como a melhor solução de networking digital do Brasil.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: CreditCard,
    title: "Pagamento Seguro",
    description: "Transações protegidas com as melhores práticas de segurança do mercado.",
    gradient: "from-teal-500 to-emerald-500",
  },
]

export function FeaturesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: true,
  })

  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (!emblaApi) return

    const onScroll = () => {
      const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()))
      setScrollProgress(progress * 100)
    }

    emblaApi.on("scroll", onScroll)
    onScroll()

    return () => {
      emblaApi.off("scroll", onScroll)
    }
  }, [emblaApi])

  return (
    <div className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <motion.div
            className="px-3 py-1 rounded-full bg-[#17d300]/20 border border-[#17d300]/40 mb-4"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#17d300] text-sm font-semibold font-poppins">RECURSOS EXCLUSIVOS</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold text-center text-white mb-4 font-poppins"
          >
            Por que o <span className="bg-gradient-to-r from-[#17d300] to-[#15bb00] bg-clip-text text-transparent">Tappy ID</span> é a melhor opção?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 text-center max-w-2xl mb-10 font-poppins"
          >
            Descubra por que milhares de profissionais escolhem nossa plataforma para compartilhar seus contatos de forma moderna
          </motion.p>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            <AnimatePresence>
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex-[0_0_280px] min-w-0 pl-4"
                  >
                    <div 
                      className="relative h-[400px] rounded-xl p-6 overflow-hidden group cursor-pointer"
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {/* Gradient Background */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                        <div className={`w-full h-full bg-gradient-to-br ${feature.gradient}`} />
                      </div>

                      {/* Border Gradient */}
                      <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-br from-transparent via-gray-700 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Content */}
                      <div className="relative h-full flex flex-col items-center text-center">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-4 mb-6 transform group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className="w-full h-full text-white" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#17d300] transition-colors duration-500">
                          {feature.title}
                        </h3>
                        
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                          {feature.description}
                        </p>

                        {/* Hover Effect */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#17d300] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-1 group-hover:translate-y-0" />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 max-w-3xl mx-auto px-4">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#17d300] to-[#15bb00]"
              style={{ width: `${scrollProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
