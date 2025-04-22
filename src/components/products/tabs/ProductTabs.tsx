
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import KitsTab from './KitsTab';
import ThemsTab from './ThemsTab';
import ProductList from '../ProductList';
import { DataPagination } from '@/components/common/DataPagination';
import { Product } from '@/types/product';
import { Package, Tag, Grid3X3 } from 'lucide-react';
import { useState } from 'react';

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
  const [activeTab, setActiveTab] = useState("all");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger 
          value="all" 
          className="flex items-center"
          data-state={activeTab === "all" ? "active" : "inactive"}
        >
          <Grid3X3 className="mr-2 h-4 w-4" /> Todos
        </TabsTrigger>
        <TabsTrigger 
          value="kits" 
          className="flex items-center"
          data-state={activeTab === "kits" ? "active" : "inactive"}
        >
          <Package className="mr-2 h-4 w-4" /> Kits
        </TabsTrigger>
        <TabsTrigger 
          value="themes" 
          className="flex items-center"
          data-state={activeTab === "themes" ? "active" : "inactive"}
        >
          <Tag className="mr-2 h-4 w-4" /> Temas
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
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
      </TabsContent>
      
      <KitsTab
        products={products.filter(p => p.type === 'kit')}
        onAddProduct={() => onAddProduct('kit')}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        paginationLinks={paginationLinks}
        isActive={activeTab === "kits"}
      />
      
      <ThemsTab
        products={products.filter(p => p.type === 'theme')}
        onAddProduct={() => onAddProduct('theme')}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        paginationLinks={paginationLinks}
        isActive={activeTab === "themes"}
      />
    </Tabs>
  );
};

export default ProductTabs;
