
import { createContext, useContext } from 'react';
import { Client, Event, Message, Contract, ContractTemplate, Kit, Them } from '@/types';

interface HandleContextType {
  // Data collections
  clients: Client[];
  events: Event[];
  messages: Message[];
  contracts: Contract[];
  contractTemplates: ContractTemplate[];
  kits: Kit[];
  themes: Them[];
  
  // Client methods
  addClients: (client: Omit<Client, 'id'>) => void;
  updateClients: (id: string, clientData: Partial<Client>) => void;
  removeClients: (id: string) => void;
  
  // Event methods
  addEvent?: (event: Omit<Event, 'id'>) => void;
  updateEvent?: (id: string, eventData: Partial<Event>) => void;
  removeEvent?: (id: string) => void;
  
  // Message methods
  addMessage?: (message: Omit<Message, 'id'>) => void;
  markMessageAsRead?: (id: string) => void;
  
  // Contract methods
  signContract: (contractId: string, signatureUrl: string) => void;
  sendContractToClient: (contractId: string, clientId: string) => void;
  
  // Contract template methods
  addContractTemplate: (template: Omit<ContractTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContractTemplate: (id: string, templateData: Partial<ContractTemplate>) => void;
  removeContractTemplate: (id: string) => void;
  
  // Kit methods
  addKit?: (kit: Omit<Kit, 'id'>) => void;
  updateKit?: (id: string, kitData: Partial<Kit>) => void;
  removeKit?: (id: string) => void;
  
  // Theme methods
  addThems?: (theme: Omit<Them, 'id'>) => void;
  updateThems?: (id: string, themeData: Partial<Them>) => void;
  removeThems?: (id: string) => void;
  
  // Contract methods
  addContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContract: (id: string, contract: Partial<Contract>) => void;
  removeContract: (id: string) => void;
  
  // Additional properties for backward compatibility
  thems?: Them[];
  statistics?: {
    eventosPorMes: Record<string, number>;
    kitsPopulares: Array<{kit: string, quantidade: number}>;
    temasPorMes: Record<string, Record<string, number>>;
    temasPorAno: Record<string, number>;
    faturamentoMensal: Record<string, number>;
  };
  users?: any[];
}

export const HandleContext = createContext<HandleContextType | undefined>(undefined);

export const useHandleContext = () => {
  const context = useContext(HandleContext);
  if (context === undefined) {
    throw new Error('useHandleContext must be used within a HandleProvider');
  }
  return context;
};
