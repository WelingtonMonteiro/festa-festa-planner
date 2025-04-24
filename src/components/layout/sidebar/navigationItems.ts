
import { 
  PartyPopper, Calendar, Users, Box, MessageCircle, 
  BarChart2, Settings, DollarSign, CalendarRange,
  Bell, FileText, InfoIcon, UserPlus, ScrollText,
  ShieldAlert, CreditCard, Tag
} from 'lucide-react';

export const navItems = [
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    icon: PartyPopper
  },
  { 
    path: '/calendar',
    name: 'Calendário', 
    icon: Calendar
  },
  { 
    path: '/events',
    name: 'Eventos', 
    icon: CalendarRange
  },
  { 
    path: '/clients',
    name: 'Clientes', 
    icon: Users
  },
  { 
    path: '/leads', 
    name: 'Leads', 
    icon: UserPlus
  },
  { 
    path: '/products', 
    name: 'Produtos', 
    icon: Box
  },
  { 
    path: '/product-types',
    name: 'Tipos de Produtos', 
    icon: Tag
  },
  { 
    path: '/contracts',
    name: 'Contratos', 
    icon: ScrollText
  },
  { 
    path: '/financial',
    name: 'Financeiro', 
    icon: DollarSign
  },
  { 
    path: '/notifications',
    name: 'Notificações', 
    icon: Bell
  },
  { 
    path: '/messages',
    name: 'Mensagens', 
    icon: MessageCircle
  },
  { 
    path: '/statistics',
    name: 'Estatísticas', 
    icon: BarChart2
  },
  { 
    path: '/reports',
    name: 'Relatórios', 
    icon: FileText
  },
  { 
    path: '/settings',
    name: 'Configurações', 
    icon: Settings
  }
];

export const adminItems = [
  {
    path: '/admin-settings',
    name: 'Configurações',
    icon: Settings
  },
  {
    path: '/plans',
    name: 'Planos',
    icon: CreditCard
  }
];
