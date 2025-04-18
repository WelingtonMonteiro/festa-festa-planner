
import { Them, Kit } from "@/types";
import { CrudOperations } from "@/types/crud";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";

// Interface estendida para incluir os campos adicionais necessários
interface ThemWithIds extends Omit<Them, 'kits'> {
  kits_ids?: string[];
}

// Serviço específico para Temas que estende o CRUD genérico
export const useThemService = (allKits: Kit[]): CrudOperations<Them> & {
  getTrendingThems: () => Promise<Them[]>;
} => {
  const factory = useStorageAdapterFactory();
  const crudService = createCrudService<ThemWithIds>(factory, {
    type: 'supabase',
    config: { tableName: 'thems' }
  });

  // Função para converter Them para ThemWithIds (para salvar no banco)
  const themToRecord = (them: Omit<Them, 'id'>): Omit<ThemWithIds, 'id'> => {
    const kitIds = them.kits.map(kit => kit.id);
    
    return {
      nome: them.nome,
      descricao: them.descricao,
      imagens: them.imagens,
      valorGasto: them.valorGasto,
      vezes_alugado: them.vezes_alugado || 0,
      kits_ids: kitIds
    };
  };

  // Função para converter ThemWithIds para Them (ao ler do banco)
  const recordToThem = (record: ThemWithIds): Them => {
    const kits = (record.kits_ids || [])
      .map(id => allKits.find(k => k.id === id))
      .filter((kit): kit is Kit => kit !== undefined);
      
    return {
      id: record.id,
      nome: record.nome,
      descricao: record.descricao,
      imagens: record.imagens,
      valorGasto: record.valorGasto,
      vezes_alugado: record.vezes_alugado || 0,
      kits: kits
    };
  };

  // Sobrescrever métodos do CRUD para tratar a conversão
  const getAll = async (): Promise<Them[]> => {
    const records = await crudService.getAll();
    return records.map(record => recordToThem(record));
  };

  const getById = async (id: string): Promise<Them | null> => {
    const record = await crudService.getById(id);
    return record ? recordToThem(record) : null;
  };

  const create = async (them: Omit<Them, 'id'>): Promise<Them | null> => {
    const record = await crudService.create(themToRecord(them));
    return record ? recordToThem(record) : null;
  };

  const update = async (id: string, them: Partial<Them>): Promise<Them | null> => {
    // Converter apenas os campos fornecidos
    const updateData: Partial<ThemWithIds> = { ...them };
    
    // Se kits for fornecido, converter para kits_ids
    if (them.kits) {
      updateData.kits_ids = them.kits.map(kit => kit.id);
      delete updateData.kits;
    }
    
    const record = await crudService.update(id, updateData);
    return record ? recordToThem(record) : null;
  };

  const remove = async (id: string): Promise<boolean> => {
    return crudService.delete(id);
  };

  // Métodos específicos para temas
  const getTrendingThems = async (): Promise<Them[]> => {
    try {
      const allThems = await getAll();
      return allThems
        .filter(them => them.vezes_alugado > 0)
        .sort((a, b) => b.vezes_alugado - a.vezes_alugado)
        .slice(0, 5);
    } catch (error) {
      console.error('Erro ao buscar temas em tendência:', error);
      return [];
    }
  };

  // Retorna a combinação do CRUD genérico com métodos específicos
  return {
    getAll,
    getById,
    create,
    update,
    delete: remove,
    getTrendingThems
  };
};
