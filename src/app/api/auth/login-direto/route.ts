import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Buscar o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
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

    // Criar uma sessão manualmente
    const sessionToken = uuidv4();
    const expiresIn = 24 * 60 * 60 * 1000; // 24 horas
    const expires = new Date(Date.now() + expiresIn);

    // Criar um cookie de sessão
    cookies().set({
      name: "next-auth.session-token",
      value: sessionToken,
      expires,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Determinar destino com base no papel
    const destino = user.role.toUpperCase() === "ADMIN" 
      ? "/dashboard" 
      : "/assinante/meu-perfil";

    // Retornar sucesso com o destino para redirecionamento
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.profile?.name || 'Usuário',
        email: user.email,
        role: user.role,
      },
      destino
    });
  } catch (error) {
    console.error("Erro no login direto:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao processar a solicitação" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
