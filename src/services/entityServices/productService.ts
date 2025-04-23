
import { Product } from "@/types/product";
import { CrudOperations, StorageType } from "@/types/crud";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";

export const useProductService = (): CrudOperations<Product> & {
  getByType: (type: string) => Promise<Product[]>;
} => {
  const factory = useStorageAdapterFactory();
  const crudService = createCrudService<Product>(factory, {
    type: StorageType.Supabase,
    config: { tableName: 'products' }
  });

  // Método para obter produtos por tipo
  const getByType = async (type: string): Promise<Product[]> => {
    const response = await crudService.getAll();
    return response.data.filter(product => product.type === type);
  };

  return {
    ...crudService,
    getByType
  };
};
