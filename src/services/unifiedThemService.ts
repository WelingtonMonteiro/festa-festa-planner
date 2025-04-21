
import { themService } from './themService';
import { themApiService } from './apiServices/themApiService';
import { Kit, Them } from '@/types';
import { toast } from 'sonner';
import { temasMock } from '@/data/mockData';
import { DataSource } from './unifiedKitService';
import { PaginatedResponse } from '@/types/crud';
import { authService } from './authService';

export const unifiedThemService = {
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

  async getAll(
    dataSource: DataSource, 
    kits: Kit[], 
    apiUrl?: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<PaginatedResponse<Them> | Them[]> {
    try {
      switch (dataSource) {
        case 'supabase':
          return await themService.getAll(kits);
        
        case 'apiRest':
          if (!apiUrl) {
            toast.error('URL da API não configurada');
            return { data: [], total: 0, page: 1, limit: 10 };
          }
          console.log(`Chamando themApiService.getAll com página ${page} e limite ${limit}`);
          const headers = this.getAuthHeaders();
          console.log('Headers de autenticação:', headers);
          return await themApiService.getAll(apiUrl, page, limit, headers);
        
        case 'localStorage':
        default:
          const themData = localStorage.getItem('temas');
          const themes = themData ? JSON.parse(themData) : temasMock;
          
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
          const paginatedThemes = themes.slice(startIndex, endIndex);
          
          return {
            data: paginatedThemes,
            total: themes.length,
            page,
            limit
          };
      }
    } catch (error) {
      console.error(`Erro ao buscar temas de ${dataSource}:`, error);
      toast.error(`Falha ao carregar temas de ${dataSource}`);
      return { data: [], total: 0, page, limit };
    }
  },

  async getById(id: string, dataSource: DataSource, kits: Kit[], apiUrl?: string): Promise<Them | null> {
    try {
      console.log('Getting theme by ID:', id, 'from', dataSource);
      switch (dataSource) {
        case 'supabase':
          return await themService.getById(id, kits);
        
        case 'apiRest':
          if (!apiUrl) {
            toast.error('URL da API não configurada');
            return null;
          }
          const headers = this.getAuthHeaders();
          return await themApiService.getById(apiUrl, id, headers);
          
        case 'localStorage':
        default:
          const themData = localStorage.getItem('temas');
          if (themData) {
            const themes = JSON.parse(themData) as Them[];
            return themes.find(theme => theme.id === id) || null;
          }
          return null;
      }
    } catch (error) {
      console.error(`Erro ao buscar tema de ${dataSource}:`, error);
      toast.error(`Falha ao buscar tema de ${dataSource}`);
      return null;
    }
  },

  async create(
    them: Omit<Them, 'id' | 'vezes_alugado'>, 
    dataSource: DataSource,
    kits: Kit[],
    apiUrl?: string
  ): Promise<Them | null> {
    try {
      switch (dataSource) {
        case 'supabase':
          return await themService.create(them, kits);
        
        case 'apiRest':
          if (!apiUrl) {
            toast.error('URL da API não configurada');
            return null;
          }
          const headers = this.getAuthHeaders();
          return await themApiService.create(apiUrl, them, headers);
        
        case 'localStorage':
        default:
          const newThem: Them = {
            ...them,
            id: `t${Date.now().toString()}`,
            vezes_alugado: 0
          };
          
          const themData = localStorage.getItem('temas');
          const themes = themData ? JSON.parse(themData) as Them[] : [];
          
          localStorage.setItem('temas', JSON.stringify([...themes, newThem]));
          return newThem;
      }
    } catch (error) {
      console.error(`Erro ao criar tema em ${dataSource}:`, error);
      toast.error(`Falha ao criar tema em ${dataSource}`);
      return null;
    }
  },

  async update(
    id: string,
    themUpdate: Partial<Them>,
    dataSource: DataSource,
    kits: Kit[],
    apiUrl?: string
  ): Promise<Them | null> {
    try {
      console.log('Updating theme:', id, 'in', dataSource);
      switch (dataSource) {
        case 'supabase':
          return await themService.update(id, themUpdate, kits);
        
        case 'apiRest':
          if (!apiUrl) {
            toast.error('URL da API não configurada');
            return null;
          }
          const headers = this.getAuthHeaders();
          return await themApiService.update(apiUrl, id, themUpdate, headers);
        
        case 'localStorage':
        default:
          const themData = localStorage.getItem('temas');
          if (themData) {
            const themes = JSON.parse(themData) as Them[];
            const updatedThemes = themes.map(them => 
              them.id === id ? { ...them, ...themUpdate } : them
            );
            
            localStorage.setItem('temas', JSON.stringify(updatedThemes));
            return updatedThemes.find(them => them.id === id) || null;
          }
          return null;
      }
    } catch (error) {
      console.error(`Erro ao atualizar tema em ${dataSource}:`, error);
      toast.error(`Falha ao atualizar tema em ${dataSource}`);
      return null;
    }
  },

  async delete(
    id: string, 
    dataSource: DataSource, 
    apiUrl?: string
  ): Promise<boolean> {
    try {
      console.log('Deleting theme:', id, 'from', dataSource);
      switch (dataSource) {
        case 'supabase':
          return await themService.delete(id);
        
        case 'apiRest':
          if (!apiUrl) {
            toast.error('URL da API não configurada');
            return false;
          }
          const headers = this.getAuthHeaders();
          return await themApiService.delete(apiUrl, id, headers);
        
        case 'localStorage':
        default:
          const themData = localStorage.getItem('temas');
          if (themData) {
            const themes = JSON.parse(themData) as Them[];
            const filteredThemes = themes.filter(them => them.id !== id);
            
            localStorage.setItem('temas', JSON.stringify(filteredThemes));
            return true;
          }
          return false;
      }
    } catch (error) {
      console.error(`Erro ao excluir tema em ${dataSource}:`, error);
      toast.error(`Falha ao excluir tema em ${dataSource}`);
      return false;
    }
  }
};
