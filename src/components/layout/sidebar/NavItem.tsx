
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  path: string;
  name: string;
  icon: LucideIcon;
  collapsed: boolean;
}

const NavItem = ({ path, name, icon: Icon, collapsed }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <li role="menuitem">
      <Link
        to={path}
        className={cn(
          "flex items-center rounded-lg p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive 
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
            : "text-sidebar-foreground"
        )}
      >
        <div className="relative">
          <Icon className="h-5 w-5" />
        </div>
        {!collapsed && <span className="ml-3">{name}</span>}
      </Link>
    </li>
  );
};

export default NavItem;
