import { PrismaClient, Role, PaymentMethod, PaymentStatus, SubscriptionStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

// Função auxiliar para gerar uma data aleatória entre dois intervalos
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Função auxiliar para gerar um número aleatório entre min e max
function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Gerar um ID de transação aleatório
function generateTransactionId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).substring(2, 15)}`;
}

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Limpar dados existentes (opcional)
  await prisma.order.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('Banco de dados limpo.');

  // Criar usuário Admin
  const adminHashedPassword = await argon2.hash('admin123');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@tappyid.com',
      password: adminHashedPassword,
      role: Role.ADMIN,
      profile: {
        create: {
          name: 'Administrador',
          biography: 'Administrador do sistema',
          phone: '(11) 99999-9999',
        }
      }
    },
    include: {
      profile: true,
    }
  });
  
  console.log('Usuário Admin criado:', admin.email);

  // Lista de nomes fictícios para assinantes
  const nomesAssinantes = [
    { nome: 'João Silva', email: 'joao.silva@email.com' },
    { nome: 'Maria Santos', email: 'maria.santos@email.com' },
    { nome: 'Pedro Oliveira', email: 'pedro.oliveira@email.com' },
    { nome: 'Ana Costa', email: 'ana.costa@email.com' },
    { nome: 'Carlos Pereira', email: 'carlos.pereira@email.com' },
    { nome: 'Lucia Fernandes', email: 'lucia.fernandes@email.com' },
    { nome: 'Bruno Almeida', email: 'bruno.almeida@email.com' },
    { nome: 'Julia Rodrigues', email: 'julia.rodrigues@email.com' },
    { nome: 'Rafael Souza', email: 'rafael.souza@email.com' },
    { nome: 'Camila Martins', email: 'camila.martins@email.com' },
  ];

  // Criar múltiplos usuários assinantes
  const assinantes = [];
  
  for (const assinante of nomesAssinantes) {
    const senhaHash = await argon2.hash('senha123');
    const novoAssinante = await prisma.user.create({
      data: {
        email: assinante.email,
        password: senhaHash,
        role: Role.ASSINANTE,
        profile: {
          create: {
            name: assinante.nome,
            biography: `Profissional de ${['Marketing', 'Vendas', 'Design', 'Tecnologia', 'Saúde'][randomNumber(0, 4)]}`,
            phone: `(${randomNumber(11, 99)}) 9${randomNumber(1000, 9999)}-${randomNumber(1000, 9999)}`,
            linkedin: `https://linkedin.com/in/${assinante.nome.toLowerCase().replace(' ', '')}`,
            instagram: `@${assinante.nome.toLowerCase().replace(' ', '')}`,
            whatsapp: `55${randomNumber(11, 99)}9${randomNumber(10000000, 99999999)}`,
          }
        }
      },
      include: {
        profile: true,
      }
    });
    
    assinantes.push(novoAssinante);
    console.log(`Usuário Assinante criado: ${novoAssinante.email}`);
  }

  // Criar 3 Planos
  const planoBronze = await prisma.plan.create({
    data: {
      name: 'Bronze',
      description: 'Plano básico para pequenos empreendedores',
      price: 49.90,
      durationDays: 30, // 1 mês
      features: [
        'Cartão digital',
        'QR Code personalizado',
        'Até 3 redes sociais',
        'Estatísticas básicas'
      ],
      isActive: true,
    }
  });
  
  console.log('Plano Bronze criado');

  const planoPrata = await prisma.plan.create({
    data: {
      name: 'Prata',
      description: 'Plano intermediário para profissionais',
      price: 99.90,
      discountPrice: 89.90,
      durationDays: 90, // 3 meses
      features: [
        'Cartão digital',
        'QR Code personalizado',
        'Até 7 redes sociais',
        'Estatísticas avançadas',
        'Suporte prioritário',
        'Design personalizado'
      ],
      isPopular: true,
      isActive: true,
    }
  });
  
  console.log('Plano Prata criado');

  const planoOuro = await prisma.plan.create({
    data: {
      name: 'Ouro Anual',
      description: 'Plano premium para empresas',
      price: 997.00,
      discountPrice: 897.00,
      durationDays: 365, // 1 ano
      features: [
        'Cartão digital',
        'QR Code personalizado',
        'Redes sociais ilimitadas',
        'Estatísticas avançadas',
        'Suporte VIP',
        'Design exclusivo',
        'Integração com CRM',
        'Múltiplos perfis'
      ],
      isActive: true,
    }
  });
  
  console.log('Plano Ouro criado');

  // Array com todos os planos
  const planos = [planoBronze, planoPrata, planoOuro];
  
  // Métodos de pagamento disponíveis
  const metodosPagamento = Object.values(PaymentMethod);
  
  // Status de pagamento possíveis
  const statusPagamento = Object.values(PaymentStatus);
  
  // Data atual para referência
  const hoje = new Date();
  const tresMesesAtras = new Date(hoje);
  tresMesesAtras.setMonth(hoje.getMonth() - 3);
  
  // Para cada assinante, criar pelo menos uma assinatura e pedido
  for (const assinante of assinantes) {
    // Escolher plano aleatório
    const planoEscolhido = planos[randomNumber(0, planos.length - 1)];
    
    // Status da assinatura (majoritariamente ativas, algumas com outros status)
    const statusAssinatura = Math.random() > 0.7 ? 
      SubscriptionStatus.ATIVA : 
      Object.values(SubscriptionStatus)[randomNumber(0, Object.values(SubscriptionStatus).length - 1)];
    
    // Data de início aleatória nos últimos 3 meses
    const dataInicio = randomDate(tresMesesAtras, hoje);
    
    // Data de fim com base na duração do plano
    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataFim.getDate() + planoEscolhido.durationDays);
    
    // Data de cancelamento (apenas se status for CANCELADA)
    const dataCancelamento = statusAssinatura === SubscriptionStatus.CANCELADA ? 
      randomDate(dataInicio, hoje) : null;
    
    // Criar assinatura
    const subscription = await prisma.subscription.create({
      data: {
        userId: assinante.id,
        planId: planoEscolhido.id,
        status: statusAssinatura,
        startDate: dataInicio,
        endDate: dataFim,
        canceledAt: dataCancelamento,
        autoRenew: Math.random() > 0.2, // 80% com renovação automática
      }
    });
    
    console.log(`Assinatura criada para ${assinante.email}, plano: ${planoEscolhido.name}`);
    
    // Número de pedidos para esta assinatura (1-3)
    const numPedidos = randomNumber(1, 3);
    
    for (let i = 0; i < numPedidos; i++) {
      // Data do pedido (anterior à data de início da assinatura para o primeiro pedido)
      const dataPedido = i === 0 ? 
        new Date(dataInicio.getTime() - randomNumber(1, 5) * 24 * 60 * 60 * 1000) : // 1-5 dias antes
        randomDate(dataInicio, hoje);
      
      // Método de pagamento aleatório
      const metodoPagamento = metodosPagamento[randomNumber(0, metodosPagamento.length - 1)];
      
      // Status do pagamento (tendencialmente aprovado)
      const statusPagamentoEscolhido = Math.random() > 0.8 ? 
        statusPagamento[randomNumber(0, statusPagamento.length - 1)] : PaymentStatus.APROVADO;
      
      // Data do pagamento (se for aprovado)
      const dataPagamento = statusPagamentoEscolhido === PaymentStatus.APROVADO ? 
        new Date(dataPedido.getTime() + randomNumber(1, 60) * 60 * 1000) : null; // 1-60 minutos depois
      
      // Gerar ID de transação adequado ao método de pagamento
      let transactionId = null;
      if (statusPagamentoEscolhido === PaymentStatus.APROVADO) {
        switch(metodoPagamento) {
          case PaymentMethod.PIX:
            transactionId = generateTransactionId('pix');
            break;
          case PaymentMethod.CARTAO_CREDITO:
            transactionId = generateTransactionId('card');
            break;
          case PaymentMethod.BOLETO:
            transactionId = generateTransactionId('boleto');
            break;
          case PaymentMethod.TRANSFERENCIA:
            transactionId = generateTransactionId('transfer');
            break;
        }
      }
      
      // Notas aleatórias para o pedido
      const notas = [
        i === 0 ? 'Primeira assinatura' : 'Renovação de assinatura',
        'Cliente VIP',
        'Desconto aplicado',
        'Promoção especial',
        ''
      ];
      
      // Criar pedido
      const order = await prisma.order.create({
        data: {
          userId: assinante.id,
          planId: planoEscolhido.id,
          subscriptionId: subscription.id,
          amount: planoEscolhido.discountPrice || planoEscolhido.price,
          paymentMethod: metodoPagamento,
          paymentStatus: statusPagamentoEscolhido,
          paymentDate: dataPagamento,
          transactionId,
          notes: notas[randomNumber(0, notas.length - 1)],
          createdAt: dataPedido,
          updatedAt: dataPagamento || dataPedido
        }
      });
      
      console.log(`Pedido ${i+1}/${numPedidos} criado para assinatura de ${assinante.email}, status: ${statusPagamentoEscolhido}`);
    }
  }
  
  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
