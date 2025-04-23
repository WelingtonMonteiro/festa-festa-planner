
import { Them } from '@/types';
import { toast } from 'sonner';

export const themApiService = {
  async getAll(apiUrl: string, page: number = 1, limit: number = 10, headers: HeadersInit = {}): Promise<any> {
    try {
      const response = await fetch(`${apiUrl}/temas?page=${page}&limit=${limit}`, { headers });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Sessão expirada. Por favor, faça login novamente.');
          // Aqui você pode adicionar lógica para redirecionar para a tela de login
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast.error('Falha ao carregar temas do servidor.');
      throw error;
    }
  },
  
  async getById(apiUrl: string, id: string, headers: HeadersInit = {}): Promise<Them | null> {
    try {
      const response = await fetch(`${apiUrl}/temas/${id}`, { headers });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Sessão expirada. Por favor, faça login novamente.');
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching theme with ID ${id}:`, error);
      toast.error('Falha ao carregar detalhes do tema.');
      return null;
    }
  },
  
  async create(apiUrl: string, them: Omit<Them, 'id' | 'vezes_alugado'>, headers: HeadersInit = {}): Promise<Them | null> {
    try {
      const response = await fetch(`${apiUrl}/temas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(them)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Sessão expirada. Por favor, faça login novamente.');
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating theme:', error);
      toast.error('Falha ao criar tema no servidor.');
      return null;
    }
  },
  
  async update(apiUrl: string, id: string, themUpdate: Partial<Them>, headers: HeadersInit = {}): Promise<Them | null> {
    try {
      const response = await fetch(`${apiUrl}/temas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(themUpdate)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Sessão expirada. Por favor, faça login novamente.');
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating theme with ID ${id}:`, error);
      toast.error('Falha ao atualizar tema no servidor.');
      return null;
    }
  },
  
  async delete(apiUrl: string, id: string, headers: HeadersInit = {}): Promise<boolean> {
    try {
      const response = await fetch(`${apiUrl}/temas/${id}`, {
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
      console.error(`Error deleting theme with ID ${id}:`, error);
      toast.error('Falha ao excluir tema do servidor.');
      return false;
    }
  }
};
