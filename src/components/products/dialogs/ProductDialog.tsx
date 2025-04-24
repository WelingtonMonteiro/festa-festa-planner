
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductForm from '../forms/ProductForm';
import { Product } from '@/types/product';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (productData: Omit<Product, 'id'>) => Promise<void>;
  onCancel: () => void;
  editingProduct: Product | null;
  isLoading?: boolean;
  type?: string;
  title?: string;
  description?: string;
  availableKits?: Product[]; // Added missing prop
}

const ProductDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  editingProduct,
  isLoading = false,
  type,
  title,
  description,
  availableKits = [] // Set default value
}: ProductDialogProps) => {
  const getDialogTitle = () => {
    if (title) return title;
    
    if (editingProduct) {
      return editingProduct.type === 'kit' 
        ? 'Editar Kit' 
        : editingProduct.type === 'theme' 
          ? 'Editar Tema' 
          : 'Editar Produto';
    }
    
    return type === 'kit' 
      ? 'Adicionar Novo Kit' 
      : type === 'theme' 
        ? 'Adicionar Novo Tema' 
        : 'Adicionar Novo Produto';
  };
  
  const getDialogDescription = () => {
    if (description) return description;
    
    const action = editingProduct ? 'editar' : 'adicionar';
    const productType = type === 'kit' 
      ? 'kit' 
      : type === 'theme' 
        ? 'tema' 
        : 'produto';
    
    return `Preencha os dados para ${action} um ${productType}.`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <ProductForm 
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialData={editingProduct}
          isEditing={!!editingProduct}
          isLoading={isLoading}
          type={type}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
