
import { Them, ThemWithIds } from "@/types/index";
import { CrudOperations } from "@/types/crud";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";
import { useApi } from "@/contexts/apiContext";

// Serviço específico para Temas que estende o CRUD genérico
export const useThemService = (): CrudOperations<ThemWithIds> & {
  getActiveThems: () => Promise<ThemWithIds[]>;
  toggleThemStatus: (id: string, isActive: boolean) => Promise<ThemWithIds | null>;
  archiveThems: (id: string) => Promise<ThemWithIds | null>;
  importThems: (thems: Them[]) => Promise<ThemWithIds[]>;
} => {
  const factory = useStorageAdapterFactory();
  const { apiUrl } = useApi();
  
  // Criar serviço CRUD base
  const crudService = createCrudService<ThemWithIds>(factory, {
    type: 'apiRest',
    config: { 
      apiUrl: apiUrl || '',
      endpoint: 'thems' 
    }
  });

  // Métodos específicos para temas
  const getActiveThems = async (): Promise<ThemWithIds[]> => {
    try {
      const allThems = await crudService.getAll();
      return allThems.filter(them => them.is_active === true && them.is_archived === false);
    } catch (error) {
      console.error('Erro ao buscar temas ativos:', error);
      return [];
    }
  };

  const toggleThemStatus = async (id: string, isActive: boolean): Promise<ThemWithIds | null> => {
    console.log(`toggleThemStatus chamado com ID: ${id}, isActive: ${isActive}`);
    if (!id) {
      console.error('ID não fornecido para toggleThemStatus');
      return null;
    }
    return crudService.update(id, { is_active: isActive });
  };

  const archiveThems = async (id: string): Promise<ThemWithIds | null> => {
    console.log(`archiveThems chamado com ID: ${id}`);
    if (!id) {
      console.error('ID não fornecido para archiveThems');
      return null;
    }
    return crudService.update(id, { is_archived: true });
  };

  const importThems = async (thems: Them[]): Promise<ThemWithIds[]> => {
    try {
      console.log('Importando temas:', thems);
      const importedThems: ThemWithIds[] = [];
      
      for (const them of thems) {
        const themToImport = {
          ...them,
          is_active: true,
          is_archived: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const importedThem = await crudService.create(themToImport);
        if (importedThem) {
          importedThems.push(importedThem);
        }
      }
      
      return importedThems;
    } catch (error) {
      console.error('Erro ao importar temas:', error);
      return [];
    }
  };

  // Retorna a combinação do CRUD genérico com métodos específicos
  return {
    getAll: crudService.getAll,
    getById: crudService.getById,
    create: crudService.create,
    update: crudService.update,
    delete: crudService.delete,
    getActiveThems,
    toggleThemStatus,
    archiveThems,
    importThems
  };
};
