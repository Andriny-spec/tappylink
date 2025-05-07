import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint para buscar planos do Tappy.id específicos para a plataforma TappyLink
 */
export async function GET(request: NextRequest) {
  try {
    // URL da API do Tappy para buscar planos para a plataforma TappyLink
    let tappyApiUrl;
    
    // Em desenvolvimento, usar URL local
    if (process.env.NODE_ENV === "development") {
      // Assumindo que o projeto principal Tappy está rodando na porta 3000
      tappyApiUrl = "http://localhost:3000/api/planos?platform=tappylink";
    } else {
      // Em produção, usar a URL do servidor real
      tappyApiUrl = "https://tappy.id/api/planos?platform=tappylink";
    }
    
    // Headers para a requisição
    const headers = {
      "Content-Type": "application/json",
      // Adicione aqui a chave de API se necessário
      // "Authorization": `Bearer ${process.env.TAPPY_API_KEY}`
    };

    // Faz a requisição para a API do Tappy.id
    const response = await fetch(tappyApiUrl, { headers });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar planos: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Retorna os planos
    return NextResponse.json({ planos: data.plans || data });
  } catch (error) {
    console.error("Erro ao buscar planos do Tappy.id:", error);
    
    // Retornar erro com status 503 (Serviço indisponível)
    return NextResponse.json(
      { 
        erro: "Serviço indisponível", 
        mensagem: "Os planos estão temporariamente indisponíveis. Por favor, tente novamente mais tarde.",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido" 
      },
      { status: 503 }
    );
  }
}
