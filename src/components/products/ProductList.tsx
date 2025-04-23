
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { Package, Plus, Loader2 } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductListProps {
  products: Product[];
  onAddProduct?: (type?: string) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  isLoading?: boolean;
  type?: string;
}

const ProductList = ({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  isLoading = false,
  type
}: ProductListProps) => {
  const filteredProducts = type 
    ? products.filter(product => product.type === type) 
    : products;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {type ? `${type === 'kit' ? 'Kits' : type === 'theme' ? 'Temas' : 'Produtos'} (${filteredProducts.length})` : `Todos os Produtos (${filteredProducts.length})`}
        </h3>
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
            {type === 'kit' ? 'Adicionar Kit' : 
             type === 'theme' ? 'Adicionar Tema' : 'Adicionar Produto'}
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Package className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground mt-1">
            {type === 'kit' ? 'Adicione kits para começar' : 
             type === 'theme' ? 'Adicione temas para começar' : 'Adicione produtos para começar'}
          </p>
          {onAddProduct && (
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => onAddProduct(type)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {type === 'kit' ? 'Adicionar Kit' : 
               type === 'theme' ? 'Adicionar Tema' : 'Adicionar Produto'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
