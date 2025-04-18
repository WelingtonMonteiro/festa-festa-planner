
import { Plan } from "@/types/plans";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";
import { createCrudService } from "@/services/CrudService";
import { useApi } from "@/contexts/apiContext";

// Serviço para landing page usando CRUD genérico
export const planService = {
  async getPlans() {
    const factory = new StorageAdapterFactory();
    const { apiUrl } = useApi ? useApi() : { apiUrl: '' };
    
    const crudService = createCrudService<Plan>(factory, {
      type: 'apiRest',
      config: { 
        apiUrl: apiUrl || '',
        endpoint: 'plans' 
      }
    });
    
    return crudService.getAll();
  },
  
  async getActivePlans() {
    const plans = await this.getPlans();
    return plans.filter(plan => 
      plan.is_active === true && plan.is_archived === false
    );
  },
  
  async createPlan(plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) {
    const factory = new StorageAdapterFactory();
    const { apiUrl } = useApi ? useApi() : { apiUrl: '' };
    
    const crudService = createCrudService<Plan>(factory, {
      type: 'apiRest',
      config: { 
        apiUrl: apiUrl || '',
        endpoint: 'plans' 
      }
    });
    
    const planData = {
      ...plan,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return crudService.create(planData);
  },
  
  async updatePlan(id: string, plan: Partial<Plan>) {
    const factory = new StorageAdapterFactory();
    const { apiUrl } = useApi ? useApi() : { apiUrl: '' };
    
    const crudService = createCrudService<Plan>(factory, {
      type: 'apiRest',
      config: { 
        apiUrl: apiUrl || '',
        endpoint: 'plans' 
      }
    });
    
    return crudService.update(id, {
      ...plan,
      updated_at: new Date().toISOString()
    });
  },
  
  async togglePlanStatus(id: string, isActive: boolean) {
    return this.updatePlan(id, { is_active: isActive });
  },
  
  async archivePlan(id: string) {
    return this.updatePlan(id, { is_archived: true });
  }
};

// Class para storageAdapterFactory para uso estático
class StorageAdapterFactory {
  createAdapter<T>(config: any) {
    // Implementação simplificada para uso estático
    return {
      getAll: async () => {
        const response = await fetch(`${config.config.apiUrl}/${config.config.endpoint}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        return await response.json();
      },
      getById: async (id: string) => {
        const response = await fetch(`${config.config.apiUrl}/${config.config.endpoint}/${id}`);
        if (!response.ok) return null;
        return await response.json();
      },
      create: async (item: any) => {
        const response = await fetch(`${config.config.apiUrl}/${config.config.endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        if (!response.ok) return null;
        return await response.json();
      },
      update: async (id: string, item: any) => {
        const response = await fetch(`${config.config.apiUrl}/${config.config.endpoint}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        if (!response.ok) return null;
        return await response.json();
      },
      delete: async (id: string) => {
        const response = await fetch(`${config.config.apiUrl}/${config.config.endpoint}/${id}`, {
          method: 'DELETE'
        });
        return response.ok;
      }
    };
  }

  getCurrentStorageType() {
    return 'apiRest';
  }
}
