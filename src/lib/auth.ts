// Arquivo auxiliar para fornecer a função auth para ser usada em todo o projeto
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";

// Reexporta a configuração do NextAuth para evitar problemas de tipagem
// e manter a compatibilidade com o código existente

// Esta função é um proxy para getServerSession que já conhece as opções do NextAuth
export async function auth() {
  // Importação dinâmica para evitar problemas de tipagem circular
  const { authOptions } = await import("../../pages/api/auth/[...nextauth]");
  return await getServerSession(authOptions as unknown as NextAuthOptions);
}
