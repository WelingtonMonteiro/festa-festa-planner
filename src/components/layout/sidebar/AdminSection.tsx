
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { adminItems } from './navigationItems';

interface AdminSectionProps {
  collapsed: boolean;
  isAdmin?: boolean;
}

const AdminSection = ({ collapsed, isAdmin = true }: AdminSectionProps) => {
  const navigate = useNavigate();

  if (collapsed) return null;
  if (!isAdmin) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/70">
        ADMINISTRAÇÃO
      </h3>
      <ul className="space-y-1" role="menu">
        {adminItems.map((item) => (
          <li key={item.path} role="menuitem">
            <Button
              variant="ghost"
              className="flex w-full items-center justify-start rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-5 w-5" />
              <span className="ml-3">{item.name}</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSection;
