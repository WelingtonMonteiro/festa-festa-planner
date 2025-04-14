
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message } from '../../types';
import { mensagensMock } from '../../data/mockData';
import { toast } from 'sonner';

interface MessagesContextType {
  messages: Message[];
  
  addMessage: (mensagem: Omit<Message, 'id' | 'datahora'>) => void;
  markMessageAsRead: (id: string) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Inicialização
  useEffect(() => {
    const loadData = () => {
      const loadedMensagens = localStorage.getItem('mensagens');
      setMensagens(loadedMensagens ? JSON.parse(loadedMensagens) : mensagensMock);
      setIsInitialized(true);
    };
    
    loadData();
  }, []);
  
  // Persistência
  useEffect(() => {
    if (!isInitialized) return;
    
    if (mensagens.length) {
      localStorage.setItem('mensagens', JSON.stringify(mensagens));
    }
  }, [mensagens, isInitialized]);
  
  const adicionarMensagem = (mensagem: Omit<Message, 'id' | 'datahora'>) => {
    const novaMensagem: Message = {
      ...mensagem,
      id: `m${Date.now().toString()}`,
      datahora: new Date().toISOString()
    };
    setMensagens([...mensagens, novaMensagem]);
  };
  
  const marcarMensagemComoLida = (id: string) => {
    setMensagens(mensagens.map(m => 
      m.id === id ? { ...m, lida: true } : m
    ));
  };
  
  return (
    <MessagesContext.Provider value={{
      messages: mensagens,
      addMessage: adicionarMensagem,
      markMessageAsRead: marcarMensagemComoLida
    }}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessagesContext = () => {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessagesContext must be used within a MessagesProvider');
  }
  return context;
};
