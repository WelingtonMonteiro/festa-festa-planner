import { Kit } from "@/types";
import { toast } from "sonner";
import { PaginatedResponse } from "@/types/crud";

export const kitApiService = {
  async getAll(apiUrl: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Kit>> {
    try {
      console.log(`Fazendo requisição GET para ${apiUrl}/kits com parâmetros: page=${page}&limit=${limit}`);
      const response = await fetch(`${apiUrl}/kits?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar kits: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Resposta da API kits:', data);
      
      // Verificar se a resposta já está no formato paginado
      if (data && typeof data === 'object' && 'data' in data) {
        // Processar IDs
        const processedData = data.data.map((kit: any) => {
          if (kit._id && !kit.id) {
            return { ...kit, id: kit._id };
          }
          return kit;
        });
        
        return {
          data: processedData,
          total: data.total || processedData.length,
          page: data.page || page,
          limit: data.limit || limit
        };
      }
      
      // Se não estiver no formato paginado, adaptar
      const processedData = Array.isArray(data) ? data.map((kit: any) => {
        if (kit._id && !kit.id) {
          return { ...kit, id: kit._id };
        }
        return kit;
      }) : [];
      
      return {
        data: processedData,
        total: processedData.length,
        page,
        limit
      };
    } catch (error) {
      console.error('Falha ao buscar kits da API:', error);
      toast.error('Falha ao buscar kits da API');
      return { data: [], total: 0, page, limit };
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
      console.log('Updating kit with ID:', id);
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
      console.log('Deleting kit with ID:', id);
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
