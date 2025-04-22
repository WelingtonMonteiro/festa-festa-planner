
import { TabsContent } from '@/components/ui/tabs';
import ProductList from '../ProductList';
import { DataPagination } from '@/components/common/DataPagination';
import { Product } from '@/types/product';

interface ThemsTabProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  paginationLinks: any[];
  isActive?: boolean;
  forceRender?: boolean;
}

const ThemsTab = ({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  paginationLinks,
  isActive = true,
  forceRender = false
}: ThemsTabProps) => {
  const contentStyle = forceRender ? { display: isActive ? 'block' : 'none' } : {};
  
  return (
    <TabsContent value="themes" className={isActive ? 'block' : 'hidden'} style={contentStyle}>
      <ProductList 
        products={products}
        type="theme"
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
    </TabsContent>
  );
};

export default ThemsTab;
