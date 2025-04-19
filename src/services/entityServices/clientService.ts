
import { Client } from "@/types";
import { CrudOperations } from "@/types/crud";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";
import { useApi } from "@/contexts/apiContext";

// Interface extending the generic CRUD operations with client-specific methods
interface ClientService extends CrudOperations<Client> {
  getActiveClients: () => Promise<Client[]>;
  toggleClientStatus: (id: string, isActive: boolean) => Promise<Client | null>;
  getInactiveClients: () => Promise<Client[]>;
  getLatePaymentClients: () => Promise<Client[]>;
  getCanceledClients: () => Promise<Client[]>;
  getClientsByLastAccess: () => Promise<Client[]>;
}

// Client service implementation
export const useClientService = (): ClientService => {
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
    const response = await crudService.getAll();
    return response.data.filter(client => client.ativo !== false);
  };

  const getInactiveClients = async (): Promise<Client[]> => {
    const response = await crudService.getAll();
    return response.data.filter(client => client.ativo === false);
  };

  const getLatePaymentClients = async (): Promise<Client[]> => {
    const response = await crudService.getAll();
    return response.data.filter(client => {
      // Implement late payment logic based on your business rules
      return client.historico?.some(event => event.valorRestante > 0) || false;
    });
  };

  const getCanceledClients = async (): Promise<Client[]> => {
    const response = await crudService.getAll();
    return response.data.filter(client => {
      return client.historico?.some(event => event.status === 'cancelado') || false;
    });
  };

  const getClientsByLastAccess = async (): Promise<Client[]> => {
    const response = await crudService.getAll();
    return response.data.sort((a, b) => {
      const lastAccessA = a.historico?.length ? new Date(a.historico[a.historico.length - 1].data) : new Date(0);
      const lastAccessB = b.historico?.length ? new Date(b.historico[b.historico.length - 1].data) : new Date(0);
      return lastAccessB.getTime() - lastAccessA.getTime();
    });
  };

  const toggleClientStatus = async (id: string, isActive: boolean): Promise<Client | null> => {
    return crudService.update(id, { ativo: isActive });
  };

  return {
    ...crudService,
    getActiveClients,
    toggleClientStatus,
    getInactiveClients,
    getLatePaymentClients,
    getCanceledClients,
    getClientsByLastAccess
  };
};
