
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../../types';
import { toast } from 'sonner';

interface SettingsContextType {
  users: User;
  apiUrl: string;
  setApiUrl: (url: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiUrl, setApiUrlState] = useState<string>('');
  const [usuario, setUsuario] = useState<User>({
    nome: "Administrador",
    email: "admin@festadecoracoes.com",
    telefone: "(11) 98765-4321"
  });
  
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
    };
    
    loadData();
  }, []);
  
  // Persistência
  useEffect(() => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('apiUrl', apiUrl);
  }, [usuario, apiUrl]);
  
  const setApiUrl = (url: string) => {
    setApiUrlState(url);
    toast.success("URL da API configurada com sucesso.");
  };
  
  return (
    <SettingsContext.Provider value={{
      users: usuario,
      apiUrl,
      setApiUrl
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
