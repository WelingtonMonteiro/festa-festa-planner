import { Them } from "@/types";
import { toast } from "sonner";
import { PaginatedResponse } from "@/types/crud";

export const themApiService = {
  async getAll(apiUrl: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Them>> {
    try {
      console.log(`Fazendo requisição GET para ${apiUrl}/thems com parâmetros: page=${page}&limit=${limit}`);
      const response = await fetch(`${apiUrl}/thems?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar temas: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Resposta da API temas:', data);
      
      // Verificar se a resposta já está no formato paginado
      if (data && typeof data === 'object' && 'data' in data) {
        // Processar IDs
        const processedData = data.data.map((them: any) => {
          if (them._id && !them.id) {
            return { ...them, id: them._id };
          }
          return them;
        });
        
        return {
          data: processedData,
          total: data.total || processedData.length,
          page: data.page || page,
          limit: data.limit || limit
        };
      }
      
      // Se não estiver no formato paginado, adaptar
      const processedData = Array.isArray(data) ? data.map((them: any) => {
        if (them._id && !them.id) {
          return { ...them, id: them._id };
        }
        return them;
      }) : [];
      
      return {
        data: processedData,
        total: processedData.length,
        page,
        limit
      };
    } catch (error) {
      console.error('Falha ao buscar temas da API:', error);
      toast.error('Falha ao buscar temas da API');
      return { data: [], total: 0, page, limit };
    }
  },
  
  async getById(apiUrl: string, id: string): Promise<Them | null> {
    try {
      console.log('Fetching theme with ID:', id);
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
      console.log('Updating theme with ID:', id);
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
      console.log('Deleting theme with ID:', id);
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
