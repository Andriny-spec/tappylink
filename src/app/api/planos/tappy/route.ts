import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint para buscar planos do Tappy.id específicos para a plataforma TappyLink
 */
export async function GET(request: NextRequest) {
  try {
    // URL do endpoint público que realmente funciona
    const tappyApiUrl = "https://www.tappy.id/api/planos/publicos";
    
    // Fazer a requisição
    const response = await fetch(tappyApiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Revalidar a cada hora
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar planos: ${response.status}`);
    }
    
    // Processar a resposta
    const data = await response.json();
    
    // Encontrar o produto TappyLink
    const tappyLinkProduct = data.find((product: any) => 
      product.id === 'tappy-tappylink'
    );
    
    if (!tappyLinkProduct?.plans?.length) {
      throw new Error('Nenhum plano encontrado para a plataforma TappyLink');
    }
    
    // Mapear os planos para o formato esperado pelo frontend
    const plans = tappyLinkProduct.plans.map((plan: any) => ({
      id: plan.id,
      title: plan.title,
      price: `R$ ${plan.price.monthly.toFixed(2).replace('.', ',')}`,
      installments: `6x de R$ ${(plan.price.monthly / 6).toFixed(2).replace('.', ',')}`,
      popular: true, // Marcar como popular pois é o único plano
      features: plan.features.filter((f: any) => f.included).map((f: any) => f.title),
      originalPrice: plan.price.monthly,
      checkoutUrl: plan.checkoutLink || `/checkout/${plan.id}`
    }));

    // O frontend espera um objeto com uma propriedade planos ou plans
    return NextResponse.json({ planos: plans });

  } catch (error) {
    console.error("Erro ao buscar planos do Tappy.id:", error);
    
    // Retorna um erro 503
    return NextResponse.json(
      { 
        error: true, 
        message: "Serviço de planos temporariamente indisponível. Tente novamente mais tarde."
      },
      { status: 503 }
    );
  }
}
