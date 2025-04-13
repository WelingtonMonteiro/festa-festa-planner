
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
  isRestApi: boolean;  // Nova propriedade para facilitar verificação
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiType, setApiTypeState] = useState<ApiType>('local');
  const [apiUrl, setApiUrlState] = useState<string>('');
  const [isApiInitialized, setIsApiInitialized] = useState(false);

  // Verificar configurações salvas
  useEffect(() => {
    const savedApiType = localStorage.getItem('adminApiPreference');
    const savedApiUrl = localStorage.getItem('adminApiUrl');
    
    if (savedApiType === 'local' || savedApiType === 'rest') {
      setApiTypeState(savedApiType);
    }
    
    if (savedApiUrl) {
      setApiUrlState(savedApiUrl);
    }
    
    setIsApiInitialized(true);
  }, []);

  const setApiType = (type: ApiType) => {
    setApiTypeState(type);
    localStorage.setItem('adminApiPreference', type);
    
    // Não mostramos toast aqui pois isso é controlado pela página de configurações
  };

  const setApiUrl = (url: string) => {
    setApiUrlState(url);
    localStorage.setItem('adminApiUrl', url);
    // Não mostramos toast aqui pois isso é controlado pela página de configurações
  };

  // Computed property para verificar se estamos usando REST API
  const isRestApi = apiType === 'rest';

  return (
    <ApiContext.Provider value={{
      apiType,
      setApiType,
      apiUrl,
      setApiUrl,
      isApiInitialized,
      isRestApi
    }}>
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
