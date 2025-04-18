
import { Plan } from "@/types/plans";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";
import { createCrudService } from "@/services/CrudService";
import { useApi } from "@/contexts/apiContext";
import { PaginatedResponse } from "@/types/crud";

// Classe para StorageAdapterFactory para uso estático
class StorageAdapterFactory {
  private storageType: 'localStorage' | 'supabase' | 'apiRest';
  private apiUrl?: string;

  constructor(storageType: 'localStorage' | 'supabase' | 'apiRest', apiUrl?: string) {
    this.storageType = storageType;
    this.apiUrl = apiUrl;
  }

  getCurrentStorageType(): 'localStorage' | 'supabase' | 'apiRest' {
    return this.storageType;
  }

  createAdapter<T>(config: any) {
    // Implementação simplificada para uso estático
    const { ApiRestAdapter } = require('./adapters/ApiRestAdapter');
    return new ApiRestAdapter<T>({
      apiUrl: this.apiUrl || '',
      endpoint: config.config.endpoint
    });
  }
}

// Serviço para landing page usando CRUD genérico
export const planService = {
  async getPlans(page = 1, limit = 10): Promise<PaginatedResponse<Plan>> {
    const factory = new StorageAdapterFactory('apiRest', 'http://localhost:3000');
    
    const crudService = createCrudService<Plan>(factory, {
      type: 'apiRest',
      config: { 
        apiUrl: 'http://localhost:3000',
        endpoint: 'plans' 
      }
    });
    
    return crudService.getAll(page, limit);
  },
  
  async getActivePlans(): Promise<Plan[]> {
    try {
      const response = await this.getPlans();
      if (!Array.isArray(response.data)) {
        console.error('Planos recebidos não são um array:', response.data);
        return [];
      }
      return response.data.filter(plan => 
        plan.is_active === true && plan.is_archived === false
      );
    } catch (error) {
      console.error('Erro ao buscar planos ativos:', error);
      return [];
    }
  },
  
  async createPlan(plan: Omit<Plan, 'id' | '_id' | 'created_at' | 'updated_at'>): Promise<Plan | null> {
    const factory = new StorageAdapterFactory('apiRest', 'http://localhost:3000');
    
    const crudService = createCrudService<Plan>(factory, {
      type: 'apiRest',
      config: { 
        apiUrl: 'http://localhost:3000',
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
  
  async updatePlan(id: string, plan: Partial<Plan>): Promise<Plan | null> {
    const factory = new StorageAdapterFactory('apiRest', 'http://localhost:3000');
    
    const crudService = createCrudService<Plan>(factory, {
      type: 'apiRest',
      config: { 
        apiUrl: 'http://localhost:3000',
        endpoint: 'plans' 
      }
    });
    
    return crudService.update(id, {
      ...plan,
      updated_at: new Date().toISOString()
    });
  },
  
  async togglePlanStatus(id: string, isActive: boolean): Promise<Plan | null> {
    return this.updatePlan(id, { is_active: isActive });
  },
  
  async archivePlan(id: string): Promise<Plan | null> {
    return this.updatePlan(id, { is_archived: true });
  }
};
