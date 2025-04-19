
import { Kit } from "@/types";
import { CrudOperations, StorageType } from "@/types/crud";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";

// Serviço específico para Kits que estende o CRUD genérico
export const useKitService = (): CrudOperations<Kit> & {
  incrementUsageCount: (id: string) => Promise<Kit | null>;
} => {
  const factory = useStorageAdapterFactory();
  const crudService = createCrudService<Kit>(factory, {
    type: StorageType.Supabase,
    config: { tableName: 'kits' }
  });

  // Método específico para incrementar contagem de uso
  const incrementUsageCount = async (id: string): Promise<Kit | null> => {
    const kit = await crudService.getById(id);
    if (!kit) return null;
    
    return crudService.update(id, { 
      vezes_alugado: (kit.vezes_alugado || 0) + 1 
    });
  };

  // Retorna a combinação do CRUD genérico com métodos específicos
  return {
    ...crudService,
    incrementUsageCount
  };
};
