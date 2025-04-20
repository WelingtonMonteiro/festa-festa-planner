
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TemplateListHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

const TemplateListHeader = ({
  searchQuery,
  onSearchChange,
  onCreateClick,
}: TemplateListHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar modelos de contrato..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button onClick={onCreateClick}>
        <Plus className="h-4 w-4 mr-2" /> Novo Modelo
      </Button>
    </div>
  );
};

export default TemplateListHeader;
