import React, { useState, useEffect } from 'react';
import { HandleContext } from './handleContext';
import { Client, Event, Message, Contract, ContractTemplate, Kit, Them } from '@/types';
import { useApi } from './apiContext';
import { toast } from 'sonner';
import { kitRestService } from '@/services/api/kitRestService';

export const HandleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { apiType, apiUrl, isRestApi, isLocalStorage } = useApi();
  
  // State for different entities
  const [clients, setClients] = useState<Client[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractTemplates, setContractTemplates] = useState<ContractTemplate[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);
  const [themes, setThemes] = useState<Them[]>([]);

  // Load data on initialization
  useEffect(() => {
    if (isLocalStorage) {
      loadFromLocalStorage();
    } else if (isRestApi) {
      loadFromRestApi();
    }
  }, [isLocalStorage, isRestApi, apiUrl]);

  const loadFromLocalStorage = () => {
    // Load all data from localStorage
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
    
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
    
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    
    const savedContracts = localStorage.getItem('contracts');
    if (savedContracts) {
      setContracts(JSON.parse(savedContracts));
    }
    
    const savedContractTemplates = localStorage.getItem('contractTemplates');
    if (savedContractTemplates) {
      setContractTemplates(JSON.parse(savedContractTemplates));
    }
    
    const savedKits = localStorage.getItem('kits');
    if (savedKits) {
      setKits(JSON.parse(savedKits));
    }
    
    const savedThemes = localStorage.getItem('themes');
    if (savedThemes) {
      setThemes(JSON.parse(savedThemes));
    }
  };

  const loadFromRestApi = async () => {
    // Example loading kits from REST API
    if (apiUrl) {
      try {
        const kitsData = await kitRestService.getAll(apiUrl);
        setKits(kitsData);
      } catch (error) {
        console.error('Failed to load kits from REST API:', error);
      }
      
      // Add other entity loading as needed
    }
  };

  // Client methods
  const addClients = (client: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      historico: [],
    };

    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    
    if (isLocalStorage) {
      localStorage.setItem('clients', JSON.stringify(updatedClients));
    } else if (isRestApi && apiUrl) {
      // Implement REST API call
      // Example: clientRestService.create(newClient, apiUrl);
    }
  };

  const updateClients = (id: string, clientData: Partial<Client>) => {
    const updatedClients = clients.map(client => 
      client.id === id ? { ...client, ...clientData } : client
    );
    
    setClients(updatedClients);
    
    if (isLocalStorage) {
      localStorage.setItem('clients', JSON.stringify(updatedClients));
    } else if (isRestApi && apiUrl) {
      // Implement REST API call
      // Example: clientRestService.update(id, clientData, apiUrl);
    }
  };

  const removeClients = (id: string) => {
    const updatedClients = clients.filter(client => client.id !== id);
    setClients(updatedClients);
    
    if (isLocalStorage) {
      localStorage.setItem('clients', JSON.stringify(updatedClients));
    } else if (isRestApi && apiUrl) {
      // Implement REST API call
      // Example: clientRestService.delete(id, apiUrl);
    }
  };

  // Contract methods
  const signContract = (contractId: string, signatureUrl: string) => {
    const updatedContracts = contracts.map(contract =>
      contract.id === contractId
        ? {
            ...contract,
            status: 'signed' as const,
            signatureUrl,
            signedAt: new Date().toISOString(),
          }
        : contract
    );

    setContracts(updatedContracts);
    
    if (isLocalStorage) {
      localStorage.setItem('contracts', JSON.stringify(updatedContracts));
    } else if (isRestApi && apiUrl) {
      // Implement REST API call
    }
  };

  const sendContractToClient = (contractId: string, clientId: string) => {
    const updatedContracts = contracts.map(contract =>
      contract.id === contractId
        ? {
            ...contract,
            status: 'sent' as const,
            sentAt: new Date().toISOString(),
          }
        : contract
    );

    setContracts(updatedContracts);
    
    if (isLocalStorage) {
      localStorage.setItem('contracts', JSON.stringify(updatedContracts));
    } else if (isRestApi && apiUrl) {
      // Implement REST API call
    }
  };

  // Contract template methods
  const addContractTemplate = (template: Omit<ContractTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: ContractTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTemplates = [...contractTemplates, newTemplate];
    setContractTemplates(updatedTemplates);
    
    if (isLocalStorage) {
      localStorage.setItem('contractTemplates', JSON.stringify(updatedTemplates));
    } else if (isRestApi && apiUrl) {
      // Implement REST API call
    }
  };

  const updateContractTemplate = (id: string, templateData: Partial<ContractTemplate>) => {
    const updatedTemplates = contractTemplates.map(template => 
      template.id === id ? { ...template, ...templateData, updatedAt: new Date().toISOString() } : template
    );
    
    setContractTemplates(updatedTemplates);
    
    if (isLocalStorage) {
      localStorage.setItem('contractTemplates', JSON.stringify(updatedTemplates));
    } else if (isRestApi && apiUrl) {
      // Implement REST API call
    }
  };

  const removeContractTemplate = (id: string) => {
    const updatedTemplates = contractTemplates.filter(template => template.id !== id);
    setContractTemplates(updatedTemplates);
    
    if (isLocalStorage) {
      localStorage.setItem('contractTemplates', JSON.stringify(updatedTemplates));
    } else if (isRestApi && apiUrl) {
      // Implement REST API call
    }
  };

  // Adding the missing contract methods
  const addContract = (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newContract: Contract = {
      ...contract,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedContracts = [...contracts, newContract];
    setContracts(updatedContracts);
    
    if (isLocalStorage) {
      localStorage.setItem('contracts', JSON.stringify(updatedContracts));
    } else if (isRestApi && apiUrl) {
      // Implement REST API call
    }
    
    return newContract;
  };

  const updateContract = (id: string, contractData: Partial<Contract>) => {
    const updatedContracts = contracts.map(contract => 
      contract.id === id ? { ...contract, ...contractData, updatedAt: new Date().toISOString() } : contract
    );
    
    setContracts(updatedContracts);
    
    if (isLocalStorage) {
      localStorage.setItem('contracts', JSON.stringify(updatedContracts));
    } else if (isRestApi && apiUrl) {
      // Implement REST API call
    }
  };

  const removeContract = (id: string) => {
    const updatedContracts = contracts.filter(contract => contract.id !== id);
    setContracts(updatedContracts);
    
    if (isLocalStorage) {
      localStorage.setItem('contracts', JSON.stringify(updatedContracts));
    } else if (isRestApi && apiUrl) {
      // Implement REST API call
    }
  };

  return (
    <HandleContext.Provider
      value={{
        clients,
        events,
        messages,
        contracts,
        contractTemplates,
        kits,
        themes,
        addClients,
        updateClients,
        removeClients,
        signContract,
        sendContractToClient,
        addContractTemplate,
        updateContractTemplate,
        removeContractTemplate,
        addContract,
        updateContract,
        removeContract,
      }}
    >
      {children}
    </HandleContext.Provider>
  );
};
