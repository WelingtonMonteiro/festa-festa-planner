
import { useState, useCallback } from 'react';
import { CrudOperations, StorageAdapterConfig } from '@/types/crud';
import { createCrudService } from '@/services/CrudService';
import { useStorageAdapterFactory } from '@/services/StorageAdapterFactory';

// Hook para facilitar o uso do CRUD genérico em componentes
export function useCrud<T extends Record<string, any>>(
  config: StorageAdapterConfig,
  defaultData: T[] = []
) {
  const factory = useStorageAdapterFactory();
  const crudService = createCrudService<T>(factory, config);

  const [data, setData] = useState<T[]>(defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await crudService.getAll();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar dados'));
      return [];
    } finally {
      setLoading(false);
    }
  }, [crudService]);

  const getById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await crudService.getById(id);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Erro ao buscar item com id ${id}`));
      return null;
    } finally {
      setLoading(false);
    }
  }, [crudService]);

  const create = useCallback(async (item: Omit<T, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await crudService.create(item);
      if (result) {
        setData(prev => [...prev, result]);
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar item'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [crudService]);

  const update = useCallback(async (id: string, item: Partial<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await crudService.update(id, item);
      if (result) {
        setData(prev => prev.map(i => (i.id === id ? result : i)));
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Erro ao atualizar item com id ${id}`));
      return null;
    } finally {
      setLoading(false);
    }
  }, [crudService]);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await crudService.delete(id);
      if (result) {
        setData(prev => prev.filter(i => i.id !== id));
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Erro ao remover item com id ${id}`));
      return false;
    } finally {
      setLoading(false);
    }
  }, [crudService]);

  // Função para recarregar os dados
  const refresh = useCallback(() => {
    return fetchAll();
  }, [fetchAll]);

  return {
    data,
    loading,
    error,
    refresh,
    getById,
    create,
    update,
    remove,
    currentStorageType: factory.getCurrentStorageType()
  };
}
