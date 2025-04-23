
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { useStorage } from '@/contexts/storageContext';
import { useApi } from '@/contexts/apiContext';
import { StorageType } from '@/types/crud';
import { CrudService } from '@/services/CrudService';
import { useStorageAdapterFactory } from '@/services/StorageAdapterFactory';

interface ProductsContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  refreshProducts: () => Promise<void>;
  getProductsByType: (type: string) => Product[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { storageType } = useStorage();
  const { apiType, apiUrl } = useApi();
  const factory = useStorageAdapterFactory();

  const getCurrentStorageType = () => {
    if (apiType === 'rest' && apiUrl) {
      return StorageType.ApiRest;
    } else if (storageType === 'supabase') {
      return StorageType.Supabase;
    }
    return StorageType.LocalStorage;
  };

  // Corrigir o tipo do config usado no CrudService
  const productService = new CrudService<Product>(
    factory,
    getCurrentStorageType() === StorageType.ApiRest
      ? {
          type: StorageType.ApiRest,
          config: { apiUrl: apiUrl || '', endpoint: 'products' }
        }
      : getCurrentStorageType() === StorageType.Supabase
      ? {
          type: StorageType.Supabase,
          config: { tableName: 'products' }
        }
      : {
          type: StorageType.LocalStorage,
          config: { storageKey: 'products' }
        }
  );

  useEffect(() => {
    refreshProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageType, apiType, apiUrl]);

  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, ...data } : product))
    );
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const getProductsByType = (type: string) => {
    return products.filter(product => product.type === type);
  };

  const value = {
    products,
    isLoading,
    addProduct,
    updateProduct,
    removeProduct,
    refreshProducts,
    getProductsByType
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
