
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
  
  // Contract methods
  signContract: (contractId: string, signatureUrl: string) => void;
  sendContractToClient: (contractId: string, clientId: string) => void;
  
  // Contract template methods
  addContractTemplate: (template: Omit<ContractTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContractTemplate: (id: string, templateData: Partial<ContractTemplate>) => void;
  removeContractTemplate: (id: string) => void;
  
  // Contract methods
  addContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContract: (id: string, contract: Partial<Contract>) => void;
  removeContract: (id: string) => void;
}

export const HandleContext = createContext<HandleContextType | undefined>(undefined);

export const useHandleContext = () => {
  const context = useContext(HandleContext);
  if (context === undefined) {
    throw new Error('useHandleContext must be used within a HandleProvider');
  }
  return context;
};
