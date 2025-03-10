import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

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
