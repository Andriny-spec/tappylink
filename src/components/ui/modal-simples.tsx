'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ModalSimplesProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function ModalSimples({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalSimplesProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Fecha o modal quando ESC é pressionado
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Impede a rolagem do corpo quando o modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Fecha o modal quando clica fora dele
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={cn(
          "w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200",
          className
        )}
      >
        <div className="relative">
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </Button>

          <div className="mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          {children}

          {footer && (
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ModalHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
      {...props}
    />
  );
}

export function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
      {...props}
    />
  );
}

export function ModalTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export function ModalDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
