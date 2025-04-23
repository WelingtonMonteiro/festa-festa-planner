
import { useState } from 'react';
import { Product, kitToProduct, themeToProduct } from '@/types/product';
import { useStorage } from '@/contexts/storageContext';
import { useApi } from '@/contexts/apiContext';
import { DataSource } from '@/services/unifiedKitService';
import { toast } from 'sonner';
import { CrudService } from '@/services/CrudService';
import { StorageType } from '@/types/crud';
import { useStorageAdapterFactory } from '@/services/StorageAdapterFactory';

export const useProductData = () => {
  const { storageType } = useStorage();
  const { apiType, apiUrl } = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const factory = useStorageAdapterFactory();

  const getCurrentDataSource = (): DataSource => {
    if (apiType === 'rest' && apiUrl) {
      return 'apiRest';
    } else if (storageType === 'supabase') {
      return 'supabase';
    }
    return 'localStorage';
  };

  const dataSource = getCurrentDataSource();

  const productService = new CrudService<Product>(
    factory,
    dataSource === 'apiRest'
      ? {
          type: StorageType.ApiRest,
          config: { apiUrl: apiUrl || '', endpoint: 'products' }
        }
      : dataSource === 'supabase'
      ? {
          type: StorageType.Supabase,
          config: { tableName: 'products' }
        }
      : {
          type: StorageType.LocalStorage,
          config: { storageKey: 'products' }
        }
  );

  const loadData = async (page = 1, limit = 10) => {
    setIsLoading(true);
    try {
      const response = await productService.getAll(page, limit);
      setProducts(response.data);
      return {
        products: response.data,
        total: response.total,
        page: response.page,
        limit: response.limit
      };
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Falha ao carregar produtos');
      return {
        products: [],
        total: 0,
        page: 1,
        limit
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSubmit = async (productData: Omit<Product, 'id' | 'rentCount'>) => {
    setIsLoading(true);
    try {
      if (productData) {
        const created = await productService.create({ ...productData });
        if (created) {
          setProducts(prev => [...prev, created]);
          toast.success('Produto adicionado com sucesso');
          return created;
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Falha ao salvar produto');
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const handleProductUpdate = async (id: string, productData: Partial<Product>) => {
    setIsLoading(true);
    try {
      const updated = await productService.update(id, productData);
      if (updated) {
        setProducts(prev => prev.map(p => p.id === id ? updated : p));
        toast.success('Produto atualizado com sucesso');
        return updated;
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Falha ao atualizar produto');
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const handleProductDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await productService.delete(id);
      if (success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast.success('Produto excluído com sucesso');
        return true;
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Falha ao excluir produto');
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  return {
    isLoading,
    products,
    setProducts,
    loadData,
    handleProductSubmit,
    handleProductUpdate,
    handleProductDelete
  };
};
