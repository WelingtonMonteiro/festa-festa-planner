
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

interface ProductListProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  type?: string;
}

const ProductList = ({
  products,
  onEditProduct,
  onDeleteProduct,
  type
}: ProductListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
        />
      ))}
    </div>
  );
};

export default ProductList;
