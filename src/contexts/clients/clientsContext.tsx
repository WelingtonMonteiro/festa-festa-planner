
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Event } from '../../types';
import { clientesMock } from '../../data/mockData';
import { toast } from 'sonner';

interface ClientsContextType {
  clients: Client[];
  
  addClients: (cliente: Omit<Client, 'id' | 'historico'>) => void;
  updateClients: (id: string, cliente: Partial<Client>) => void;
  removeClients: (id: string) => void;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider: React.FC<{ 
  children: React.ReactNode,
  events: Event[],
  onEventsChange?: (eventosAtualizados: Event[]) => void 
}> = ({ children, events, onEventsChange }) => {
  const [clientes, setClientes] = useState<Client[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Inicialização
  useEffect(() => {
    const loadData = () => {
      const loadedClientes = localStorage.getItem('clients');
      
      const clientesWithActiveStatus = loadedClientes 
        ? JSON.parse(loadedClientes) 
        : clientesMock.map(c => ({ ...c, ativo: true }));
      
      setClientes(clientesWithActiveStatus);
      setIsInitialized(true);
    };
    
    loadData();
  }, []);
  
  // Persistência
  useEffect(() => {
    if (!isInitialized) return;
    
    if (clientes.length) {
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

      const clientesForStorage = prepareForStorage(clientes);
      localStorage.setItem('clients', JSON.stringify(clientesForStorage));
    }
  }, [clientes, isInitialized]);
  
  const adicionarCliente = (cliente: Omit<Client, 'id' | 'historico'>) => {
    const novoCliente: Client = {
      ...cliente,
      id: `c${Date.now().toString()}`,
      historico: [],
      ativo: cliente.ativo !== false
    };
    setClientes([...clientes, novoCliente]);
    toast.success(`${cliente.nome} foi adicionado com sucesso.`);
  };
  
  const atualizarCliente = (id: string, clienteAtualizado: Partial<Client>) => {
    setClientes(clientes.map(c => 
      c.id === id ? { ...c, ...clienteAtualizado } : c
    ));
    toast.success("As informações do cliente foram atualizadas.");
  };
  
  const excluirCliente = (id: string) => {
    const clienteComEventos = events.some(e => e.cliente.id === id);
    if (clienteComEventos) {
      toast.error("Este cliente possui eventos registrados e não pode ser excluído.");
      return;
    }
    
    const cliente = clientes.find(c => c.id === id);
    if (cliente) {
      atualizarCliente(id, { ativo: false });
      toast.success(`${cliente.nome} foi marcado como inativo com sucesso.`);
    }
  };
  
  return (
    <ClientsContext.Provider value={{
      clients: clientes,
      addClients: adicionarCliente,
      updateClients: atualizarCliente,
      removeClients: excluirCliente
    }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClientsContext = () => {
  const context = useContext(ClientsContext);
  if (context === undefined) {
    throw new Error('useClientsContext must be used within a ClientsProvider');
  }
  return context;
};
