'use client';

import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

interface LottiePlayerProps {
  src: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
}

export function LottiePlayer({
  src,
  className = '',
  autoplay = true,
  loop = true,
}: LottiePlayerProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Carregar o arquivo JSON da animação
    fetch(src)
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Erro ao carregar animação Lottie:', error));
  }, [src]);

  if (!animationData) {
    return <div className={`${className} flex items-center justify-center`}>
      <div className="w-10 h-10 rounded-full border-4 border-[#17d300] border-t-transparent animate-spin"></div>
    </div>;
  }

  return (
    <Lottie
      animationData={animationData}
      className={className}
      loop={loop}
      autoplay={autoplay}
      rendererSettings={{
        preserveAspectRatio: 'xMidYMid slice',
      }}
    />
  );
}
