
import { Them, Kit } from "@/types";
import { CrudOperations } from "@/types/crud";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";
import { useKitService } from "./kitService";

// Serviço específico para Temas que estende o CRUD genérico
export const useThemService = (): CrudOperations<Them> & {
  incrementUsageCount: (id: string) => Promise<Them | null>;
  getWithKits: (id: string) => Promise<Them | null>;
} => {
  const factory = useStorageAdapterFactory();
  const crudService = createCrudService<Them>(factory, {
    type: 'supabase',
    config: { tableName: 'thems' }
  });
  
  const kitService = useKitService();

  // Método específico para incrementar contagem de uso
  const incrementUsageCount = async (id: string): Promise<Them | null> => {
    const them = await crudService.getById(id);
    if (!them) return null;
    
    return crudService.update(id, { 
      vezes_alugado: (them.vezes_alugado || 0) + 1 
    });
  };

  // Método específico para buscar tema com kits associados
  const getWithKits = async (id: string): Promise<Them | null> => {
    const them = await crudService.getById(id);
    if (!them || !them.kits_ids) return them;

    try {
      // Buscar detalhes de cada kit
      const kitPromises = (them.kits_ids as string[]).map(kitId => 
        kitService.getById(kitId)
      );
      
      const kits = await Promise.all(kitPromises);
      const validKits = kits.filter(kit => kit !== null) as Kit[];
      
      // Retornar tema com kits detalhados
      return {
        ...them,
        kits: validKits
      };
    } catch (error) {
      console.error('Erro ao buscar kits para o tema:', error);
      return them;
    }
  };

  // Retorna a combinação do CRUD genérico com métodos específicos
  return {
    ...crudService,
    incrementUsageCount,
    getWithKits
  };
};
