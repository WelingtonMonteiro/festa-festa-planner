
import { Kit, Them } from "@/types";
import { CrudOperations, StorageType } from "@/types/crud";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";
import { useApi } from "@/contexts/apiContext";

export const useThemService = (): CrudOperations<Them> & {
  getPopularThems: () => Promise<Them[]>;
  getThemWithKits: (id: string) => Promise<Them | null>;
  incrementUsageCount: (id: string) => Promise<Them | null>;
} => {
  const factory = useStorageAdapterFactory();
  const { apiUrl } = useApi();
  
  // Versão básica do CRUD
  const crudService = createCrudService<Them>(factory, {
    type: StorageType.ApiRest,
    config: { 
      apiUrl: apiUrl || '',
      endpoint: 'thems' 
    }
  });
  
  // Versão específica para buscar kits associados ao tema
  const getThemWithKits = async (id: string): Promise<Them | null> => {
    const them = await crudService.getById(id);
    if (!them) return null;
    
    // Aqui você buscaria os kits associados ao tema
    // Para simplificar, vamos retornar o tema sem buscar os kits
    return them;
  };
  
  // Método para buscar temas mais populares
  const getPopularThems = async (): Promise<Them[]> => {
    const response = await crudService.getAll();
    return response.data.sort((a, b) => (b.vezes_alugado || 0) - (a.vezes_alugado || 0)).slice(0, 5);
  };
  
  // Método específico para incrementar contagem de uso
  const incrementUsageCount = async (id: string): Promise<Them | null> => {
    const them = await crudService.getById(id);
    if (!them) return null;
    
    return crudService.update(id, { 
      vezes_alugado: (them.vezes_alugado || 0) + 1 
    });
  };
  
  // Retorna a combinação do CRUD genérico com métodos específicos
  return {
    ...crudService,
    getPopularThems,
    getThemWithKits,
    incrementUsageCount,
  };
};
