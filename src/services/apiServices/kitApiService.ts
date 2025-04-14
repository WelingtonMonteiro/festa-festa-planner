
import { Kit } from "@/types";
import { toast } from "sonner";

export const kitApiService = {
  async getAll(apiUrl: string): Promise<Kit[]> {
    try {
      const response = await fetch(`${apiUrl}/kits`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar kits: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as Kit[];
    } catch (error) {
      console.error('Falha ao buscar kits da API:', error);
      toast.error('Falha ao buscar kits da API');
      return [];
    }
  },
  
  async getById(apiUrl: string, id: string): Promise<Kit | null> {
    try {
      const response = await fetch(`${apiUrl}/kits/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar kit: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as Kit;
    } catch (error) {
      console.error('Falha ao buscar kit da API:', error);
      toast.error('Falha ao buscar kit da API');
      return null;
    }
  },
  
  async create(apiUrl: string, kit: Omit<Kit, 'id' | 'vezes_alugado'>): Promise<Kit | null> {
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
        throw new Error(`Erro ao criar kit: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as Kit;
    } catch (error) {
      console.error('Falha ao criar kit na API:', error);
      toast.error('Falha ao criar kit na API');
      return null;
    }
  },
  
  async update(apiUrl: string, id: string, kit: Partial<Kit>): Promise<Kit | null> {
    try {
      const response = await fetch(`${apiUrl}/kits/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kit),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar kit: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as Kit;
    } catch (error) {
      console.error('Falha ao atualizar kit na API:', error);
      toast.error('Falha ao atualizar kit na API');
      return null;
    }
  },
  
  async delete(apiUrl: string, id: string): Promise<boolean> {
    try {
      const response = await fetch(`${apiUrl}/kits/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir kit: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Falha ao excluir kit da API:', error);
      toast.error('Falha ao excluir kit da API');
      return false;
    }
  }
};
