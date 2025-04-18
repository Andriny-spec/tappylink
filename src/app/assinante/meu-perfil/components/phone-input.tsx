"use client";

import React, { forwardRef } from 'react';
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";
import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
  className?: string;
}

// Componente InputMask que mantém a aparência do shadcn/ui
export default function PhoneInput({
  value,
  onChange,
  disabled = false,
  placeholder = "(99) 99999-9999",
  id,
  className
}: PhoneInputProps) {
  // Ref para o input interno para acessar métodos e propriedades quando necessário
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full">
      <IMaskInput
        mask="(00) 00000-0000"
        unmask={false}
        value={value}
        onAccept={(value: any) => !disabled && onChange(value)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={disabled}
        id={id}
        // Aplicando estilos para manter a consistência com shadcn/ui e garantir texto legível
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
          "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium", 
          "placeholder:text-gray-500 text-gray-900 focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[#17d300] focus-visible:border-[#17d300] focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 pr-10 shadow-sm",
          className
        )}
        // Garantir que temos acesso ao elemento de input subjacente
        inputRef={inputRef}
      />
      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  );
}
