
// Importamos o tipo Kit do arquivo correto
import { Kit } from "@/types";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";
import { CrudOperations, PaginatedResponse } from "@/types/crud";
import { useApi } from "@/contexts/apiContext";

export interface Them {
  id: string;
  nome: string;
  descricao: string;
  valorGasto: number;
  vezes_alugado: number;
  imagens: string[];
  is_archived: boolean;
  kits: Kit[];
  created_at: string;
  updated_at: string;
}

export const useThemService = (): CrudOperations<Them> & {
  getActiveThems: () => Promise<Them[]>;
  getByKitId: (kitId: string) => Promise<Them[]>;
  archiveThem: (id: string) => Promise<Them | null>;
} => {
  const factory = useStorageAdapterFactory();
  const { apiUrl } = useApi();
  
  const crudService = createCrudService<Them>(factory, {
    type: 'apiRest',
    config: {
      apiUrl: apiUrl || '',
      endpoint: 'thems'
    }
  });
  
  const kitService = createCrudService<Kit>(factory, {
    type: 'apiRest',
    config: {
      apiUrl: apiUrl || '',
      endpoint: 'kits'
    }
  });
  
  const getActiveThems = async (): Promise<Them[]> => {
    try {
      const result = await crudService.getAll();
      return result.data.filter(them => !them.is_archived);
    } catch (error) {
      console.error("Error fetching active themes:", error);
      return [];
    }
  };
  
  const getByKitId = async (kitId: string): Promise<Them[]> => {
    try {
      const kitResult = await kitService.getById(kitId);
      if (!kitResult) return [];
      
      const allThems = await crudService.getAll();
      return allThems.data.filter(them => 
        them.kits.some(kit => kit.id === kitId)
      );
    } catch (error) {
      console.error(`Error fetching themes by kit ID ${kitId}:`, error);
      return [];
    }
  };
  
  const archiveThem = async (id: string): Promise<Them | null> => {
    return crudService.update(id, { is_archived: true });
  };
  
  return {
    getAll: crudService.getAll,
    getById: crudService.getById,
    create: crudService.create,
    update: crudService.update,
    delete: crudService.delete,
    getActiveThems,
    getByKitId,
    archiveThem
  };
};
