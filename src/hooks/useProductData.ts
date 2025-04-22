
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
  const { addKit, addThems, updateKit, updateThems, removeKit, removeThems } = useHandleContext();
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

  // Create CRUD services for kits, themes, and products
  const kitService = new CrudService(factory, {
    type: StorageType.Supabase,
    config: { tableName: 'kits' }
  });

  const themService = new CrudService(factory, {
    type: StorageType.Supabase,
    config: { tableName: 'thems' }
  });

  const productService = new CrudService<Product>(factory, {
    type: StorageType.Supabase,
    config: { tableName: 'products' }
  });

  const loadData = async (page = 1, limit = 10) => {
    setIsLoading(true);
    try {
      // For now, we'll load data from both old tables and merge
      const kitResponse = await kitService.getAll(page, limit);
      const themResponse = await themService.getAll(page, limit);
      
      // Convert to products format
      const kitProducts = kitResponse.data.map(kit => kitToProduct(kit));
      const themProducts = themResponse.data.map(theme => themeToProduct(theme, kitProducts));
      
      // Combine products
      const allProducts = [...kitProducts, ...themProducts];
      setProducts(allProducts);
      
      return {
        products: allProducts,
        total: kitResponse.total + themResponse.total,
        page: page,
        limit: limit
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
        // Handle based on product type
        if (productData.type === 'kit') {
          // Convert to kit format for backward compatibility
          const kitData = {
            nome: productData.name,
            descricao: productData.description || '',
            preco: productData.price || 0,
            itens: productData.items || [],
            imagens: productData.images || []
          };
          
          const result = await kitService.create(kitData);
          if (result) {
            addKit(result);
            const newProduct = kitToProduct(result);
            setProducts(prev => [...prev, newProduct]);
            toast.success(`Kit adicionado com sucesso via ${dataSource}`);
            return newProduct;
          }
        } else if (productData.type === 'theme') {
          // Convert to theme format for backward compatibility
          const themeData = {
            nome: productData.name,
            descricao: productData.description || '',
            imagens: productData.images || [],
            valorGasto: productData.metadata?.valorGasto || 0,
            kits_ids: productData.metadata?.kitsIds || []
          };
          
          const result = await themService.create(themeData);
          if (result) {
            addThems(result);
            const newProduct = themeToProduct(result, products.filter(p => p.type === 'kit'));
            setProducts(prev => [...prev, newProduct]);
            toast.success(`Tema adicionado com sucesso via ${dataSource}`);
            return newProduct;
          }
        } else {
          // Generic product case - future implementation
          const result = await productService.create({
            ...productData,
            rentCount: 0
          });
          
          if (result) {
            setProducts(prev => [...prev, result]);
            toast.success(`Produto adicionado com sucesso via ${dataSource}`);
            return result;
          }
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(`Falha ao salvar ${productData.type === 'kit' ? 'kit' : productData.type === 'theme' ? 'tema' : 'produto'}`);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const handleProductUpdate = async (id: string, productData: Partial<Product>) => {
    setIsLoading(true);
    try {
      const existingProduct = products.find(p => p.id === id);
      if (!existingProduct) return null;
      
      if (existingProduct.type === 'kit') {
        // Update in kits table
        const kitData: any = {};
        if (productData.name) kitData.nome = productData.name;
        if (productData.description) kitData.descricao = productData.description;
        if (productData.price) kitData.preco = productData.price;
        if (productData.items) kitData.itens = productData.items;
        if (productData.images) kitData.imagens = productData.images;
        
        const result = await kitService.update(id, kitData);
        if (result) {
          updateKit(id, kitData);
          const updatedProduct = kitToProduct(result);
          setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
          toast.success(`Kit atualizado com sucesso via ${dataSource}`);
          return updatedProduct;
        }
      } else if (existingProduct.type === 'theme') {
        // Update in themes table
        const themeData: any = {};
        if (productData.name) themeData.nome = productData.name;
        if (productData.description) themeData.descricao = productData.description;
        if (productData.images) themeData.imagens = productData.images;
        if (productData.metadata?.valorGasto) themeData.valorGasto = productData.metadata.valorGasto;
        if (productData.metadata?.kitsIds) themeData.kits_ids = productData.metadata.kitsIds;
        
        const result = await themService.update(id, themeData);
        if (result) {
          updateThems(id, themeData);
          const updatedProduct = themeToProduct(result, products.filter(p => p.type === 'kit'));
          setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
          toast.success(`Tema atualizado com sucesso via ${dataSource}`);
          return updatedProduct;
        }
      } else {
        // Generic product update - future implementation
        const result = await productService.update(id, productData);
        if (result) {
          setProducts(prev => prev.map(p => p.id === id ? result : p));
          toast.success(`Produto atualizado com sucesso via ${dataSource}`);
          return result;
        }
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(`Falha ao atualizar ${existingProduct.type === 'kit' ? 'kit' : existingProduct.type === 'theme' ? 'tema' : 'produto'}`);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const handleProductDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const productToDelete = products.find(p => p.id === id);
      if (!productToDelete) return false;
      
      let success = false;
      
      if (productToDelete.type === 'kit') {
        // Delete from kits table
        success = await kitService.delete(id);
        if (success) {
          removeKit(id);
          setProducts(prev => prev.filter(p => p.id !== id));
          toast.success(`Kit excluído com sucesso via ${dataSource}`);
        }
      } else if (productToDelete.type === 'theme') {
        // Delete from themes table
        success = await themService.delete(id);
        if (success) {
          removeThems(id);
          setProducts(prev => prev.filter(p => p.id !== id));
          toast.success(`Tema excluído com sucesso via ${dataSource}`);
        }
      } else {
        // Generic product delete - future implementation
        success = await productService.delete(id);
        if (success) {
          setProducts(prev => prev.filter(p => p.id !== id));
          toast.success(`Produto excluído com sucesso via ${dataSource}`);
        }
      }
      
      return success;
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

// Add this import at the top of the file
import { useHandleContext } from '@/contexts/handleContext';
