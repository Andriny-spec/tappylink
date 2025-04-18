import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Sparkles from '../icons/sparkles';

interface InteractiveGlassCardProps {
  className?: string;
}

export function InteractiveGlassCard({ className }: InteractiveGlassCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Partículas de AI
  const particles = Array(12).fill(0);
  
  // Cores do branding (verde)
  const colors = ['#10B981', '#059669', '#34D399', '#047857'];
  
  // Motion values para animação suave
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transformar movimento do mouse em rotação
  const rotateXOutput = useTransform(y, [-100, 100], [10, -10]);
  const rotateYOutput = useTransform(x, [-100, 100], [-10, 10]);
  
  // Brilho dinâmico
  const glowX = useTransform(x, [-100, 100], ['30%', '70%']);
  const glowY = useTransform(y, [-100, 100], ['30%', '70%']);

  // Handler de movimento do mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calcular posição relativa ao centro
    const relativeX = e.clientX - centerX;
    const relativeY = e.clientY - centerY;
    
    // Atualizar motion values
    x.set(relativeX);
    y.set(relativeY);
    
    setMousePosition({ x: relativeX, y: relativeY });
  };

  // Resetar animação quando o mouse sai
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div 
      className={`relative h-[450px] w-full max-w-md overflow-hidden rounded-3xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTap={() => {
        // Adiciona um pequeno "impulso" na animação quando clicado
        x.set(x.get() * 1.5);
        y.set(y.get() * 1.5);
        setTimeout(() => {
          x.set(0);
          y.set(0);
        }, 400);
      }}
      style={{
        perspective: 1000,
      }}
    >
      {/* Card com efeito glassmorphism */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/10 backdrop-blur-xl rounded-3xl p-6 border border-emerald-300/20 shadow-xl"
        style={{
          rotateX: rotateXOutput,
          rotateY: rotateYOutput,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Efeito de ruído */}
        <div className="absolute inset-0 bg-noise opacity-10 mix-blend-soft-light" />
        
        {/* Brilho dinâmico */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.8) 0%, rgba(5,150,105,0) 70%)',
            top: glowY,
            left: glowX,
            width: '80%',
            height: '80%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* Conteúdo do cartão */}
        <div className="relative h-full w-full flex flex-col items-center justify-center">
          {/* Ícone e elementos de brilho */}
          <motion.div 
            className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-6 relative"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(16,185,129,0.5)',
                '0 0 40px rgba(5,150,105,0.3)',
                '0 0 20px rgba(16,185,129,0.5)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(40px)'
            }}
          >
            <Image 
              src="/assets/images/logo-icon.svg" 
              alt="Tappy Logo"
              width={48}
              height={48}
              className="z-10"
            />
            
            {/* Círculos girando */}
            <motion.div 
              className="absolute inset-0 border-2 border-white/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          
          {/* Texto principal */}
          <motion.h3 
            className="text-xl font-semibold text-white mb-2 font-poppins"
            style={{
              transform: 'translateZ(30px)',
              transformStyle: 'preserve-3d',
            }}
          >
            Seu Cartão Virtual Inteligente
          </motion.h3>
          
          <motion.p 
            className="text-emerald-100/80 text-center max-w-xs"
            style={{
              transform: 'translateZ(20px)',
              transformStyle: 'preserve-3d',
            }}
          >
            Potencializado por IA para criar a melhor experiência
          </motion.p>
          
          {/* Botão interativo */}
          <motion.button
            className="mt-8 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full text-white font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              transform: 'translateZ(50px)',
              transformStyle: 'preserve-3d',
              boxShadow: '0 8px 16px -2px rgba(16,185,129,0.2)'
            }}
          >
            Explorar recursos
          </motion.button>
          
          {/* Elementos informativos flutuantes */}
          <div className="absolute w-full h-full top-0 left-0">
            {/* QR Code */}
            <motion.div
              className="absolute top-8 right-8 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-emerald-300/20"
              style={{
                transform: 'translateZ(40px)',
                transformStyle: 'preserve-3d',
              }}
              animate={{
                y: [0, -8, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-600 to-green-700 p-2 flex items-center justify-center mb-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <rect x="7" y="7" width="3" height="3" />
                    <rect x="14" y="7" width="3" height="3" />
                    <rect x="7" y="14" width="3" height="3" />
                    <rect x="14" y="14" width="3" height="3" />
                  </svg>
                </div>
                <span className="text-xs text-white font-medium">QR Code</span>
              </div>
            </motion.div>
            
            {/* NFC */}
            <motion.div
              className="absolute bottom-12 right-12 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-emerald-300/20"
              style={{
                transform: 'translateZ(30px)',
                transformStyle: 'preserve-3d',
              }}
              animate={{
                y: [0, 8, 0],
                rotate: [0, -5, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 3.5,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-600 to-green-700 p-2 flex items-center justify-center mb-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
                    <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
                    <path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" />
                    <path d="M16.37 2a20.16 20.16 0 0 1 0 20" />
                  </svg>
                </div>
                <span className="text-xs text-white font-medium">NFC Tap</span>
              </div>
            </motion.div>
            
            {/* IA */}
            <motion.div
              className="absolute bottom-16 left-8 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-emerald-300/20"
              style={{
                transform: 'translateZ(35px)',
                transformStyle: 'preserve-3d',
              }}
              animate={{
                y: [0, -10, 0],
                x: [0, 5, 0],
                rotate: [0, 3, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-600 to-green-700 p-2 flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-white font-medium">IA Boost</span>
              </div>
            </motion.div>
          </div>
          
          {/* Partículas de AI flutuantes */}
          <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence>
              {isHovered && particles.map((_, index) => {
                const size = Math.random() * 6 + 2;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const initialX = Math.random() * 360;
                const initialY = Math.random() * 360;
                const duration = Math.random() * 2 + 1;
                
                return (
                  <motion.div
                    key={index}
                    className="absolute rounded-full"
                    initial={{ 
                      x: initialX, 
                      y: initialY, 
                      opacity: 0, 
                      scale: 0 
                    }}
                    animate={{ 
                      x: initialX + (Math.random() * 100 - 50), 
                      y: initialY + (Math.random() * 100 - 50), 
                      opacity: 0.8, 
                      scale: 1 
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0 
                    }}
                    transition={{ 
                      duration, 
                      repeat: Infinity, 
                      repeatType: "reverse" 
                    }}
                    style={{
                      width: size,
                      height: size,
                      backgroundColor: color,
                      boxShadow: `0 0 ${size}px ${color}`
                    }}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
