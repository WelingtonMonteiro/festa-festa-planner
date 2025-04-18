
import { Client } from "@/types";
import { CrudOperations } from "@/types/crud";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";
import { useApi } from "@/contexts/apiContext";

export const useClientService = (): CrudOperations<Client> & {
  getActiveClients: () => Promise<Client[]>;
  toggleClientStatus: (id: string, isActive: boolean) => Promise<Client | null>;
} => {
  const factory = useStorageAdapterFactory();
  const { apiUrl } = useApi();
  
  const crudService = createCrudService<Client>(factory, {
    type: 'apiRest',
    config: { 
      apiUrl: apiUrl || '',
      endpoint: 'clients' 
    }
  });

  const getActiveClients = async (): Promise<Client[]> => {
    try {
      const response = await crudService.getAll();
      return response.data.filter(client => client.ativo !== false);
    } catch (error) {
      console.error('Erro ao buscar clientes ativos:', error);
      return [];
    }
  };

  const toggleClientStatus = async (id: string, isActive: boolean): Promise<Client | null> => {
    return crudService.update(id, { ativo: isActive });
  };

  return {
    getAll: crudService.getAll,
    getById: crudService.getById,
    create: crudService.create,
    update: crudService.update,
    delete: crudService.delete,
    getActiveClients,
    toggleClientStatus
  };
};
