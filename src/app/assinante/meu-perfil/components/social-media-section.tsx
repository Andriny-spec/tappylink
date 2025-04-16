"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  MessageCircle, 
  Music2,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface ProfileData {
  name: string;
  bio: string;
  photo: string;
  role?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  whatsapp: string;
  telegram: string;
  tiktok: string;
  [key: string]: any;
};

interface SocialMediaSectionProps {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
  isEditing: boolean;
}

export default function SocialMediaSection({
  profile,
  setProfile,
  isEditing
}: SocialMediaSectionProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Redes Sociais
      </label>
      
      {/* Facebook */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-8 flex-shrink-0">
          <Facebook className="h-5 w-5 text-blue-600" />
        </div>
        <Input
          placeholder="Link do Facebook"
          {... isEditing 
            ? { 
              value: profile.facebook,
              onChange: (e) => setProfile((prev: ProfileData) => ({ ...prev, facebook: e.target.value })) 
            } 
            : { defaultValue: profile.facebook }
          }
          disabled={!isEditing}
          className={isEditing ? "focus-within:ring-blue-600 focus-within:border-blue-600" : ""}
        />
      </div>
      
      {/* Instagram */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-8 flex-shrink-0">
          <Instagram className="h-5 w-5 text-pink-600" />
        </div>
        <Input
          placeholder="Link do Instagram"
          {... isEditing 
            ? { 
              value: profile.instagram,
              onChange: (e) => setProfile((prev: ProfileData) => ({ ...prev, instagram: e.target.value })) 
            } 
            : { defaultValue: profile.instagram }
          }
          disabled={!isEditing}
          className={isEditing ? "focus-within:ring-pink-600 focus-within:border-pink-600" : ""}
        />
      </div>
      
      {/* LinkedIn */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-8 flex-shrink-0">
          <Linkedin className="h-5 w-5 text-blue-800" />
        </div>
        <Input
          placeholder="Link do LinkedIn"
          {... isEditing 
            ? { 
              value: profile.linkedin,
              onChange: (e) => setProfile((prev: ProfileData) => ({ ...prev, linkedin: e.target.value })) 
            } 
            : { defaultValue: profile.linkedin }
          }
          disabled={!isEditing}
          className={isEditing ? "focus-within:ring-blue-800 focus-within:border-blue-800" : ""}
        />
      </div>
      
      {/* Telegram */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-8 flex-shrink-0">
          <MessageCircle className="h-5 w-5 text-blue-500" />
        </div>
        <Input
          placeholder="Seu Telegram"
          {... isEditing 
            ? { 
              value: profile.telegram,
              onChange: (e) => setProfile((prev: ProfileData) => ({ ...prev, telegram: e.target.value })) 
            } 
            : { defaultValue: profile.telegram }
          }
          disabled={!isEditing}
          className={isEditing ? "focus-within:ring-blue-500 focus-within:border-blue-500" : ""}
        />
      </div>
      
      {/* TikTok */}
      <div className="flex items-center space-x-2">
        <div className="w-8 flex-shrink-0">
          <Music2 className="h-5 w-5 text-black" />
        </div>
        <Input
          placeholder="Seu TikTok"
          {... isEditing 
            ? { 
              value: profile.tiktok,
              onChange: (e) => setProfile((prev: ProfileData) => ({ ...prev, tiktok: e.target.value })) 
            } 
            : { defaultValue: profile.tiktok }
          }
          disabled={!isEditing}
          className={isEditing ? "focus-within:ring-gray-900 focus-within:border-gray-900" : ""}
        />
      </div>
      
      {/* Dicas interativas abaixo das redes sociais */}
      {isEditing && (
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm animate-fade-in-down">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">Dicas para melhorar seu perfil</h3>
              <ul className="text-xs text-blue-700 space-y-1.5">
                <li className="flex items-center gap-1 animate-fade-in-down" style={{animationDelay: '0.1s'}}>
                  <CheckCircle2 className="h-3 w-3 flex-shrink-0" /> 
                  Adicione links completos (com https://) para suas redes sociais
                </li>
                <li className="flex items-center gap-1 animate-fade-in-down" style={{animationDelay: '0.2s'}}>
                  <CheckCircle2 className="h-3 w-3 flex-shrink-0" /> 
                  Use a mesma foto de perfil em todas suas redes para fortalecer sua marca
                </li>
                <li className="flex items-center gap-1 animate-fade-in-down" style={{animationDelay: '0.3s'}}>
                  <CheckCircle2 className="h-3 w-3 flex-shrink-0" /> 
                  Mantenha sua biografia atualizada com suas conquistas recentes
                </li>
                <li className="flex items-center gap-1 animate-fade-in-down" style={{animationDelay: '0.4s'}}>
                  transition={{ delay: 0.6 }}
                >
                  <CheckCircle2 className="h-3 w-3 flex-shrink-0" /> 
                  Inclua número de telefone com DDD para facilitar o contato
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
