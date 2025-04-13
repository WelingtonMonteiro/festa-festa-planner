
import { Kit } from '@/types';
import { toast } from 'sonner';

export const kitRestService = {
  async getAll(apiUrl: string): Promise<Kit[]> {
    try {
      const response = await fetch(`${apiUrl}/kits`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar kits: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Falha ao buscar kits da API:', error);
      toast.error('Falha ao buscar kits da API REST');
      return [];
    }
  },
  
  async getById(id: string, apiUrl: string): Promise<Kit | null> {
    try {
      const response = await fetch(`${apiUrl}/kits/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar kit: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Falha ao buscar kit por id da API:', error);
      toast.error('Falha ao buscar kit da API REST');
      return null;
    }
  },
  
  async create(kit: Omit<Kit, 'id' | 'vezes_alugado'>, apiUrl: string): Promise<Kit | null> {
    try {
      const response = await fetch(`${apiUrl}/kits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...kit,
          vezes_alugado: 0
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao criar kit: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Falha ao criar kit na API:', error);
      toast.error('Falha ao criar kit na API REST');
      return null;
    }
  },
  
  async update(id: string, kit: Partial<Kit>, apiUrl: string): Promise<Kit | null> {
    try {
      const response = await fetch(`${apiUrl}/kits/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kit),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar kit: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Falha ao atualizar kit na API:', error);
      toast.error('Falha ao atualizar kit na API REST');
      return null;
    }
  },
  
  async delete(id: string, apiUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${apiUrl}/kits/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir kit: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Falha ao excluir kit na API:', error);
      toast.error('Falha ao excluir kit na API REST');
      return false;
    }
  }
};
