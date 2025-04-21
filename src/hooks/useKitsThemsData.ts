
import { useState } from 'react';
import { Kit, Them } from '@/types';
import { useStorage } from '@/contexts/storageContext';
import { useApi } from '@/contexts/apiContext';
import { unifiedKitService, DataSource } from '@/services/unifiedKitService';
import { unifiedThemService } from '@/services/unifiedThemService';
import { useHandleContext } from '@/contexts/handleContext';
import { toast } from 'sonner';

export const useKitsThemsData = () => {
  const { addKit, addThems, updateKit, updateThems, removeKit, removeThems } = useHandleContext();
  const { storageType } = useStorage();
  const { apiType, apiUrl } = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [localKits, setLocalKits] = useState<Kit[]>([]);
  const [localThems, setLocalThems] = useState<Them[]>([]);

  const getCurrentDataSource = (): DataSource => {
    if (apiType === 'rest' && apiUrl) {
      return 'apiRest';
    } else if (storageType === 'supabase') {
      return 'supabase';
    }
    return 'localStorage';
  };

  const dataSource = getCurrentDataSource();

  const loadData = async (page = 1, limit = 10) => {
    setIsLoading(true);
    try {
      const kitResponse = await unifiedKitService.getAll(dataSource, apiUrl, page, limit);
      
      if ('data' in kitResponse) {
        setLocalKits(kitResponse.data);
        return {
          kits: kitResponse.data,
          total: kitResponse.total,
          page: kitResponse.page,
          limit: kitResponse.limit
        };
      } else {
        setLocalKits(kitResponse);
        return {
          kits: kitResponse,
          total: kitResponse.length,
          page: 1,
          limit
        };
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Falha ao carregar kits e temas');
      return {
        kits: [],
        total: 0,
        page: 1,
        limit
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleKitSubmit = async (kitData: Omit<Kit, 'id' | 'vezes_alugado'>) => {
    setIsLoading(true);
    try {
      if (kitData) {
        const result = await unifiedKitService.create(kitData, dataSource, apiUrl);
        if (result) {
          addKit(result);
          toast.success(`Kit adicionado com sucesso via ${dataSource}`);
        }
        return result;
      }
    } catch (error) {
      console.error('Error saving kit:', error);
      toast.error('Falha ao salvar kit');
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const handleThemSubmit = async (themData: Omit<Them, 'id' | 'vezes_alugado'>) => {
    setIsLoading(true);
    try {
      if (themData) {
        const result = await unifiedThemService.create(themData, dataSource, localKits, apiUrl);
        if (result) {
          addThems(result);
          toast.success(`Tema adicionado com sucesso via ${dataSource}`);
        }
        return result;
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('Falha ao salvar tema');
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const handleKitUpdate = async (id: string, kitData: Partial<Kit>) => {
    setIsLoading(true);
    try {
      const result = await unifiedKitService.update(id, kitData, dataSource, apiUrl);
      if (result) {
        updateKit(id, kitData);
        toast.success(`Kit atualizado com sucesso via ${dataSource}`);
      }
      return result;
    } catch (error) {
      console.error('Error updating kit:', error);
      toast.error('Falha ao atualizar kit');
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const handleThemUpdate = async (id: string, themData: Partial<Them>) => {
    setIsLoading(true);
    try {
      const result = await unifiedThemService.update(id, themData, dataSource, localKits, apiUrl);
      if (result) {
        updateThems(id, themData);
        toast.success(`Tema atualizado com sucesso via ${dataSource}`);
      }
      return result;
    } catch (error) {
      console.error('Error updating theme:', error);
      toast.error('Falha ao atualizar tema');
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const handleKitDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await unifiedKitService.delete(id, dataSource, apiUrl);
      if (success) {
        removeKit(id);
        toast.success(`Kit excluído com sucesso via ${dataSource}`);
      }
      return success;
    } catch (error) {
      console.error('Error deleting kit:', error);
      toast.error('Falha ao excluir kit');
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const handleThemDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await unifiedThemService.delete(id, dataSource, apiUrl);
      if (success) {
        removeThems(id);
        toast.success(`Tema excluído com sucesso via ${dataSource}`);
      }
      return success;
    } catch (error) {
      console.error('Error deleting theme:', error);
      toast.error('Falha ao excluir tema');
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  return {
    isLoading,
    localKits,
    localThems,
    setLocalThems,
    loadData,
    handleKitSubmit,
    handleThemSubmit,
    handleKitUpdate,
    handleThemUpdate,
    handleKitDelete,
    handleThemDelete
  };
};
