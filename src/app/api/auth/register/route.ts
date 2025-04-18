import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

/**
 * POST: Cadastrar um novo usuário
 */
export async function POST(request: NextRequest) {
  try {
    // Extrair dados do corpo da requisição
    const { name, email, password } = await request.json();
    
    // Validar dados recebidos
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nome, e-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }
    
    // Verificar se e-mail já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: "Este e-mail já está em uso" },
        { status: 409 }
      );
    }
    
    // Criptografar senha usando argon2 (mesmo algoritmo usado no NextAuth)
    const hashedPassword = await argon2.hash(password);
    
    // Criar usuário com papel de ASSINANTE
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "ASSINANTE",
        profile: {
          create: {
            // Criar perfil básico para o usuário
            name,
            biography: "",
            views: 0,
            shares: 0,
            clicks: 0
          }
        }
      },
      include: {
        profile: true
      }
    });
    
    // Remover senha da resposta por motivos de segurança
    const { password: _, ...userWithoutPassword } = user;
    
    // Retornar usuário criado (sem a senha)
    return NextResponse.json({
      message: "Usuário cadastrado com sucesso",
      user: userWithoutPassword
    }, { status: 201 });
    
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return NextResponse.json(
      { message: "Erro ao processar a requisição" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
