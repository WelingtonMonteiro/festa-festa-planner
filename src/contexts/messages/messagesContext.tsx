
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message } from '../../types';
import { mensagensMock } from '../../data/mockData';
import { toast } from 'sonner';

interface MessagesContextType {
  messages: (Message & { platform?: string })[];
  
  addMessage: (mensagem: Omit<Message & { platform?: string }, 'id' | 'datahora'>) => void;
  markMessageAsRead: (id: string) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mensagens, setMensagens] = useState<(Message & { platform?: string })[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Inicialização
  useEffect(() => {
    const loadData = () => {
      const loadedMensagens = localStorage.getItem('mensagens');
      // Adicionamos a propriedade platform para mensagens antigas
      const processedMessages = loadedMensagens 
        ? JSON.parse(loadedMensagens).map((m: Message) => ({
            ...m,
            platform: m.platform || 'whatsapp' // Definimos 'whatsapp' como padrão para mensagens antigas
          }))
        : mensagensMock.map(m => ({
            ...m,
            platform: 'whatsapp' // Definimos 'whatsapp' como padrão para dados mock
          }));
      
      setMensagens(processedMessages);
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
  
  const adicionarMensagem = (mensagem: Omit<Message & { platform?: string }, 'id' | 'datahora'>) => {
    const novaMensagem = {
      ...mensagem,
      id: `m${Date.now().toString()}`,
      datahora: new Date().toISOString(),
      platform: mensagem.platform || 'whatsapp' // Definimos 'whatsapp' como padrão se não especificado
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
