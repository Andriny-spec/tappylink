import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Buscar dados do perfil para o cartão virtual (acesso público)
export async function GET(request: NextRequest) {
  try {
    // Obter ID do usuário da query
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    console.log('Buscando perfil para o usuário ID:', userId);
    
    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário não fornecido" },
        { status: 400 }
      );
    }
    
    // Buscar o perfil diretamente pelo userId (mais simples e direto)
    const profile = await prisma.profile.findUnique({
      where: { userId: userId }
    });
    
    console.log('Perfil encontrado?', !!profile);
    
    if (!profile) {
      // Se não encontrou o perfil, tentar buscar o usuário
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      console.log('Usuário encontrado?', !!user);
      
      if (!user) {
        return NextResponse.json(
          { error: "Usuário não encontrado" },
          { status: 404 }
        );
      }
      
      // Usuário existe, mas sem perfil
      return NextResponse.json(
        { error: "Perfil não encontrado para este usuário" },
        { status: 404 }
      );
    }
    
    // Buscar o usuário para obter o email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    // Perfil encontrado, preparar dados formatados para o cartão
    const cartaoData = {
      id: profile.id,
      name: profile.name || "",
      email: user?.email || "", // Agora obtendo o email do objeto user
      phone: profile.phone || "",
      biography: profile.biography || "",
      photo: profile.photo || "",
      address: profile.address || "",
      city: profile.city || "",
      state: profile.state || "",
      facebook: profile.facebook || "",
      instagram: profile.instagram || "",
      linkedin: profile.linkedin || "",
      whatsapp: profile.whatsapp || "",
      telegram: profile.telegram || "",
      tiktok: profile.tiktok || ""
    };
    
    // Incrementar contador de visualizações (opcional)
    await prisma.profile.update({
      where: { userId },
      data: { views: { increment: 1 } }
    }).catch(() => {
      // Silenciar erro se o contador não existir
      console.log("Não foi possível incrementar visualizações");
    });
    
    // Retornar dados do perfil formatados para o cartão
    console.log('Dados do cartão preparados:', cartaoData);
    return NextResponse.json(cartaoData);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao buscar perfil" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
