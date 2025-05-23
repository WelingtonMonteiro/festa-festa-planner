
import React, { createContext, useContext, useState, useEffect } from 'react';
import { databaseService } from '@/services/databaseService';
import { toast } from 'sonner';

type StorageType = 'localStorage' | 'supabase';

interface StorageContextType {
  storageType: StorageType;
  setStorageType: (type: StorageType) => void;
  isInitialized: boolean;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storageType, setStorageTypeState] = useState<StorageType>('localStorage');
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if the user has a preference
  useEffect(() => {
    // Primeiro verifica na configuração do administrador
    const adminStoragePreference = localStorage.getItem('adminStoragePreference');
    
    if (adminStoragePreference === 'supabase' || adminStoragePreference === 'localStorage') {
      setStorageTypeState(adminStoragePreference as StorageType);
    } else {
      // Se não existe preferência de administrador, usa a preferência do usuário
      const savedStorageType = localStorage.getItem('preferredStorage');
      if (savedStorageType === 'supabase' || savedStorageType === 'localStorage') {
        setStorageTypeState(savedStorageType as StorageType);
      }
    }
    setIsInitialized(true);
  }, []);

  const setStorageType = async (type: StorageType) => {
    if (type === 'supabase') {
      // Set up Supabase database if needed
      try {
        await databaseService.setupDatabase();
        
        // Offer to migrate data if switching from localStorage to Supabase
        if (storageType === 'localStorage') {
          const confirmed = window.confirm(
            'Deseja migrar os dados do localStorage para o Supabase?'
          );
          
          if (confirmed) {
            const success = await databaseService.migrateLocalStorageToSupabase();
            if (success) {
              toast.success('Dados migrados com sucesso para o Supabase');
            } else {
              toast.error('Falha ao migrar dados para o Supabase');
            }
          }
        }
        
        setStorageTypeState(type);
        localStorage.setItem('preferredStorage', type);
        toast.success(`Usando Supabase para dados`);
      } catch (error) {
        console.error('Failed to set up Supabase:', error);
        toast.error('Falha ao configurar o Supabase. Usando localStorage.');
        setStorageTypeState('localStorage');
        localStorage.setItem('preferredStorage', 'localStorage');
        return;
      }
    } else {
      setStorageTypeState(type);
      localStorage.setItem('preferredStorage', type);
      toast.success(`Usando Armazenamento local para dados`);
    }
  };

  return (
    <StorageContext.Provider value={{ 
      storageType, 
      setStorageType,
      isInitialized
    }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};
