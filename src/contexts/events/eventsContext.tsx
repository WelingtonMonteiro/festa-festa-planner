
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, Kit, Them, Client } from '../../types';
import { eventosMock, gerarEstatisticas } from '../../data/mockData';
import { toast } from 'sonner';

interface EventsContextType {
  events: Event[];
  
  addEvent: (evento: Omit<Event, 'id'>) => Event;
  updateEvent: (id: string, evento: Partial<Event>) => void;
  removeEvent: (id: string) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider: React.FC<{ 
  children: React.ReactNode,
  onEventChange?: (events: Event[]) => void,
  onUpdateKitUsage?: (kitId: string) => void,
  onUpdateThemeUsage?: (themeId: string) => void,
  onUpdateClientHistory?: (clientId: string, events: Event[]) => void,
}> = ({ 
  children, 
  onEventChange,
  onUpdateKitUsage,
  onUpdateThemeUsage,
  onUpdateClientHistory
}) => {
  const [eventos, setEventos] = useState<Event[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Inicialização
  useEffect(() => {
    const loadData = () => {
      const loadedEventos = localStorage.getItem('events');
      setEventos(loadedEventos ? JSON.parse(loadedEventos) : eventosMock);
      setIsInitialized(true);
    };
    
    loadData();
  }, []);
  
  // Persistência
  useEffect(() => {
    if (!isInitialized) return;
    
    if (eventos.length) {
      const prepareForStorage = (data: any) => {
        if (Array.isArray(data)) {
          return data.map(item => prepareForStorage(item));
        } else if (data && typeof data === 'object') {
          const result = { ...data };
          
          if (result.cliente && result.cliente.historico) {
            result.clienteId = result.cliente.id;
            delete result.cliente;
          }
          
          if (result.historico && Array.isArray(result.historico)) {
            result.historicoIds = result.historico.map((e: Event) => e.id);
            delete result.historico;
          }
          
          return result;
        }
        return data;
      };

      const eventosForStorage = prepareForStorage(eventos);
      localStorage.setItem('events', JSON.stringify(eventosForStorage));
      
      if (onEventChange) {
        onEventChange(eventos);
      }
    }
  }, [eventos, isInitialized, onEventChange]);
  
  const adicionarEvento = (evento: Omit<Event, 'id'>) => {
    const novoEvento: Event = {
      ...evento,
      id: `e${Date.now().toString()}`
    };
    
    if (novoEvento.kit && onUpdateKitUsage) {
      onUpdateKitUsage(novoEvento.kit.id);
    }
    
    if (novoEvento.tema && onUpdateThemeUsage) {
      onUpdateThemeUsage(novoEvento.tema.id);
    }
    
    if (novoEvento.cliente && onUpdateClientHistory) {
      const clienteId = novoEvento.cliente.id;
      
      // Criar uma cópia para evitar referência circular
      const eventoSemCliente = {...novoEvento};
      delete (eventoSemCliente as any).cliente;
      
      onUpdateClientHistory(clienteId, [novoEvento]);
    }
    
    setEventos([...eventos, novoEvento]);
    toast.success("Evento adicionado com sucesso.");
    
    return novoEvento;
  };
  
  const atualizarEvento = (id: string, eventoAtualizado: Partial<Event>) => {
    setEventos(eventos.map(e => 
      e.id === id ? { ...e, ...eventoAtualizado } : e
    ));
    
    const evento = eventos.find(e => e.id === id);
    if (evento && eventoAtualizado && onUpdateClientHistory) {
      const clienteId = evento.cliente.id;
      const atualizados = eventos.map(e => 
        e.id === id ? { ...e, ...eventoAtualizado } : e
      ).filter(e => e.cliente.id === clienteId);
      
      onUpdateClientHistory(clienteId, atualizados);
    }
    
    toast.success("As informações do evento foram atualizadas.");
  };
  
  const excluirEvento = (id: string) => {
    const eventoRemovido = eventos.find(e => e.id === id);
    
    if (eventoRemovido && onUpdateClientHistory) {
      const clienteId = eventoRemovido.cliente.id;
      const restantes = eventos
        .filter(e => e.id !== id)
        .filter(e => e.cliente.id === clienteId);
      
      onUpdateClientHistory(clienteId, restantes);
    }
    
    setEventos(eventos.filter(e => e.id !== id));
    toast.success("O evento foi removido com sucesso.");
  };
  
  return (
    <EventsContext.Provider value={{
      events: eventos,
      addEvent: adicionarEvento,
      updateEvent: atualizarEvento,
      removeEvent: excluirEvento
    }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEventsContext = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEventsContext must be used within a EventsProvider');
  }
  return context;
};
