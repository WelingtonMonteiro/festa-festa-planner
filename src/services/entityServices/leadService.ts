
import { Leads } from "@/types/leads";
import { CrudOperations, StorageType } from "@/types/crud";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";
import { useApi } from "@/contexts/apiContext";

export const useLeadService = (): CrudOperations<Leads> => {
  const factory = useStorageAdapterFactory();
  const { apiUrl } = useApi();
  
  // Adaptar para a tabela/leads no backend/supabase/api
  const crudService = createCrudService<Leads>(factory, {
    type: StorageType.ApiRest,
    config: { 
      apiUrl: apiUrl || 'http://localhost:3000',
      endpoint: 'leads' // O resource do backend deve ser 'leads'
    }
  });
  return crudService;
};
