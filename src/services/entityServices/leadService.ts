
import { Leads } from "@/pages/Leads";
import { CrudOperations, StorageType } from "@/types/crud";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";
import { useApi } from "@/contexts/apiContext";

export const useLeadService = (): CrudOperations<Leads> => {
  const factory = useStorageAdapterFactory();
  const { apiUrl } = useApi();
  // Adaptar para a tabela/leads no backend/supabase/api
  const crudService = createCrudService<Leads>(factory, {
    type: StorageType.ApiRest, // Troque para StorageType.Supabase se sua tabela for no supabase
    config: { 
      apiUrl: apiUrl || '',
      endpoint: 'leads' // O resource do backend deve ser 'leads'
    }
  });
  return crudService;
};
