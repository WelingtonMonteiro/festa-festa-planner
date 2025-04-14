
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Kit, Event } from '../../types';
import { kitsMock } from '../../data/mockData';
import { toast } from 'sonner';
import { kitService } from '@/services/kitService';

interface KitsContextType {
  kits: Kit[];
  
  addKit: (kit: Omit<Kit, 'id' | 'vezes_alugado'>) => Promise<Kit | null>;
  updateKit: (id: string, kit: Partial<Kit>) => Promise<Kit | null>;
  removeKit: (id: string) => Promise<boolean>;
}

const KitsContext = createContext<KitsContextType | undefined>(undefined);

export const KitsProvider: React.FC<{ 
  children: React.ReactNode, 
  events: Event[],
  storageType: string 
}> = ({ children, events, storageType }) => {
  const [kits, setKits] = useState<Kit[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Inicialização
  useEffect(() => {
    const loadData = async () => {
      if (storageType === 'localStorage') {
        const loadedKits = localStorage.getItem('kits');
        setKits(loadedKits ? JSON.parse(loadedKits) : kitsMock);
      } else {
        try {
          const supabaseKits = await kitService.getAll();
          setKits(supabaseKits.length > 0 ? supabaseKits : kitsMock);
        } catch (error) {
          console.error('Failed to load data from Supabase:', error);
          toast.error("Erro ao carregar dados: Falha ao carregar dados do Supabase");
          
          const loadedKits = localStorage.getItem('kits');
          setKits(loadedKits ? JSON.parse(loadedKits) : kitsMock);
        }
      }
      setIsInitialized(true);
    };
    
    loadData();
  }, [storageType]);
  
  // Persistência
  useEffect(() => {
    if (!isInitialized) return;
    
    if (storageType === 'localStorage' && kits.length) {
      localStorage.setItem('kits', JSON.stringify(kits));
    }
  }, [kits, storageType, isInitialized]);
  
  const adicionarKit = async (kit: Omit<Kit, 'id' | 'vezes_alugado'>) => {
    if (storageType === 'localStorage') {
      const novoKit: Kit = {
        ...kit,
        id: `k${Date.now().toString()}`,
        vezes_alugado: 0
      };
      setKits([...kits, novoKit]);
      toast.success(`Kit ${kit.nome} foi adicionado com sucesso.`);
      return novoKit;
    } else {
      try {
        const novoKit = await kitService.create(kit);
        if (novoKit) {
          setKits([...kits, novoKit]);
          toast.success(`Kit ${kit.nome} foi adicionado com sucesso.`);
          return novoKit;
        }
        return null;
      } catch (error) {
        console.error('Failed to add kit to Supabase:', error);
        toast.error("Falha ao adicionar kit no Supabase.");
        return null;
      }
    }
  };
  
  const atualizarKit = async (id: string, kitAtualizado: Partial<Kit>) => {
    if (storageType === 'localStorage') {
      setKits(kits.map(k => 
        k.id === id ? { ...k, ...kitAtualizado } : k
      ));
      toast.success("As informações do kit foram atualizadas.");
      return kits.find(k => k.id === id) || null;
    } else {
      try {
        const updatedKit = await kitService.update(id, kitAtualizado);
        if (updatedKit) {
          setKits(kits.map(k => k.id === id ? updatedKit : k));
          toast.success("As informações do kit foram atualizadas.");
          return updatedKit;
        }
        return null;
      } catch (error) {
        console.error('Failed to update kit in Supabase:', error);
        toast.error("Falha ao atualizar kit no Supabase.");
        return null;
      }
    }
  };
  
  const excluirKit = async (id: string) => {
    const kitEmUso = events.some(e => e.kit.id === id);
    if (kitEmUso) {
      toast.error("Este kit está associado a eventos e não pode ser excluído.");
      return false;
    }
    
    const kitRemovido = kits.find(k => k.id === id);
    
    if (storageType === 'localStorage') {
      setKits(kits.filter(k => k.id !== id));
      
      if (kitRemovido) {
        toast.success(`Kit ${kitRemovido.nome} foi removido com sucesso.`);
      }
      return true;
    } else {
      try {
        const result = await kitService.delete(id);
        if (result) {
          setKits(kits.filter(k => k.id !== id));
          
          if (kitRemovido) {
            toast.success(`Kit ${kitRemovido.nome} foi removido com sucesso.`);
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('Failed to delete kit from Supabase:', error);
        toast.error("Falha ao remover kit do Supabase.");
        return false;
      }
    }
  };
  
  return (
    <KitsContext.Provider value={{
      kits,
      addKit: adicionarKit,
      updateKit: atualizarKit,
      removeKit: excluirKit
    }}>
      {children}
    </KitsContext.Provider>
  );
};

export const useKitsContext = () => {
  const context = useContext(KitsContext);
  if (context === undefined) {
    throw new Error('useKitsContext must be used within a KitsProvider');
  }
  return context;
};
