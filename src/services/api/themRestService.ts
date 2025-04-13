
import { Kit, Them } from '@/types';
import { toast } from 'sonner';

export const themRestService = {
  async getAll(apiUrl: string, allKits: Kit[]): Promise<Them[]> {
    try {
      const response = await fetch(`${apiUrl}/thems`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar temas: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Processar os temas recebidos para associar os objetos de Kit completos com base nos IDs
      return data.map((themData: any) => {
        // Se o tema contiver kits_ids, mapear para os objetos Kit completos
        const kits = themData.kits_ids 
          ? themData.kits_ids.map((kitId: string) => allKits.find(k => k.id === kitId)).filter(Boolean) 
          : themData.kits || [];
        
        return {
          ...themData,
          kits,
          valorGasto: themData.valorGasto || themData.valorgasto // Garantir compatibilidade dos campos
        };
      });
    } catch (error) {
      console.error('Falha ao buscar temas da API:', error);
      toast.error('Falha ao buscar temas da API REST');
      return [];
    }
  },
  
  async getById(id: string, apiUrl: string, allKits: Kit[]): Promise<Them | null> {
    try {
      const response = await fetch(`${apiUrl}/thems/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar tema: ${response.status}`);
      }
      
      const themData = await response.json();
      
      // Processar o tema para associar os objetos de Kit completos
      const kits = themData.kits_ids 
        ? themData.kits_ids.map((kitId: string) => allKits.find(k => k.id === kitId)).filter(Boolean) 
        : themData.kits || [];
      
      return {
        ...themData,
        kits,
        valorGasto: themData.valorGasto || themData.valorgasto // Garantir compatibilidade dos campos
      };
    } catch (error) {
      console.error('Falha ao buscar tema por id da API:', error);
      toast.error('Falha ao buscar tema da API REST');
      return null;
    }
  },
  
  async create(them: Omit<Them, 'id' | 'vezes_alugado'>, apiUrl: string): Promise<Them | null> {
    try {
      // Extrair IDs dos kits para enviar à API
      const kits_ids = them.kits.map(kit => kit.id);
      
      const response = await fetch(`${apiUrl}/thems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: them.nome,
          descricao: them.descricao,
          imagens: them.imagens,
          valorgasto: them.valorGasto, // Usar valorgasto para compatibilidade com backend
          vezes_alugado: 0,
          kits_ids
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao criar tema: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Retornar com estrutura padronizada
      return {
        ...data,
        kits: them.kits,
        valorGasto: data.valorGasto || data.valorgasto
      };
    } catch (error) {
      console.error('Falha ao criar tema na API:', error);
      toast.error('Falha ao criar tema na API REST');
      return null;
    }
  },
  
  async update(id: string, them: Partial<Them>, apiUrl: string): Promise<Them | null> {
    try {
      // Preparar dados para envio conforme esperado pela API
      const updateData: any = {
        nome: them.nome,
        descricao: them.descricao,
        imagens: them.imagens,
        valorgasto: them.valorGasto,
        vezes_alugado: them.vezes_alugado
      };
      
      // Se kits estão sendo atualizados, enviar array de IDs
      if (them.kits) {
        updateData.kits_ids = them.kits.map(kit => kit.id);
      }
      
      const response = await fetch(`${apiUrl}/thems/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar tema: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Retornar com estrutura padronizada
      return {
        ...data,
        kits: them.kits || [],
        valorGasto: data.valorGasto || data.valorgasto
      };
    } catch (error) {
      console.error('Falha ao atualizar tema na API:', error);
      toast.error('Falha ao atualizar tema na API REST');
      return null;
    }
  },
  
  async delete(id: string, apiUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${apiUrl}/thems/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir tema: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Falha ao excluir tema da API:', error);
      toast.error('Falha ao excluir tema da API REST');
      return false;
    }
  }
};
