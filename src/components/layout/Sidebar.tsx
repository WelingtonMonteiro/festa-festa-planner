
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  PartyPopper, 
  Calendar, 
  Users, 
  Package, 
  MessageCircle, 
  BarChart2, 
  Settings,
  DollarSign,
  CalendarRange,
  Bell,
  ChevronRight,
  ChevronLeft,
  FileText,
  InfoIcon,
  UserPlus,
  ScrollText,
  ShieldAlert,
  CreditCard
} from 'lucide-react';
import { useHandleContext } from '@/contexts/handleContext.tsx';
import { AboutSystemDialog } from '@/components/system/AboutSystemDialog';

interface SidebarProps {
  onToggleCollapse?: (collapsed: boolean) => void;
}

const Sidebar = ({ onToggleCollapse }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const location = useLocation();
  const { messages } = useHandleContext();
  
  const unreadCount = messages.filter(m => !m.lida).length;
  
  const storageNotifications = localStorage.getItem('notificacoes');
  const notifications = storageNotifications ? JSON.parse(storageNotifications) : [];
  const unreadNotifications = notifications.filter((n: any) => !n.lida).length;

  // Simula check de permissão de admin - em produção seria checado via contexto de autenticação
  const isAdmin = true; // Temporariamente habilitado para todos
  
  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (onToggleCollapse) {
      onToggleCollapse(newState);
    }
  };
  
  const navItems = [
    { 
      path: '/dashboard', 
      name: 'Dashboard', 
      icon: <PartyPopper className="h-5 w-5" /> 
    },
    { 
      path: '/calendar', 
      name: 'Calendário', 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      path: '/events', 
      name: 'Eventos', 
      icon: <CalendarRange className="h-5 w-5" /> 
    },
    { 
      path: '/clients', 
      name: 'Clientes', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      path: '/leads', 
      name: 'Leads', 
      icon: <UserPlus className="h-5 w-5" /> 
    },
    { 
      path: '/kits-themes', 
      name: 'Kits & Temas', 
      icon: <Package className="h-5 w-5" /> 
    },
    { 
      path: '/contracts', 
      name: 'Contratos', 
      icon: <ScrollText className="h-5 w-5" /> 
    },
    { 
      path: '/financial', 
      name: 'Financeiro', 
      icon: <DollarSign className="h-5 w-5" /> 
    },
    { 
      path: '/notifications', 
      name: 'Notificações', 
      icon: <Bell className="h-5 w-5" />,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined
    },
    { 
      path: '/messages', 
      name: 'Mensagens', 
      icon: <MessageCircle className="h-5 w-5" />,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { 
      path: '/statistics', 
      name: 'Estatísticas', 
      icon: <BarChart2 className="h-5 w-5" /> 
    },
    { 
      path: '/reports', 
      name: 'Relatórios', 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      path: '/settings', 
      name: 'Configurações', 
      icon: <Settings className="h-5 w-5" /> 
    }
  ];

  // Itens do menu de administrador
  const adminItems = [
    {
      path: '/admin/settings',
      name: 'Configurações',
      icon: <Settings className="h-5 w-5" />
    },
    {
      path: '/admin/plans',
      name: 'Planos',
      icon: <CreditCard className="h-5 w-5" />
    }
  ];
  
  return (
    <nav 
      className={cn(
        "sticky top-0 left-0 z-40 h-screen bg-sidebar transition-width duration-300 ease-in-out pb-10",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-full overflow-y-auto px-3 py-4">
        <div className="mb-8 flex items-center justify-center">
          {collapsed ? (
            <PartyPopper 
              className="h-10 w-10 text-sidebar-primary animate-float" 
              onClick={() => toggleCollapsed()}
            />
          ) : (
            <div className="flex items-center space-x-2">
              <PartyPopper className="h-10 w-10 text-sidebar-primary animate-float" />
              <h1 className="text-2xl font-bold festa-gradient-text">Festa</h1>
            </div>
          )}
        </div>
        
        <ul className="space-y-2" role="menu">
          {navItems.map((item) => (
            <li key={item.path} role="menuitem">
              <Link
                to={item.path}
                className={cn(
                  "flex items-center rounded-lg p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname === item.path 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                    : "text-sidebar-foreground"
                )}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-festa-secondary text-xs text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Seção de Administrador */}
        {isAdmin && (
          <div className={cn("mt-6 border-t pt-4", collapsed ? "border-t-0" : "")}>
            {!collapsed && (
              <h3 className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/70 flex items-center">
                <ShieldAlert className="h-3 w-3 mr-1" />
                ADMINISTRADOR
              </h3>
            )}
            <ul className="space-y-2" role="menu">
              {adminItems.map((item) => (
                <li key={item.path} role="menuitem">
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center rounded-lg p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      location.pathname === item.path 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                        : "text-sidebar-foreground"
                    )}
                  >
                    <div className="relative">
                      {item.icon}
                    </div>
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {!collapsed && (
          <div className="mt-6 border-t pt-4">
            <h3 className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/70">
              SISTEMA
            </h3>
            <ul className="space-y-1" role="menu">
              <li role="menuitem">
                <button 
                  onClick={() => setIsAboutDialogOpen(true)}
                  className="flex w-full items-center rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <InfoIcon className="h-5 w-5" />
                  <span className="ml-3">Sobre</span>
                </button>
              </li>
            </ul>
          </div>
        )}
        
        <div 
          className="absolute bottom-6 right-4 cursor-pointer rounded-full bg-sidebar-accent p-2 hover:bg-sidebar-accent/80 text-sidebar-accent-foreground"
          onClick={() => toggleCollapsed()}
          aria-label={collapsed ? "Expandir menu" : "Retrair menu"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </div>
      </div>

      <AboutSystemDialog 
        open={isAboutDialogOpen} 
        onOpenChange={setIsAboutDialogOpen} 
      />
    </nav>
  );
};

export default Sidebar;
