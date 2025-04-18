
import { Plan } from "@/types/plans";
import { CrudOperations } from "@/types/crud";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";
import { useApi } from "@/contexts/apiContext";
import { Them, Kit } from "@/types";

// Serviço específico para Temas que estende o CRUD genérico
export const useThemService = (): CrudOperations<Them> & {
  getByIdWithKits: (id: string, allKits: Kit[]) => Promise<Them | null>;
  createWithKits: (them: Omit<Them, 'id' | 'vezes_alugado'>, allKits: Kit[]) => Promise<Them | null>;
  updateWithKits: (id: string, them: Partial<Them>, allKits: Kit[]) => Promise<Them | null>;
} => {
  const factory = useStorageAdapterFactory();
  const { apiUrl } = useApi();
  
  // Criar serviço CRUD base com configuração correta
  const crudService = createCrudService<Them>(factory, {
    type: 'apiRest',
    config: { 
      apiUrl: apiUrl || '',
      endpoint: 'thems' 
    }
  });

  // Função para mapear kits_ids para objetos Kit completos
  const mapKitsToThem = (them: any, allKits: Kit[]): Them => {
    if (!them) return them;
    
    // Se o tema tem kits_ids, mapeia para objetos Kit
    const kitsIds = them.kits_ids || [];
    const kits = kitsIds.map((kitId: string) => 
      allKits.find(kit => kit.id === kitId) || allKits.find(kit => kit._id === kitId)
    ).filter(Boolean);
    
    return {
      ...them,
      kits: kits || [],
      valorGasto: them.valorgasto || them.valorGasto // Normaliza os dois formatos possíveis
    };
  };

  // Função para obter o ID real (id ou _id)
  const getRealId = (item: any): string => {
    if (!item) return '';
    return item.id || item._id || '';
  };

  // Métodos específicos para temas com integração de kits
  const getByIdWithKits = async (id: string, allKits: Kit[]): Promise<Them | null> => {
    try {
      const them = await crudService.getById(id);
      if (!them) return null;
      return mapKitsToThem(them, allKits);
    } catch (error) {
      console.error('Erro ao buscar tema com kits:', error);
      return null;
    }
  };

  const createWithKits = async (them: Omit<Them, 'id' | 'vezes_alugado'>, allKits: Kit[]): Promise<Them | null> => {
    try {
      // Prepara os dados para salvar (kits_ids em vez de objetos kit)
      const kitsIds = them.kits.map(kit => kit.id || kit._id).filter(Boolean);
      
      const themToSave: any = {
        nome: them.nome,
        descricao: them.descricao,
        imagens: them.imagens,
        valorgasto: them.valorGasto, // Usa valorgasto em vez de valorGasto para compatibilidade
        vezes_alugado: 0,
        kits_ids: kitsIds
      };
      
      const newThem = await crudService.create(themToSave);
      if (!newThem) return null;
      
      return mapKitsToThem(newThem, allKits);
    } catch (error) {
      console.error('Erro ao criar tema com kits:', error);
      return null;
    }
  };

  const updateWithKits = async (id: string, them: Partial<Them>, allKits: Kit[]): Promise<Them | null> => {
    try {
      // Prepara os dados para salvar
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (them.nome !== undefined) updateData.nome = them.nome;
      if (them.descricao !== undefined) updateData.descricao = them.descricao;
      if (them.imagens !== undefined) updateData.imagens = them.imagens;
      if (them.valorGasto !== undefined) updateData.valorgasto = them.valorGasto;
      if (them.vezes_alugado !== undefined) updateData.vezes_alugado = them.vezes_alugado;
      
      // Se kits são fornecidos, atualiza kits_ids
      if (them.kits !== undefined) {
        updateData.kits_ids = them.kits.map(kit => kit.id || kit._id).filter(Boolean);
      }
      
      const updatedThem = await crudService.update(id, updateData);
      if (!updatedThem) return null;
      
      return mapKitsToThem(updatedThem, allKits);
    } catch (error) {
      console.error('Erro ao atualizar tema com kits:', error);
      return null;
    }
  };

  // Retorna a combinação do CRUD genérico com métodos específicos
  return {
    getAll: async () => {
      const themes = await crudService.getAll();
      return themes;
    },
    getById: crudService.getById,
    create: crudService.create,
    update: crudService.update,
    delete: crudService.delete,
    getByIdWithKits,
    createWithKits,
    updateWithKits
  };
};
