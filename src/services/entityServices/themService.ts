
// Importações
import { Kit } from '@/types/kits';
import { CrudOperations } from '@/types/crud';
import { createCrudService } from '@/services/CrudService';
import { useStorageAdapterFactory } from '@/services/StorageAdapterFactory';
import { useApi } from '@/contexts/apiContext';

// Função auxiliar para obter o ID real (id ou _id)
const getRealId = (item: any): string => {
  if (!item) return '';
  return item.id || item._id || '';
};

// Serviço específico para Temas que estende o CRUD genérico
export const useThemService = (): CrudOperations<Kit> & {
  getActiveThems: () => Promise<Kit[]>;
  toggleThemStatus: (id: string, isActive: boolean) => Promise<Kit | null>;
  archiveTheme: (id: string) => Promise<Kit | null>;
} => {
  const factory = useStorageAdapterFactory();
  const { apiUrl } = useApi();
  
  // Criar serviço CRUD base com configuração correta para API REST
  const crudService = createCrudService<Kit>(factory, {
    type: 'apiRest',
    config: { 
      apiUrl: apiUrl || '',
      endpoint: 'thems' 
    }
  });

  // Métodos específicos para temas
  const getActiveThems = async (): Promise<Kit[]> => {
    try {
      const allThems = await crudService.getAll();
      return allThems.filter(theme => theme.is_active === true && theme.is_archived === false);
    } catch (error) {
      console.error('Erro ao buscar temas ativos:', error);
      return [];
    }
  };

  const toggleThemStatus = async (id: string, isActive: boolean): Promise<Kit | null> => {
    console.log(`toggleThemStatus chamado com ID: ${id}, isActive: ${isActive}`);
    if (!id) {
      console.error('ID não fornecido para toggleThemStatus');
      return null;
    }
    return crudService.update(id, { is_active: isActive });
  };

  const archiveTheme = async (id: string): Promise<Kit | null> => {
    console.log(`archiveTheme chamado com ID: ${id}`);
    if (!id) {
      console.error('ID não fornecido para archiveTheme');
      return null;
    }
    return crudService.update(id, { is_archived: true });
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
    archiveTheme
  };
};
