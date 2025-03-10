'use client';

import { usePathname } from 'next/navigation';
import { ChatButton } from './chat-button';

export function ChatWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Não mostrar o botão de chat em páginas do dashboard
  const showChatButton = pathname ? !pathname.includes('/dashboard') : true;
  
  return (
    <>
      {children}
      {showChatButton && <ChatButton />}
    </>
  );
}
