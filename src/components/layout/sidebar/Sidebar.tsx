
import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AboutSystemDialog } from '@/components/system/AboutSystemDialog';
import { useHandleContext } from '@/contexts/handleContext';
import NavItem from './NavItem';
import AdminSection from './AdminSection';
import SystemSection from './SystemSection';
import SidebarLogo from './SidebarLogo';
import { navItems } from './navigationItems';

interface SidebarProps {
  onToggleCollapse?: (collapsed: boolean) => void;
}

const Sidebar = ({ onToggleCollapse }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const { messages } = useHandleContext();
  
  const unreadCount = messages.filter(m => !m.lida).length;
  
  const storageNotifications = localStorage.getItem('notificacoes');
  const notifications = storageNotifications ? JSON.parse(storageNotifications) : [];
  const unreadNotifications = notifications.filter((n: any) => !n.lida).length;

  // Simula check de permissão de admin - em produção seria checado via contexto de autenticação
  const isAdmin = true;
  
  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (onToggleCollapse) {
      onToggleCollapse(newState);
    }
  };

  return (
    <nav 
      className={cn(
        "sticky top-0 left-0 z-40 h-screen bg-sidebar transition-width duration-300 ease-in-out pb-10",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-full overflow-y-auto px-3 py-4">
        <SidebarLogo 
          collapsed={collapsed} 
          onLogoClick={toggleCollapsed} 
        />
        
        <ul className="space-y-2" role="menu">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              {...item}
              collapsed={collapsed}
            />
          ))}
        </ul>
        
        <AdminSection 
          collapsed={collapsed} 
          isAdmin={isAdmin} 
        />
        
        <SystemSection 
          collapsed={collapsed}
          onAboutClick={() => setIsAboutDialogOpen(true)}
        />
        
        <div 
          className="absolute bottom-6 right-4 cursor-pointer rounded-full bg-sidebar-accent p-2 hover:bg-sidebar-accent/80 text-sidebar-accent-foreground"
          onClick={toggleCollapsed}
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
