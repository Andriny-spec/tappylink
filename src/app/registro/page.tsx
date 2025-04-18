'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';

// Definindo esquema de validação
const formSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A confirmação de senha deve ter pelo menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export default function RegistroPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirecionamento se já estiver autenticado
  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (status === 'authenticated' && session?.user) {
      console.log('Usuário já autenticado, redirecionando...');
      
      // Pequeno delay para evitar redirecionamentos em loops
      const timer = setTimeout(() => {
        const role = session?.user?.role?.toUpperCase() || '';
        if (role === 'ADMIN') {
          router.replace('/dashboard');
        } else {
          router.replace('/assinante/meu-perfil');
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [session, status, router]);

  // Configuração do formulário com react-hook-form e zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      console.log('Iniciando cadastro de usuário');
      
      // Fazer requisição para API de cadastro
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar usuário');
      }
      
      toast.success('Cadastro realizado com sucesso! Fazendo login...');
      
      // Fazer login automaticamente após o cadastro
      const loginResult = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      
      if (loginResult?.error) {
        console.error('Erro ao fazer login após cadastro:', loginResult.error);
        toast.error('Cadastro realizado, mas houve um erro ao fazer login automático. Por favor, faça login manualmente.');
        setTimeout(() => router.push('/login'), 3000);
        return;
      }
      
      // Login bem-sucedido, redirecionar para a página de perfil
      toast.success('Login realizado com sucesso! Redirecionando...');
      setTimeout(() => {
        router.push('/assinante/meu-perfil');
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      toast.error(error instanceof Error ? error.message : 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-950">
        {/* Coluna de cadastro */}
        <motion.div
          className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-full max-w-md space-y-8">
            <motion.div className="flex flex-col items-center" variants={itemVariants}>
              <Image
                src="/logo.svg"
                alt="TappyID"
                width={80}
                height={80}
                className="mb-6"
              />
              <h2 className="text-3xl font-bold tracking-tight text-center mb-1">
                Crie sua conta
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-8">
                Preencha seus dados para criar seu cartão digital
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Seu nome completo"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="seu@email.com"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirme sua senha</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#17d300] hover:bg-[#17d300]/90 rounded-xl font-medium transition-all mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Cadastrando...
                      </div>
                    ) : (
                      'Criar conta'
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>

            <motion.div
              className="flex justify-center mt-6 pt-6 border-t text-sm text-muted-foreground"
              variants={itemVariants}
            >
              <p>
                Já tem uma conta?{' '}
                <Link href="/login" className="text-[#17d300] hover:underline font-medium">
                  Faça login
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Coluna de ilustração */}
        <motion.div
          className="hidden md:flex md:w-1/2 bg-[#17d300]/10 items-center justify-center p-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="max-w-md text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-8"
            >
              <Image
                src="/login-illustration.svg"
                alt="Registration Illustration"
                width={400}
                height={400}
                className="mx-auto"
              />
            </motion.div>
            <h3 className="text-2xl font-bold mb-4">Crie seu cartão digital profissional</h3>
            <p className="text-muted-foreground mb-6">
              Registre-se para começar a criar seu cartão digital e compartilhar suas informações com estilo e profissionalismo.
            </p>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i === 2 ? 'bg-[#17d300]' : 'bg-[#17d300]/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <Toaster position="bottom-right" />
    </>
  );
}
