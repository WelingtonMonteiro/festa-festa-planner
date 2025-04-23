
import { kitService } from './kitService';
import { kitApiService } from './apiServices/kitApiService';
import { Kit } from '@/types';
import { toast } from 'sonner';
import { kitsMock } from '@/data/mockData';
import { PaginatedResponse } from '@/types/crud';
import { authService } from './authService';

// Tipo para a fonte de dados
export type DataSource = 'localStorage' | 'supabase' | 'apiRest';

export const unifiedKitService = {
  // Método auxiliar para obter cabeçalhos de autenticação
  getAuthHeaders(): HeadersInit {
    const token = authService.getToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  },

  async getAll(dataSource: DataSource, apiUrl?: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Kit> | Kit[]> {
    try {
      switch (dataSource) {
        case 'supabase':
          return await kitService.getAll();

        case 'apiRest':
          if (!apiUrl) {
            toast.error('URL da API não configurada');
            return { data: [], total: 0, page: 1, limit: 10 };
          }
          console.log(`Chamando kitApiService.getAll com página ${page} e limite ${limit}`);
          const headers = this.getAuthHeaders();
          console.log('Headers de autenticação:', headers);
          return await kitApiService.getAll(apiUrl, page, limit, headers);

        case 'localStorage':
        default:
          // Carregar do localStorage ou usar mock data
          const kitData = localStorage.getItem('kits');
          const kits = kitData ? JSON.parse(kitData) : kitsMock;

          // Implementar paginação manual para localStorage
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
          const paginatedKits = kits.slice(startIndex, endIndex);

          return {
            data: paginatedKits,
            total: kits.length,
            page,
            limit
          };
      }
    } catch (error) {
      console.error(`Erro ao buscar kits de ${dataSource}:`, error);
      toast.error(`Falha ao carregar kits de ${dataSource}`);
      return { data: [], total: 0, page, limit };
    }
  },

  async getById(id: string, dataSource: DataSource, apiUrl?: string): Promise<Kit | null> {
    try {
      switch (dataSource) {
        case 'supabase':
          return await kitService.getById(id);

        case 'apiRest':
          if (!apiUrl) {
            toast.error('URL da API não configurada');
            return null;
          }
          const headers = this.getAuthHeaders();
          return await kitApiService.getById(apiUrl, id, headers);

        case 'localStorage':
        default:
          const kitData = localStorage.getItem('kits');
          if (kitData) {
            const kits = JSON.parse(kitData) as Kit[];
            return kits.find(kit => kit.id === id) || null;
          }
          return null;
      }
    } catch (error) {
      console.error(`Erro ao buscar kit de ${dataSource}:`, error);
      toast.error(`Falha ao buscar kit de ${dataSource}`);
      return null;
    }
  },

  async create(
    kit: Omit<Kit, 'id' | 'vezes_alugado'>,
    dataSource: DataSource,
    apiUrl?: string
  ): Promise<Kit | null> {
    try {
      switch (dataSource) {
        case 'supabase':
          return await kitService.create(kit);

        case 'apiRest':
          if (!apiUrl) {
            toast.error('URL da API não configurada');
            return null;
          }
          const headers = this.getAuthHeaders();
          return await kitApiService.create(apiUrl, kit, headers);

        case 'localStorage':
        default:
          const newKit: Kit = {
            ...kit,
            id: `k${Date.now().toString()}`,
            vezes_alugado: 0
          };

          const kitData = localStorage.getItem('kits');
          const kits = kitData ? JSON.parse(kitData) as Kit[] : [];

          localStorage.setItem('kits', JSON.stringify([...kits, newKit]));
          return newKit;
      }
    } catch (error) {
      console.error(`Erro ao criar kit em ${dataSource}:`, error);
      toast.error(`Falha ao criar kit em ${dataSource}`);
      return null;
    }
  },

  async update(
    id: string,
    kitUpdate: Partial<Kit>,
    dataSource: DataSource,
    apiUrl?: string
  ): Promise<Kit | null> {
    try {
      switch (dataSource) {
        case 'supabase':
          return await kitService.update(id, kitUpdate);

        case 'apiRest':
          if (!apiUrl) {
            toast.error('URL da API não configurada');
            return null;
          }
          const headers = this.getAuthHeaders();
          return await kitApiService.update(apiUrl, id, kitUpdate, headers);

        case 'localStorage':
        default:
          const kitData = localStorage.getItem('kits');
          if (kitData) {
            const kits = JSON.parse(kitData) as Kit[];
            const updatedKits = kits.map(kit =>
              kit.id === id ? { ...kit, ...kitUpdate } : kit
            );

            localStorage.setItem('kits', JSON.stringify(updatedKits));
            return updatedKits.find(kit => kit.id === id) || null;
          }
          return null;
      }
    } catch (error) {
      console.error(`Erro ao atualizar kit em ${dataSource}:`, error);
      toast.error(`Falha ao atualizar kit em ${dataSource}`);
      return null;
    }
  },

  async delete(
    id: string,
    dataSource: DataSource,
    apiUrl?: string
  ): Promise<boolean> {
    try {
      switch (dataSource) {
        case 'supabase':
          return await kitService.delete(id);

        case 'apiRest':
          if (!apiUrl) {
            toast.error('URL da API não configurada');
            return false;
          }
          const headers = this.getAuthHeaders();
          return await kitApiService.delete(apiUrl, id, headers);

        case 'localStorage':
        default:
          const kitData = localStorage.getItem('kits');
          if (kitData) {
            const kits = JSON.parse(kitData) as Kit[];
            const filteredKits = kits.filter(kit => kit.id !== id);

            localStorage.setItem('kits', JSON.stringify(filteredKits));
            return true;
          }
          return false;
      }
    } catch (error) {
      console.error(`Erro ao excluir kit em ${dataSource}:`, error);
      toast.error(`Falha ao excluir kit em ${dataSource}`);
      return false;
    }
  }
};
