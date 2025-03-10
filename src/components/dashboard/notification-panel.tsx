'use client';

import { useState } from 'react';
import { 
  User, 
  DollarSign, 
  Package, 
  Clock, 
  Bell,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  CreditCard,
  Archive
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Tipos de notificações
type NotificationType = 'user' | 'payment' | 'subscription' | 'order' | 'system' | 'alert';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  priority?: 'low' | 'medium' | 'high';
  status?: 'success' | 'error' | 'warning' | 'info';
  metadata?: Record<string, any>;
}

// Cores e ícones baseados no tipo de notificação
const notificationConfig: Record<NotificationType, { 
  icon: React.ElementType, 
  bgColor: string, 
  textColor: string 
}> = {
  user: { 
    icon: User, 
    bgColor: 'bg-blue-100 dark:bg-blue-900/30', 
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  payment: { 
    icon: DollarSign, 
    bgColor: 'bg-green-100 dark:bg-green-900/30', 
    textColor: 'text-green-600 dark:text-green-400'
  },
  subscription: { 
    icon: Package, 
    bgColor: 'bg-purple-100 dark:bg-purple-900/30', 
    textColor: 'text-purple-600 dark:text-purple-400'
  },
  order: { 
    icon: Archive, 
    bgColor: 'bg-orange-100 dark:bg-orange-900/30', 
    textColor: 'text-orange-600 dark:text-orange-400'
  },
  system: { 
    icon: Clock, 
    bgColor: 'bg-gray-100 dark:bg-gray-800', 
    textColor: 'text-gray-600 dark:text-gray-400'
  },
  alert: { 
    icon: AlertCircle, 
    bgColor: 'bg-red-100 dark:bg-red-900/30', 
    textColor: 'text-red-600 dark:text-red-400'
  }
};

// Componente individual de notificação
const NotificationItem = ({ notification }: { notification: Notification }) => {
  const config = notificationConfig[notification.type];
  const StatusIcon = notification.status === 'success' ? CheckCircle : 
                     notification.status === 'error' ? XCircle : 
                     notification.status === 'warning' ? AlertCircle : 
                     config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={cn(
        'p-4 mb-2 rounded-lg border',
        notification.read ? 'opacity-70' : '',
        config.bgColor
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          config.textColor
        )}>
          <StatusIcon className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className={cn("font-medium", config.textColor)}>
              {notification.title}
            </p>
            {notification.priority === 'high' && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                Urgente
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            {notification.description}
          </p>
          
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>
              {formatDistanceToNow(notification.timestamp, { 
                addSuffix: true,
                locale: ptBR
              })}
            </span>
            
            {notification.metadata?.actionRequired && (
              <button className="px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                Ver detalhes
              </button>
            )}
          </div>
        </div>
        
        {!notification.read && (
          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
        )}
      </div>
    </motion.div>
  );
};

// Filtros para as notificações
const FILTERS = [
  { label: 'Todas', value: 'all' },
  { label: 'Usuários', value: 'user' },
  { label: 'Pagamentos', value: 'payment' },
  { label: 'Assinaturas', value: 'subscription' },
  { label: 'Pedidos', value: 'order' },
  { label: 'Sistema', value: 'system' },
  { label: 'Alertas', value: 'alert' }
];

export function NotificationPanel() {
  const [filter, setFilter] = useState<string>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'user',
      title: 'Novo usuário registrado',
      description: 'João Silva acabou de criar uma conta',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false
    },
    {
      id: '2',
      type: 'payment',
      title: 'Pagamento recebido',
      description: 'R$199,90 - Plano Premium (Maria Oliveira)',
      timestamp: new Date(Date.now() - 3 * 3600000),
      read: false,
      status: 'success',
      metadata: {
        amount: 199.90,
        paymentMethod: 'credit_card'
      }
    },
    {
      id: '3',
      type: 'subscription',
      title: 'Assinatura cancelada',
      description: 'Carlos Mendes cancelou sua assinatura',
      timestamp: new Date(Date.now() - 5 * 3600000),
      read: true,
      status: 'error',
      metadata: {
        reason: 'financial_difficulties'
      }
    },
    {
      id: '4',
      type: 'order',
      title: 'Novo pedido',
      description: 'Pedido #12345 aguardando confirmação',
      timestamp: new Date(Date.now() - 12 * 3600000),
      read: false,
      priority: 'medium'
    },
    {
      id: '5',
      type: 'alert',
      title: 'Alerta de segurança',
      description: 'Tentativa de login suspeita detectada',
      timestamp: new Date(Date.now() - 24 * 3600000),
      read: false,
      priority: 'high',
      status: 'warning',
      metadata: {
        actionRequired: true,
        ip: '192.168.1.1'
      }
    },
    {
      id: '6',
      type: 'system',
      title: 'Sistema atualizado',
      description: 'Nova versão 1.2.3 implementada com sucesso',
      timestamp: new Date(Date.now() - 2 * 86400000),
      read: true,
      status: 'info'
    },
    {
      id: '7',
      type: 'user',
      title: 'Perfil atualizado',
      description: 'Ana Beatriz atualizou suas informações de contato',
      timestamp: new Date(Date.now() - 4 * 86400000),
      read: true
    },
    {
      id: '8',
      type: 'payment',
      title: 'Pagamento recusado',
      description: 'Cartão expirado - Lucas Ferreira',
      timestamp: new Date(Date.now() - 5 * 86400000),
      read: false,
      status: 'error',
      priority: 'high',
      metadata: {
        actionRequired: true,
        retryCount: 2
      }
    }
  ]);

  // Filtrar notificações
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(notification => notification.type === filter);

  // Agrupar notificações por data
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0);

  // Ler todas as notificações
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </h2>
          <button 
            className="text-xs text-primary hover:underline"
            onClick={markAllAsRead}
          >
            Marcar todas como lidas
          </button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {FILTERS.map(filterOption => (
            <button
              key={filterOption.value}
              className={cn(
                "px-3 py-1 rounded-full text-sm whitespace-nowrap",
                filter === filterOption.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
              onClick={() => setFilter(filterOption.value)}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {filteredNotifications.length > 0 ? (
            <div>
              {filteredNotifications
                .filter(n => new Date(n.timestamp).setHours(0, 0, 0, 0) === today)
                .length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Hoje</h3>
                  {filteredNotifications
                    .filter(n => new Date(n.timestamp).setHours(0, 0, 0, 0) === today)
                    .map(notification => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                </div>
              )}
              
              {filteredNotifications
                .filter(n => new Date(n.timestamp).setHours(0, 0, 0, 0) === yesterday)
                .length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Ontem</h3>
                  {filteredNotifications
                    .filter(n => new Date(n.timestamp).setHours(0, 0, 0, 0) === yesterday)
                    .map(notification => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                </div>
              )}
              
              {filteredNotifications
                .filter(n => {
                  const date = new Date(n.timestamp).setHours(0, 0, 0, 0);
                  return date < yesterday;
                })
                .length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Anteriores</h3>
                  {filteredNotifications
                    .filter(n => {
                      const date = new Date(n.timestamp).setHours(0, 0, 0, 0);
                      return date < yesterday;
                    })
                    .map(notification => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">Nenhuma notificação</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {filter === 'all' 
                  ? 'Você não tem notificações no momento.'
                  : `Você não tem notificações do tipo "${FILTERS.find(f => f.value === filter)?.label.toLowerCase()}" no momento.`}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-4 border-t bg-muted/40">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium">
              {notifications.filter(n => !n.read).length} não lidas
            </span>
          </div>
          <button className="flex items-center gap-1 text-sm text-primary hover:underline">
            <FileText className="w-4 h-4" /> 
            Ver histórico completo
          </button>
        </div>
      </div>
    </div>
  );
}
