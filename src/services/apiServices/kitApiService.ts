
import { Kit } from '@/types';
import { toast } from 'sonner';

export const kitApiService = {
  async getAll(apiUrl: string, page: number = 1, limit: number = 10, headers: HeadersInit = {}): Promise<any> {
    try {
      const response = await fetch(`${apiUrl}/kits?page=${page}&limit=${limit}`, { headers });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Sessão expirada. Por favor, faça login novamente.');
          // Aqui você pode adicionar lógica para redirecionar para a tela de login
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching kits:', error);
      toast.error('Falha ao carregar kits do servidor.');
      throw error;
    }
  },
  
  async getById(apiUrl: string, id: string, headers: HeadersInit = {}): Promise<Kit | null> {
    try {
      const response = await fetch(`${apiUrl}/kits/${id}`, { headers });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Sessão expirada. Por favor, faça login novamente.');
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching kit with ID ${id}:`, error);
      toast.error('Falha ao carregar detalhes do kit.');
      return null;
    }
  },
  
  async create(apiUrl: string, kit: Omit<Kit, 'id' | 'vezes_alugado'>, headers: HeadersInit = {}): Promise<Kit | null> {
    try {
      const response = await fetch(`${apiUrl}/kits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(kit)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Sessão expirada. Por favor, faça login novamente.');
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating kit:', error);
      toast.error('Falha ao criar kit no servidor.');
      return null;
    }
  },
  
  async update(apiUrl: string, id: string, kitUpdate: Partial<Kit>, headers: HeadersInit = {}): Promise<Kit | null> {
    try {
      const response = await fetch(`${apiUrl}/kits/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(kitUpdate)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Sessão expirada. Por favor, faça login novamente.');
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating kit with ID ${id}:`, error);
      toast.error('Falha ao atualizar kit no servidor.');
      return null;
    }
  },
  
  async delete(apiUrl: string, id: string, headers: HeadersInit = {}): Promise<boolean> {
    try {
      const response = await fetch(`${apiUrl}/kits/${id}`, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Sessão expirada. Por favor, faça login novamente.');
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting kit with ID ${id}:`, error);
      toast.error('Falha ao excluir kit do servidor.');
      return false;
    }
  }
};
