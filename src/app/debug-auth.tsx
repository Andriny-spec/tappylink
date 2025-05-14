'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

/**
 * Componente de depuração para verificar problemas de autenticação
 * Adicione este componente em sua página de login ou layout para diagnosticar problemas
 */
export function DebugAuth() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('==== DEBUG AUTH ====');
    console.log('Status de autenticação:', status);
    console.log('Dados da sessão:', session);
    
    // Verificar cookies disponíveis
    console.log('Cookies disponíveis:', document.cookie);
    
    // Verificar localStorage
    console.log('Local Storage:', Object.keys(localStorage));
  }, [session, status]);

  const handleForceSignOut = async () => {
    // Forçar logout para limpar qualquer estado inconsistente
    await signOut({ redirect: false });
    console.log('Logout forçado realizado');
    
    // Limpar cookies manualmente
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    
    console.log('Cookies limpos');
    
    // Atualizar a página após 1 segundo
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 bg-black/80 text-white text-xs rounded-tl-md z-50">
      <div>Status: {status}</div>
      <div>Usuário: {session?.user?.email || 'Nenhum'}</div>
      <button 
        onClick={handleForceSignOut}
        className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
      >
        Forçar Logout
      </button>
    </div>
  );
}
