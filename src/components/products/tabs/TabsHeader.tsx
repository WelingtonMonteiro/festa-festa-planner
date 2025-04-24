
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';

interface TabsHeaderProps {
  type?: string;
  productsCount: number;
  onAddProduct?: (type?: string) => void;
  isLoading?: boolean;
}

const TabsHeader = ({
  type,
  productsCount,
  onAddProduct,
  isLoading = false
}: TabsHeaderProps) => {
  const getTitle = () => {
    if (type === 'kit') return `Kits (${productsCount})`;
    if (type === 'theme') return `Temas (${productsCount})`;
    return `Todos os Produtos (${productsCount})`;
  };

  const getButtonText = () => {
    if (type === 'kit') return 'Adicionar Kit';
    if (type === 'theme') return 'Adicionar Tema';
    return 'Adicionar Produto';
  };

  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">{getTitle()}</h3>
      {onAddProduct && (
        <Button 
          variant="default" 
          className="bg-festa-primary hover:bg-festa-primary/90"
          onClick={() => onAddProduct(type)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {getButtonText()}
        </Button>
      )}
    </div>
  );
};

export default TabsHeader;
