"use client";

import React from 'react';
import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";

interface BioSectionProps {
  bio: string;
  isEditing: boolean;
  isGenerating: boolean;
  bioAnimation: boolean;
  bioButtonRef: React.RefObject<HTMLButtonElement>;
  onBioChange: (value: string) => void;
  onGenerateBio: () => void;
}

export default function BioSection({
  bio,
  isEditing,
  isGenerating,
  bioAnimation,
  bioButtonRef,
  onBioChange,
  onGenerateBio
}: BioSectionProps) {
  // Definimos as propriedades de animação fora do JSX para evitar renderização direta de objetos
  const textareaAnimationProps = {
    initial: { opacity: 1 },
    animate: { opacity: bioAnimation ? 0.7 : 1 },
    transition: { duration: 0.3 }
  };

  const bioBoxAnimationProps = {
    className: "relative overflow-hidden rounded-md",
    whileHover: { scale: 1.01 },
    transition: { duration: 0.2 }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="bio">Sua Biografia</Label>
        {isEditing && (
          <Button 
            ref={bioButtonRef}
            variant="ghost" 
            size="sm" 
            className="h-8 gap-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50" 
            onClick={onGenerateBio}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
            Gerar com IA
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <LazyMotion features={domAnimation}>
          <motion.div {...textareaAnimationProps}>
            <Textarea 
              id="bio"
              value={bio}
              onChange={(e) => onBioChange(e.target.value)}
              placeholder="Conte um pouco sobre você e seu trabalho..."
              className="resize-none min-h-[150px]"
            />
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>{bio.length}</span>/400 caracteres
              {bio.length > 300 && bio.length <= 400 && (
                <span className="text-amber-500">• Quase no limite</span>
              )}
              {bio.length > 400 && (
                <span className="text-red-500">• Excedeu o limite</span>
              )}
            </div>
          </motion.div>
        </LazyMotion>
      ) : (
        <LazyMotion features={domAnimation}>
          <motion.div {...bioBoxAnimationProps}>
            <motion.p 
              className="text-sm text-gray-700 p-3 bg-gray-50 rounded-md min-h-[100px] whitespace-pre-wrap"
            >
              {bio || "Nenhuma biografia adicionada."}
            </motion.p>
          </motion.div>
        </LazyMotion>
      )}
    </div>
  );
}
