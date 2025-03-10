import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

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

  // Criar usuário Assinante
  const assinanteHashedPassword = await argon2.hash('senha123');
  const assinante = await prisma.user.create({
    data: {
      email: 'assinante@tappyid.com',
      password: assinanteHashedPassword,
      role: Role.ASSINANTE,
      profile: {
        create: {
          name: 'João Silva',
          biography: 'Profissional de Marketing',
          phone: '(11) 98888-8888',
          linkedin: 'https://linkedin.com/in/joaosilva',
          instagram: '@joaosilva',
          whatsapp: '5511988888888',
        }
      }
    },
    include: {
      profile: true,
    }
  });
  
  console.log('Usuário Assinante criado:', assinante.email);

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
      name: 'Ouro',
      description: 'Plano premium para empresas',
      price: 199.90,
      discountPrice: 179.90,
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

  // Criar assinatura para o usuário assinante (exemplo)
  const subscription = await prisma.subscription.create({
    data: {
      userId: assinante.id,
      planId: planoPrata.id,
      status: 'ATIVA',
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias a partir de hoje
      autoRenew: true,
    }
  });
  
  console.log('Assinatura criada para o assinante');

  // Criar pedido para esta assinatura
  const order = await prisma.order.create({
    data: {
      userId: assinante.id,
      planId: planoPrata.id,
      subscriptionId: subscription.id,
      amount: 89.90, // Preço com desconto
      paymentMethod: 'PIX',
      paymentStatus: 'APROVADO',
      paymentDate: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
      transactionId: 'pix_' + Math.random().toString(36).substring(2, 15),
      notes: 'Primeira assinatura',
    }
  });
  
  console.log('Pedido criado para a assinatura');
  
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
