
import { Them } from "@/types";
import { toast } from "sonner";

export const themApiService = {
  async getAll(apiUrl: string): Promise<Them[]> {
    try {
      const response = await fetch(`${apiUrl}/thems`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar temas: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as Them[];
    } catch (error) {
      console.error('Falha ao buscar temas da API:', error);
      toast.error('Falha ao buscar temas da API');
      return [];
    }
  },
  
  async getById(apiUrl: string, id: string): Promise<Them | null> {
    try {
      const response = await fetch(`${apiUrl}/thems/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar tema: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as Them;
    } catch (error) {
      console.error('Falha ao buscar tema da API:', error);
      toast.error('Falha ao buscar tema da API');
      return null;
    }
  },
  
  async create(apiUrl: string, them: Omit<Them, 'id' | 'vezes_alugado'>): Promise<Them | null> {
    try {
      const response = await fetch(`${apiUrl}/thems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...them,
          vezes_alugado: 0
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao criar tema: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as Them;
    } catch (error) {
      console.error('Falha ao criar tema na API:', error);
      toast.error('Falha ao criar tema na API');
      return null;
    }
  },
  
  async update(apiUrl: string, id: string, them: Partial<Them>): Promise<Them | null> {
    try {
      const response = await fetch(`${apiUrl}/thems/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(them),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar tema: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as Them;
    } catch (error) {
      console.error('Falha ao atualizar tema na API:', error);
      toast.error('Falha ao atualizar tema na API');
      return null;
    }
  },
  
  async delete(apiUrl: string, id: string): Promise<boolean> {
    try {
      const response = await fetch(`${apiUrl}/thems/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir tema: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Falha ao excluir tema da API:', error);
      toast.error('Falha ao excluir tema da API');
      return false;
    }
  }
};
