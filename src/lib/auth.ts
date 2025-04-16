// Arquivo auxiliar para fornecer a função auth para ser usada em todo o projeto
import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";

// Esta função é um proxy para getServerSession que já conhece as opções do NextAuth
export async function auth() {
  const { getAuthOptions } = await import("../../pages/api/auth/[...nextauth]");
  const options = await getAuthOptions();
  return await getServerSession(options as unknown as NextAuthOptions);
}
