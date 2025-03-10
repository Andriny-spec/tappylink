import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Esta rota vai redirecionar para o cartão do usuário logado
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user?.id) {
      // Redireciona para o cartão do usuário
      return NextResponse.redirect(new URL(`/cartao/${session.user.id}`, request.url));
    } else {
      // Se não há usuário logado, redireciona para a página inicial
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (error) {
    console.error("Erro ao redirecionar:", error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
