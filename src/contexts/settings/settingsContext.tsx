
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../../types';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: 'whatsapp' | 'facebook' | 'instagram';
  enabled: boolean;
  apiUrl?: string;
}

interface SettingsContextType {
  users: User;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  integrations: Integration[];
  updateIntegration: (id: string, data: Partial<Integration>) => void;
  addIntegration: (integration: Omit<Integration, 'id'>) => void;
  getEnabledIntegrations: () => Integration[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiUrl, setApiUrlState] = useState<string>('');
  const [usuario, setUsuario] = useState<User>({
    nome: "Administrador",
    email: "admin@festadecoracoes.com",
    telefone: "(11) 98765-4321"
  });
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'whatsapp',
      name: 'whatsapp',
      enabled: false
    },
    {
      id: 'facebook',
      name: 'facebook',
      enabled: false
    },
    {
      id: 'instagram',
      name: 'instagram',
      enabled: false
    }
  ]);
  
  // Inicialização
  useEffect(() => {
    const loadData = () => {
      const loadedUsuario = localStorage.getItem('usuario');
      if (loadedUsuario) {
        setUsuario(JSON.parse(loadedUsuario));
      }
      
      const loadedApiUrl = localStorage.getItem('apiUrl');
      if (loadedApiUrl) {
        setApiUrlState(loadedApiUrl);
      }
      
      const loadedIntegrations = localStorage.getItem('integrations');
      if (loadedIntegrations) {
        setIntegrations(JSON.parse(loadedIntegrations));
      }
    };
    
    loadData();
  }, []);
  
  // Persistência
  useEffect(() => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('apiUrl', apiUrl);
    localStorage.setItem('integrations', JSON.stringify(integrations));
  }, [usuario, apiUrl, integrations]);
  
  const setApiUrl = (url: string) => {
    setApiUrlState(url);
    toast.success("URL da API configurada com sucesso.");
  };
  
  const updateIntegration = (id: string, data: Partial<Integration>) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, ...data } 
          : integration
      )
    );
    
    toast.success(`Integração ${id} atualizada com sucesso.`);
  };
  
  const addIntegration = (integration: Omit<Integration, 'id'>) => {
    const newIntegration = {
      ...integration,
      id: `int_${Date.now()}`
    };
    
    setIntegrations(prev => [...prev, newIntegration]);
    toast.success(`Integração ${integration.name} adicionada com sucesso.`);
  };
  
  const getEnabledIntegrations = () => {
    return integrations.filter(integration => integration.enabled);
  };
  
  return (
    <SettingsContext.Provider value={{
      users: usuario,
      apiUrl,
      setApiUrl,
      integrations,
      updateIntegration,
      addIntegration,
      getEnabledIntegrations
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};
