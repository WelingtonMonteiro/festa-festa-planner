
import { Plan } from "@/types/plans";
import { CrudOperations } from "@/types/crud";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";
import { useApi } from "@/contexts/apiContext";

// Serviço específico para Planos que estende o CRUD genérico
export const usePlanService = (): CrudOperations<Plan> & {
  getActivePlans: () => Promise<Plan[]>;
  togglePlanStatus: (id: string, isActive: boolean) => Promise<Plan | null>;
  archivePlan: (id: string) => Promise<Plan | null>;
} => {
  const factory = useStorageAdapterFactory();
  const { apiUrl } = useApi();
  
  // Criar serviço CRUD base com configuração correta para API REST
  const crudService = createCrudService<Plan>(factory, {
    type: 'apiRest',
    config: { 
      apiUrl: apiUrl || '',
      endpoint: 'plans' 
    }
  });

  // Função auxiliar para obter o ID real (id ou _id)
  const getRealId = (item: Plan): string => {
    if (!item) return '';
    return item.id || item._id || '';
  };

  // Métodos específicos para planos
  const getActivePlans = async (): Promise<Plan[]> => {
    try {
      const allPlans = await crudService.getAll();
      if (!Array.isArray(allPlans)) {
        console.error('Planos recebidos não são um array:', allPlans);
        return [];
      }
      return allPlans.filter(plan => plan.is_active === true && plan.is_archived === false);
    } catch (error) {
      console.error('Erro ao buscar planos ativos:', error);
      return [];
    }
  };

  const togglePlanStatus = async (id: string, isActive: boolean): Promise<Plan | null> => {
    console.log(`togglePlanStatus chamado com ID: ${id}, isActive: ${isActive}`);
    if (!id) {
      console.error('ID não fornecido para togglePlanStatus');
      return null;
    }
    return crudService.update(id, { is_active: isActive });
  };

  const archivePlan = async (id: string): Promise<Plan | null> => {
    console.log(`archivePlan chamado com ID: ${id}`);
    if (!id) {
      console.error('ID não fornecido para archivePlan');
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
    getActivePlans,
    togglePlanStatus,
    archivePlan
  };
};
