
import { DataPagination } from '@/components/common/DataPagination';
import { Product } from '@/types/product';
import ProductList from '../ProductList';
import TabsHeader from './TabsHeader';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

interface ProductTabsProps {
  products: Product[];
  onAddProduct: (type?: string) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  paginationLinks: any[];
  type?: string;
}

const ProductTabs = ({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  paginationLinks,
  type
}: ProductTabsProps) => {
  const filteredProducts = type 
    ? products.filter(product => product.type === type) 
    : products;

  return (
    <div className="space-y-4">
      <TabsHeader
        type={type}
        productsCount={filteredProducts.length}
        onAddProduct={onAddProduct}
        isLoading={isLoading}
      />
      
      {isLoading ? (
        <LoadingState />
      ) : filteredProducts.length > 0 ? (
        <ProductList
          products={filteredProducts}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
          type={type}
        />
      ) : (
        <EmptyState type={type} onAddProduct={onAddProduct} />
      )}

      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        paginationLinks={paginationLinks}
      />
    </div>
  );
};

export default ProductTabs;
