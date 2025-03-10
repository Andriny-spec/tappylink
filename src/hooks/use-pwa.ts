import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Verifica se estamos em um ambiente PWA
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    
    // Se estamos em modo standalone (PWA) e não temos sessão, redireciona para login
    if (isInStandaloneMode && !session) {
      router.push('/login');
    }
    
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      // Armazenamos globalmente para uso posterior
      window.deferredPrompt = e as BeforeInstallPromptEvent;
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [session, router]);

  const install = async (redirectToCardView = false) => {
    // Se o redirecionamento estiver ativado e tivermos uma sessão, vamos para o cartão virtual
    if (redirectToCardView && session?.user?.id) {
      // Abrir a URL do cartão virtual em uma nova aba
      const cardUrl = `/cartao/${session.user.id}`;
      window.open(cardUrl, '_blank');
      return true;
    }
    
    // Caso contrário, tenta instalar o PWA normalmente
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);

    // Se o usuário aceitou e temos o ID da sessão, redirecionamos para o cartão virtual
    if (outcome === 'accepted' && redirectToCardView && session?.user?.id) {
      const cardUrl = `/cartao/${session.user.id}`;
      router.push(cardUrl);
    }

    return outcome === 'accepted';
  };

  return {
    isInstallable,
    install,
  };
}
