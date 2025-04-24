
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';

interface EmptyStateProps {
  type?: string;
  onAddProduct?: (type?: string) => void;
}

const EmptyState = ({ type, onAddProduct }: EmptyStateProps) => {
  const getMessage = () => {
    if (type === 'kit') return 'Adicione kits para começar';
    if (type === 'theme') return 'Adicione temas para começar';
    return 'Adicione produtos para começar';
  };

  const getButtonText = () => {
    if (type === 'kit') return 'Adicionar Kit';
    if (type === 'theme') return 'Adicionar Tema';
    return 'Adicionar Produto';
  };

  return (
    <div className="text-center py-12 border border-dashed rounded-lg">
      <Package className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">Nenhum produto encontrado</h3>
      <p className="text-muted-foreground mt-1">{getMessage()}</p>
      {onAddProduct && (
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => onAddProduct(type)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {getButtonText()}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
