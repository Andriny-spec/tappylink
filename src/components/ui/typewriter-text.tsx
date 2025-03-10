'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delay?: number;
  pauseBetweenTexts?: number;
  loop?: boolean;
  highlightSecondWord?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  texts,
  typingSpeed = 60,
  deletingSpeed = 40,
  delay = 500,
  pauseBetweenTexts = 2000,
  loop = true,
  highlightSecondWord = false,
}) => {
  // Certifique-se de que temos ao menos um texto para exibir
  const safeTexts = texts && texts.length > 0 ? texts : ['Texto padrão'];
  
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Referência para manter o último timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Função para limpar o timer atual
  const clearCurrentTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Limpar timers quando o componente for desmontado
  useEffect(() => {
    return () => clearCurrentTimer();
  }, []);

  // Reset everything when texts prop changes
  useEffect(() => {
    clearCurrentTimer();
    setDisplayText('');
    setCurrentIndex(0);
    setCurrentTextIndex(0);
    setIsTyping(false);
    setIsDeleting(false);
    setIsPaused(false);
    
    // Reiniciar o processo após um breve atraso
    timerRef.current = setTimeout(() => {
      setIsTyping(true);
    }, delay);
    
  }, [delay, safeTexts]);

  // Main typing/deleting animation logic
  useEffect(() => {
    if (!isTyping || isPaused) return;
    
    clearCurrentTimer(); // Limpar qualquer timer existente

    // Get current text to work with
    const currentText = safeTexts[currentTextIndex];
    
    if (!isDeleting) {
      // Typing mode
      if (currentIndex < currentText.length) {
        timerRef.current = setTimeout(() => {
          setDisplayText(prev => prev + currentText[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, typingSpeed);
      } else {
        // Reached end of current text, pause before deleting
        timerRef.current = setTimeout(() => {
          setIsDeleting(true);
        }, pauseBetweenTexts);
      }
    } else {
      // Deleting mode
      if (currentIndex > 0) {
        timerRef.current = setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1));
          setCurrentIndex(prev => prev - 1);
        }, deletingSpeed);
      } else {
        // Finished deleting, move to next text
        setIsDeleting(false);
        const nextTextIndex = (currentTextIndex + 1) % safeTexts.length;
        setCurrentTextIndex(nextTextIndex);
        
        // Pequena pausa antes de começar o próximo texto
        timerRef.current = setTimeout(() => {}, 300);
      }
    }
  }, [currentIndex, currentTextIndex, safeTexts, isTyping, isDeleting, isPaused, typingSpeed, deletingSpeed, pauseBetweenTexts, loop]);

  // Apply highlighting to second word if needed
  const displayTextWithHighlight = () => {
    if (!highlightSecondWord) {
      return (
        <>
          {displayText}<span className="animate-pulse">|</span>
        </>
      );
    }
    
    const words = displayText.split(' ');
    
    if (words.length < 2) {
      return (
        <>
          {displayText}<span className="animate-pulse">|</span>
        </>
      );
    }

    return (
      <>
        <span className="text-white">{words[0]} </span>
        {words.length > 2 ? (
          <>
            <span className="bg-gradient-to-r from-[#17d300] to-[#15bb00] bg-clip-text text-transparent font-extrabold">
              {words[1]}
            </span>
            <span className="text-white"> {words.slice(2).join(' ')}</span>
          </>
        ) : (
          <span className="bg-gradient-to-r from-[#17d300] to-[#15bb00] bg-clip-text text-transparent font-extrabold">
            {words[1]}
          </span>
        )}
        <span className="animate-pulse">|</span>
      </>
    );
  };

  return <>{displayTextWithHighlight()}</>;
};

export default TypewriterText;
