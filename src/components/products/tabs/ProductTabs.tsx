
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProductList from '../ProductList';
import { DataPagination } from '@/components/common/DataPagination';
import { Product } from '@/types/product';
import { Grid3X3, Tag } from 'lucide-react';

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
  paginationLinks
}: ProductTabsProps) => {
  return (
    <div className="space-y-4">
      <ProductList 
        products={products}
        onAddProduct={onAddProduct}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
        isLoading={isLoading}
      />
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
