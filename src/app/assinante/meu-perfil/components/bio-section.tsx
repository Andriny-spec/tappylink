"use client";

import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";

interface BioSectionProps {
  bio: string;
  isEditing: boolean;
  isGenerating: boolean;
  bioAnimation: boolean;
  bioButtonRef: React.RefObject<HTMLButtonElement | null>;
  onBioChange: (value: string) => void;
  onGenerateBio: () => void;
}

// Componente reescrito sem usar Framer Motion para evitar problemas de renderização de objetos
export default function BioSection({
  bio,
  isEditing,
  isGenerating,
  bioAnimation,
  bioButtonRef,
  onBioChange,
  onGenerateBio
}: BioSectionProps) {
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
        <div className={`transition-opacity duration-300 ${bioAnimation ? 'opacity-70' : 'opacity-100'}`}>
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
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-md hover:scale-[1.01] transition-transform duration-200">
          <div className="text-sm text-gray-700 p-3 bg-gray-50 rounded-md min-h-[100px] whitespace-pre-wrap">
            {bio || "Nenhuma biografia adicionada."}
          </div>
        </div>
      )}
    </div>
  );
}
