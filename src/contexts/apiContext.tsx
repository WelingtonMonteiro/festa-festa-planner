
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Tipos de acesso à API suportados
export type ApiType = 'local' | 'rest';

interface ApiContextType {
  apiType: ApiType;
  setApiType: (type: ApiType) => void;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  isApiInitialized: boolean;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiType, setApiTypeState] = useState<ApiType>('local');
  const [apiUrl, setApiUrlState] = useState<string>('');
  const [isApiInitialized, setIsApiInitialized] = useState(false);

  // Verificar configurações salvas
  useEffect(() => {
    const loadSettings = () => {
      const savedApiType = localStorage.getItem('adminApiPreference');
      const savedApiUrl = localStorage.getItem('adminApiUrl');
      
      console.log("API Context initializing with saved preferences:", { savedApiType, savedApiUrl });
      
      if (savedApiType === 'local' || savedApiType === 'rest') {
        setApiTypeState(savedApiType);
      }
      
      if (savedApiUrl) {
        setApiUrlState(savedApiUrl);
      }
      
      setIsApiInitialized(true);
    };
    
    loadSettings();
  }, []);

  const setApiType = (type: ApiType) => {
    console.log("Setting API type to:", type);
    setApiTypeState(type);
    localStorage.setItem('adminApiPreference', type);
    // Não mostramos toast aqui pois isso é controlado pela página de configurações
  };

  const setApiUrl = (url: string) => {
    console.log("Setting API URL to:", url);
    setApiUrlState(url);
    localStorage.setItem('adminApiUrl', url);
    // Não mostramos toast aqui pois isso é controlado pela página de configurações
  };

  const value = {
    apiType,
    setApiType,
    apiUrl,
    setApiUrl,
    isApiInitialized
  };

  console.log("API Context value:", value);

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
