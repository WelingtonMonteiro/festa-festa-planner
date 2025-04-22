
import { Product } from "@/types/product";
import { CrudOperations, StorageType } from "@/types/crud";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";

// Serviço específico para Produtos que estende o CRUD genérico
export const useProductService = (): CrudOperations<Product> & {
  incrementUsageCount: (id: string) => Promise<Product | null>;
  getByType: (type: string) => Promise<Product[]>;
} => {
  const factory = useStorageAdapterFactory();
  const crudService = createCrudService<Product>(factory, {
    type: StorageType.Supabase,
    config: { tableName: 'products' }
  });

  // Método específico para incrementar contagem de uso
  const incrementUsageCount = async (id: string): Promise<Product | null> => {
    const product = await crudService.getById(id);
    if (!product) return null;
    
    return crudService.update(id, { 
      rentCount: (product.rentCount || 0) + 1 
    });
  };
  
  // Método para obter produtos por tipo
  const getByType = async (type: string): Promise<Product[]> => {
    const response = await crudService.getAll();
    return response.data.filter(product => product.type === type);
  };

  // Retorna a combinação do CRUD genérico com métodos específicos
  return {
    ...crudService,
    incrementUsageCount,
    getByType
  };
};
