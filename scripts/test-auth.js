// Script para testar a autenticação e diagnosticar problemas
const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  console.log('=== TESTE DE AUTENTICAÇÃO ===');
  
  // 1. Verificar usuário existente
  const existingEmail = 'camila.martins@email.com';
  console.log(`\n1. Testando usuário existente: ${existingEmail}`);
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: existingEmail },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        profile: true
      }
    });
    
    if (!user) {
      console.log(`❌ Usuário não encontrado: ${existingEmail}`);
    } else {
      console.log(`✅ Usuário encontrado:`, {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile
      });
      
      // Teste de senha com valor conhecido
      const testPassword = 'senha123';
      try {
        const isValid = await argon2.verify(user.password, testPassword);
        console.log(`🔑 Teste de senha '${testPassword}': ${isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);
        
        if (!isValid) {
          console.log('ℹ️  Hash armazenado:', user.password);
          
          // Criar um novo hash para comparação
          const newHash = await argon2.hash(testPassword);
          console.log('ℹ️  Novo hash gerado:', newHash);
          console.log('ℹ️  Os hashes são diferentes pois argon2 gera sal único a cada vez');
        }
      } catch (error) {
        console.log('❌ Erro ao verificar senha:', error);
      }
    }
  } catch (error) {
    console.log('❌ Erro ao buscar usuário:', error);
  }
  
  // 2. Criar usuário de teste
  const testEmail = 'teste@example.com';
  console.log(`\n2. Criando usuário de teste: ${testEmail}`);
  
  try {
    // Verificar se já existe
    const existing = await prisma.user.findUnique({
      where: { email: testEmail }
    });
    
    if (existing) {
      console.log(`ℹ️  Usuário de teste já existe, atualizando senha...`);
      const senha = 'teste123';
      const senhaHash = await argon2.hash(senha);
      
      await prisma.user.update({
        where: { email: testEmail },
        data: { password: senhaHash }
      });
      
      console.log(`✅ Senha atualizada para: '${senha}'`);
    } else {
      // Criar novo usuário
      const senha = 'teste123';
      const senhaHash = await argon2.hash(senha);
      
      const newUser = await prisma.user.create({
        data: {
          email: testEmail,
          password: senhaHash,
          role: 'ASSINANTE',
          profile: {
            create: {
              name: 'Usuário de Teste'
            }
          }
        }
      });
      
      console.log(`✅ Usuário criado:`, {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      });
      
      console.log(`📝 Credenciais para teste:
        Email: ${testEmail}
        Senha: teste123
      `);
    }
  } catch (error) {
    console.log('❌ Erro ao criar usuário de teste:', error);
  }
  
  console.log('\n=== INSTRUÇÕES ===');
  console.log('1. Tente fazer login com o usuário de teste criado acima');
  console.log('2. Se funcionar, o problema está na incompatibilidade do hash do seed');
  console.log('3. Para corrigir, execute o seed novamente ou use estes usuários de teste');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
