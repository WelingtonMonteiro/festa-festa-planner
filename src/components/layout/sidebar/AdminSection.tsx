import { Package, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface AdminSectionProps {
  collapsed: boolean;
}

const AdminSection = ({ collapsed }: AdminSectionProps) => {
  const navigate = useNavigate();

  if (collapsed) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/70">
        ADMINISTRAÇÃO
      </h3>
      <ul className="space-y-1" role="menu">
        <li role="menuitem">
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => navigate('/products')}
          >
            <Package className="h-5 w-5" />
            <span className="ml-3">Kits e Temas</span>
          </Button>
        </li>
        <li role="menuitem">
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => navigate('/contracts')}
          >
            <Tag className="h-5 w-5" />
            <span className="ml-3">Contratos</span>
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSection;
