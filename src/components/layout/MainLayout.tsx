
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };
  
  return (
    <div className="flex h-screen bg-background">
      {/* Using nav element for sidebar navigation */}
      <Sidebar onToggleCollapse={handleSidebarToggle} />
      <div className="flex flex-1 flex-col transition-all duration-300">
        <Header />
        <main className={cn("flex-1 overflow-y-auto p-6", className)}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
