
import { themService } from './themService';
import { themApiService } from './apiServices/themApiService';
import { Kit, Them } from '@/types';
import { toast } from 'sonner';
import { temasMock } from '@/data/mockData';
import { DataSource } from './unifiedKitService';

export const unifiedThemService = {
  async getAll(dataSource: DataSource, kits: Kit[], apiUrl?: string): Promise<Them[]> {
    try {
      switch (dataSource) {
        case 'supabase':
          return await themService.getAll(kits);
        
        case 'apiRest':
          if (!apiUrl) {
            toast.error('URL da API não configurada');
            return [];
          }
          return await themApiService.getAll(apiUrl);
        
        case 'localStorage':
        default:
          // Carregar do localStorage ou usar mock data
          const themData = localStorage.getItem('temas');
          return themData ? JSON.parse(themData) : temasMock;
      }
    } catch (error) {
      console.error(`Erro ao buscar temas de ${dataSource}:`, error);
      toast.error(`Falha ao carregar temas de ${dataSource}`);
      return [];
    }
  },

  async getById(id: string, dataSource: DataSource, kits: Kit[], apiUrl?: string): Promise<Them | null> {
    try {
      switch (dataSource) {
        case 'supabase':
          return await themService.getById(id, kits);
        
        case 'apiRest':
          if (!apiUrl) {
            toast.error('URL da API não configurada');
            return null;
          }
          return await themApiService.getById(apiUrl, id);
          
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
          return await themApiService.create(apiUrl, them);
        
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
      switch (dataSource) {
        case 'supabase':
          return await themService.update(id, themUpdate, kits);
        
        case 'apiRest':
          if (!apiUrl) {
            toast.error('URL da API não configurada');
            return null;
          }
          return await themApiService.update(apiUrl, id, themUpdate);
        
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
      switch (dataSource) {
        case 'supabase':
          return await themService.delete(id);
        
        case 'apiRest':
          if (!apiUrl) {
            toast.error('URL da API não configurada');
            return false;
          }
          return await themApiService.delete(apiUrl, id);
        
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
