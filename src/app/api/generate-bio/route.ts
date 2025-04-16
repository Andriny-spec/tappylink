import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Função para gerar textos usando a API do DeepSeek
async function generateText(prompt: string) {
  const url = 'https://api.deepseek.com/v1/chat/completions';
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('Chave da API DeepSeek não configurada');
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em criar biografias profissionais curtas e impactantes. Forneça apenas o texto da biografia, sem comentários adicionais.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na API DeepSeek:', errorData);
      throw new Error(`Erro na API DeepSeek: ${errorData.error?.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('Erro ao gerar texto:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Obter dados da solicitação
    const data = await request.json();
    const { prompt } = data;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt não fornecido' }, { status: 400 });
    }

    // Gerar biografia
    const bioText = await generateText(prompt);
    
    // Limitar a biografia a 400 caracteres (mais extensa conforme solicitado)
    const limitedBio = bioText.length > 400 
      ? bioText.substring(0, 397) + '...' 
      : bioText;

    return NextResponse.json({ bio: limitedBio });
  } catch (error: any) {
    console.error('Erro no endpoint de geração de biografia:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar biografia' },
      { status: 500 }
    );
  }
}
