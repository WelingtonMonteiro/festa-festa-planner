
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client } from '@/types';
import { toast } from 'sonner';
import { useClientService } from '@/services/entityServices/clientService';

interface ClientsContextType {
  clients: Client[];
  addClients: (cliente: Omit<Client, 'id' | 'historico'>) => void;
  updateClients: (id: string, cliente: Partial<Client>) => void;
  removeClients: (id: string) => void;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider: React.FC<{ 
  children: React.ReactNode,
  events: Event[]
}> = ({ children, events }) => {
  const [clientes, setClientes] = useState<Client[]>([]);
  const clientService = useClientService();
  
  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await clientService.getAll();
        setClientes(response.data);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        toast.error('Erro ao carregar clientes');
      }
    };
    
    loadClients();
  }, []);
  
  const adicionarCliente = async (cliente: Omit<Client, 'id' | 'historico'>) => {
    try {
      const novoCliente = await clientService.create({
        ...cliente,
        historico: [],
        ativo: cliente.ativo !== false
      });
      
      if (novoCliente) {
        setClientes(prev => [...prev, novoCliente]);
        toast.success(`${cliente.nome} foi adicionado com sucesso.`);
      }
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      toast.error('Erro ao adicionar cliente');
    }
  };
  
  const atualizarCliente = async (id: string, clienteAtualizado: Partial<Client>) => {
    try {
      const updated = await clientService.update(id, clienteAtualizado);
      if (updated) {
        setClientes(prev => prev.map(c => c.id === id ? updated : c));
        toast.success("As informações do cliente foram atualizadas.");
      }
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast.error('Erro ao atualizar cliente');
    }
  };
  
  const excluirCliente = async (id: string) => {
    const clienteComEventos = events.some(e => e.cliente.id === id);
    if (clienteComEventos) {
      toast.error("Este cliente possui eventos registrados e não pode ser excluído.");
      return;
    }
    
    try {
      const cliente = clientes.find(c => c.id === id);
      if (cliente) {
        await clientService.update(id, { ativo: false });
        setClientes(prev => prev.map(c => c.id === id ? { ...c, ativo: false } : c));
        toast.success(`${cliente.nome} foi marcado como inativo com sucesso.`);
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast.error('Erro ao excluir cliente');
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
