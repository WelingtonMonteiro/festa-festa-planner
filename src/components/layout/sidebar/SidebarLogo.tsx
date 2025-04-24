
import { PartyPopper } from 'lucide-react';

interface SidebarLogoProps {
  collapsed: boolean;
  onLogoClick: () => void;
}

const SidebarLogo = ({ collapsed, onLogoClick }: SidebarLogoProps) => {
  return (
    <div className="mb-8 flex items-center justify-center">
      {collapsed ? (
        <PartyPopper 
          className="h-10 w-10 text-sidebar-primary animate-float" 
          onClick={onLogoClick}
        />
      ) : (
        <div className="flex items-center space-x-2">
          <PartyPopper className="h-10 w-10 text-sidebar-primary animate-float" />
          <h1 className="text-2xl font-bold festa-gradient-text">Festa</h1>
        </div>
      )}
    </div>
  );
};

export default SidebarLogo;
