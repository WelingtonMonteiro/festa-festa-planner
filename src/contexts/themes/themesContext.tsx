
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Them, Kit, Event } from '../../types';
import { temasMock } from '../../data/mockData';
import { toast } from 'sonner';
import { themService } from '@/services/themService';

interface ThemesContextType {
  thems: Them[];
  
  addThems: (tema: Omit<Them, 'id' | 'vezes_alugado'>) => Promise<Them | null>;
  updateThems: (id: string, tema: Partial<Them>) => Promise<Them | null>;
  removeThems: (id: string) => Promise<boolean>;
}

const ThemesContext = createContext<ThemesContextType | undefined>(undefined);

export const ThemesProvider: React.FC<{ 
  children: React.ReactNode,
  events: Event[],
  kits: Kit[],
  storageType: string 
}> = ({ children, events, kits, storageType }) => {
  const [temas, setTemas] = useState<Them[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Inicialização
  useEffect(() => {
    const loadData = async () => {
      if (storageType === 'localStorage') {
        const loadedTemas = localStorage.getItem('temas');
        setTemas(loadedTemas ? JSON.parse(loadedTemas) : temasMock);
      } else {
        try {
          const supabaseThems = await themService.getAll(kits);
          setTemas(supabaseThems.length > 0 ? supabaseThems : temasMock);
        } catch (error) {
          console.error('Failed to load themes from Supabase:', error);
          toast.error("Erro ao carregar dados: Falha ao carregar temas do Supabase");
          
          const loadedTemas = localStorage.getItem('temas');
          setTemas(loadedTemas ? JSON.parse(loadedTemas) : temasMock);
        }
      }
      setIsInitialized(true);
    };
    
    loadData();
  }, [storageType, kits]);
  
  // Persistência
  useEffect(() => {
    if (!isInitialized) return;
    
    if (storageType === 'localStorage' && temas.length) {
      localStorage.setItem('temas', JSON.stringify(temas));
    }
  }, [temas, storageType, isInitialized]);
  
  const adicionarTema = async (tema: Omit<Them, 'id' | 'vezes_alugado'>) => {
    if (storageType === 'localStorage') {
      const novoTema: Them = {
        ...tema,
        id: `t${Date.now().toString()}`,
        vezes_alugado: 0
      };
      setTemas([...temas, novoTema]);
      toast.success(`Tema ${tema.nome} foi adicionado com sucesso.`);
      return novoTema;
    } else {
      try {
        const novoTema = await themService.create(tema, kits);
        if (novoTema) {
          setTemas([...temas, novoTema]);
          toast.success(`Tema ${tema.nome} foi adicionado com sucesso.`);
          return novoTema;
        }
        return null;
      } catch (error) {
        console.error('Failed to add theme to Supabase:', error);
        toast.error("Falha ao adicionar tema no Supabase.");
        return null;
      }
    }
  };
  
  const atualizarTema = async (id: string, temaAtualizado: Partial<Them>) => {
    if (storageType === 'localStorage') {
      setTemas(temas.map(t => 
        t.id === id ? { ...t, ...temaAtualizado } : t
      ));
      toast.success("As informações do tema foram atualizadas.");
      return temas.find(t => t.id === id) || null;
    } else {
      try {
        const updatedThem = await themService.update(id, temaAtualizado, kits);
        if (updatedThem) {
          setTemas(temas.map(t => t.id === id ? updatedThem : t));
          toast.success("As informações do tema foram atualizadas.");
          return updatedThem;
        }
        return null;
      } catch (error) {
        console.error('Failed to update theme in Supabase:', error);
        toast.error("Falha ao atualizar tema no Supabase.");
        return null;
      }
    }
  };
  
  const excluirTema = async (id: string) => {
    const temaEmUso = events.some(e => e.tema?.id === id);
    if (temaEmUso) {
      toast.error("Este tema está associado a eventos e não pode ser excluído.");
      return false;
    }
    
    const temaRemovido = temas.find(t => t.id === id);
    
    if (storageType === 'localStorage') {
      setTemas(temas.filter(t => t.id !== id));
      
      if (temaRemovido) {
        toast.success(`Tema ${temaRemovido.nome} foi removido com sucesso.`);
      }
      return true;
    } else {
      try {
        const result = await themService.delete(id);
        if (result) {
          setTemas(temas.filter(t => t.id !== id));
          
          if (temaRemovido) {
            toast.success(`Tema ${temaRemovido.nome} foi removido com sucesso.`);
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('Failed to delete theme from Supabase:', error);
        toast.error("Falha ao remover tema do Supabase.");
        return false;
      }
    }
  };
  
  return (
    <ThemesContext.Provider value={{
      thems: temas,
      addThems: adicionarTema,
      updateThems: atualizarTema,
      removeThems: excluirTema
    }}>
      {children}
    </ThemesContext.Provider>
  );
};

export const useThemesContext = () => {
  const context = useContext(ThemesContext);
  if (context === undefined) {
    throw new Error('useThemesContext must be used within a ThemesProvider');
  }
  return context;
};
