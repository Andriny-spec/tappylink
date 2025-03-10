'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { 
  Bell, 
  Sun, 
  Moon,
  LayoutDashboard,
  Users,
  DollarSign,
  Settings,
  LogOut,
  Puzzle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Network,
  MessageCircle,
  Package
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { NotificationPanel } from '@/components/dashboard/notification-panel';

const menuItems = [
  { icon: LayoutDashboard, label: 'Visão Geral', href: '/dashboard' },
  { icon: Users, label: 'Assinantes', href: '/dashboard/assinantes' },
  { icon: Package, label: 'Planos', href: '/dashboard/planos' },
  { icon: DollarSign, label: 'Vendas', href: '/dashboard/vendas' },
  { icon: Network, label: 'Integrações', href: '/dashboard/integracoes' },
  { icon: MessageCircle, label: 'Chat ao Vivo', href: '/dashboard/chat' },
  { icon: Puzzle, label: 'Funcionalidades', href: '/dashboard/funcionalidades' },
  { icon: BarChart3, label: 'Relatórios', href: '/dashboard/relatorios' },
  { icon: Settings, label: 'Configurações', href: '/dashboard/configuracoes' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="TappyID"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold text-xl">TappyID</span>
          </div>

          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-accent rounded-full relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-md lg:max-w-lg">
                <SheetTitle className="sr-only">Painel de Notificações</SheetTitle>
                <NotificationPanel />
              </SheetContent>
            </Sheet>

            <button 
              className="p-2 hover:bg-accent rounded-full"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#17d300] flex items-center justify-center text-white">
                A
              </div>
              <span className="font-medium">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          <nav className="flex flex-col h-full justify-between">
            <div className="flex flex-col h-full justify-between py-4">
              {menuItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#17d300] text-white'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </nav>
          
          <div className="border-t pt-4 mt-4">
            <button
              onClick={() => signOut({ callbackUrl: '/' })} 
              className="flex items-center gap-2 px-3 py-2 w-full rounded-lg hover:bg-accent text-red-500"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Sair</span>}
            </button>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="mt-4 flex items-center gap-2 px-3 py-2 w-full rounded-lg hover:bg-accent"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span>Recolher menu</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${
          isCollapsed ? 'pl-16' : 'pl-64'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
