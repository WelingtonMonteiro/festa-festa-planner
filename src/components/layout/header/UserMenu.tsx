
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  onLogout: () => void;
}

const UserMenu = ({ onLogout }: UserMenuProps) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate('/configuracoes?tab=conta')}>
          Meu Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
          Configurações
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
