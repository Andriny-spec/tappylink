import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint para buscar planos do Tappy.id específicos para a plataforma TappyLink
 */
export async function GET(request: NextRequest) {
  try {
    // URL da API pública do Tappy para buscar planos
    const tappyApiUrl = "https://www.tappy.id/api/planos/publicos";
    
    // Fazer a requisição
    const response = await fetch(tappyApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error(`API respondeu com status: ${response.status}`);
      throw new Error(`Erro ao buscar planos: ${response.status}`);
    }
    
    // Processar a resposta
    const data = await response.json();
    
    // Filtrar apenas os planos para a plataforma TappyLink
    const tappyLinkPlans = data.planos?.filter((plan: any) => 
      plan.platform?.slug === 'tappylink' || 
      (plan.platform?.name && plan.platform.name.toLowerCase().includes('link'))
    ) || [];
    
    if (tappyLinkPlans.length === 0) {
      console.log("Nenhum plano encontrado para TappyLink");
      throw new Error("Nenhum plano encontrado para a plataforma TappyLink");
    }
    
    // Mapear os planos para o formato esperado pelo frontend
    const plans = tappyLinkPlans.map((plan: any) => ({
      id: plan.id,
      title: plan.name,
      price: `R$ ${Number(plan.price).toFixed(2).replace('.', ',')}`,
      installments: `6x de R$ ${(Number(plan.price) / 6).toFixed(2).replace('.', ',')}`,
      popular: plan.name.toLowerCase().includes('profissional'),
      features: plan.features || [],
      originalPrice: plan.price,
      checkoutUrl: `https://link.tappy.id/checkout/${plan.id}`
    }));
    
    return NextResponse.json(plans);

  } catch (error) {
    console.error("Erro ao buscar planos do Tappy.id:", error);
    
    // Retorna um erro 503 sem mockar dados
    return NextResponse.json(
      { 
        error: true, 
        message: "Serviço de planos temporariamente indisponível. Tente novamente mais tarde."
      },
      { status: 503 }
    );
  }
}
