
import { InfoIcon } from 'lucide-react';

interface SystemSectionProps {
  collapsed: boolean;
  onAboutClick: () => void;
}

const SystemSection = ({ collapsed, onAboutClick }: SystemSectionProps) => {
  if (collapsed) return null;

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/70">
        SISTEMA
      </h3>
      <ul className="space-y-1" role="menu">
        <li role="menuitem">
          <button 
            onClick={onAboutClick}
            className="flex w-full items-center rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <InfoIcon className="h-5 w-5" />
            <span className="ml-3">Sobre</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SystemSection;
