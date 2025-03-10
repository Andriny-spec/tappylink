import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Buscar o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verificar a senha
    const isValidPassword = await argon2.verify(user.password, password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Senha incorreta" },
        { status: 401 }
      );
    }
    
    // Determinar URL de redirecionamento com base no papel do usuário
    const isAdmin = user.role.toUpperCase() === 'ADMIN';
    const redirectUrl = isAdmin ? '/dashboard' : '/assinante/meu-perfil';

    // Retornar os dados do usuário (sem a senha) e URL de redirecionamento
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.profile?.name || 'Usuário',
      },
      redirectUrl,
    });
  } catch (error) {
    console.error("Erro na verificação de login:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao processar a solicitação" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
