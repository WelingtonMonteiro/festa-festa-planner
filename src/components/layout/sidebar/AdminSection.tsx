
import { ShieldAlert } from 'lucide-react';
import NavItem from './NavItem';
import { adminItems } from './navigationItems';

interface AdminSectionProps {
  collapsed: boolean;
  isAdmin: boolean;
}

const AdminSection = ({ collapsed, isAdmin }: AdminSectionProps) => {
  if (!isAdmin) return null;

  return (
    <div className={cn("mt-6 border-t pt-4", collapsed ? "border-t-0" : "")}>
      {!collapsed && (
        <h3 className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/70 flex items-center">
          <ShieldAlert className="h-3 w-3 mr-1" />
          ADMINISTRADOR
        </h3>
      )}
      <ul className="space-y-2" role="menu">
        {adminItems.map((item) => (
          <NavItem
            key={item.path}
            {...item}
            collapsed={collapsed}
          />
        ))}
      </ul>
    </div>
  );
};

export default AdminSection;
