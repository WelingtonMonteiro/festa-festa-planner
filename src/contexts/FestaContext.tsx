
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cliente, Kit, Tema, Evento, Mensagem, Estatisticas } from '../types';
import { clientesMock, kitsMock, temasMock, eventosMock, mensagensMock, gerarEstatisticas } from '../data/mockData';
import { useToast } from '@/components/ui/use-toast';

interface FestaContextType {
  clientes: Cliente[];
  kits: Kit[];
  temas: Tema[];
  eventos: Evento[];
  mensagens: Mensagem[];
  estatisticas: Estatisticas;
  
  // Funções de clientes
  adicionarCliente: (cliente: Omit<Cliente, 'id' | 'historico'>) => void;
  atualizarCliente: (id: string, cliente: Partial<Cliente>) => void;
  excluirCliente: (id: string) => void;
  
  // Funções de kits
  adicionarKit: (kit: Omit<Kit, 'id' | 'vezes_alugado'>) => void;
  atualizarKit: (id: string, kit: Partial<Kit>) => void;
  excluirKit: (id: string) => void;
  
  // Funções de temas
  adicionarTema: (tema: Omit<Tema, 'id' | 'vezes_alugado'>) => void;
  atualizarTema: (id: string, tema: Partial<Tema>) => void;
  excluirTema: (id: string) => void;
  
  // Funções de eventos
  adicionarEvento: (evento: Omit<Evento, 'id'>) => void;
  atualizarEvento: (id: string, evento: Partial<Evento>) => void;
  excluirEvento: (id: string) => void;
  
  // Funções de mensagens
  adicionarMensagem: (mensagem: Omit<Mensagem, 'id' | 'datahora'>) => void;
  marcarMensagemComoLida: (id: string) => void;
  
  // Função para recalcular estatísticas
  atualizarEstatisticas: () => void;
}

const FestaContext = createContext<FestaContextType | undefined>(undefined);

export const FestaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // Estados
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);
  const [temas, setTemas] = useState<Tema[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    eventosPorMes: {},
    kitsPopulares: [],
    temasPorMes: {},
    temasPorAno: {},
    faturamentoMensal: {}
  });
  
  // Carregar dados do localStorage ou usar mocks
  useEffect(() => {
    const loadedClientes = localStorage.getItem('clientes');
    const loadedKits = localStorage.getItem('kits');
    const loadedTemas = localStorage.getItem('temas');
    const loadedEventos = localStorage.getItem('eventos');
    const loadedMensagens = localStorage.getItem('mensagens');
    
    setClientes(loadedClientes ? JSON.parse(loadedClientes) : clientesMock);
    setKits(loadedKits ? JSON.parse(loadedKits) : kitsMock);
    setTemas(loadedTemas ? JSON.parse(loadedTemas) : temasMock);
    setEventos(loadedEventos ? JSON.parse(loadedEventos) : eventosMock);
    setMensagens(loadedMensagens ? JSON.parse(loadedMensagens) : mensagensMock);
  }, []);
  
  // Salvar dados no localStorage quando mudam
  useEffect(() => {
    if (clientes.length) localStorage.setItem('clientes', JSON.stringify(clientes));
    if (kits.length) localStorage.setItem('kits', JSON.stringify(kits));
    if (temas.length) localStorage.setItem('temas', JSON.stringify(temas));
    if (eventos.length) localStorage.setItem('eventos', JSON.stringify(eventos));
    if (mensagens.length) localStorage.setItem('mensagens', JSON.stringify(mensagens));
  }, [clientes, kits, temas, eventos, mensagens]);
  
  // Atualizar estatísticas quando eventos mudam
  useEffect(() => {
    atualizarEstatisticas();
  }, [eventos]);
  
  // Funções de clientes
  const adicionarCliente = (cliente: Omit<Cliente, 'id' | 'historico'>) => {
    const novoCliente: Cliente = {
      ...cliente,
      id: `c${Date.now().toString()}`,
      historico: []
    };
    setClientes([...clientes, novoCliente]);
    toast({ title: "Cliente adicionado", description: `${cliente.nome} foi adicionado com sucesso.` });
  };
  
  const atualizarCliente = (id: string, clienteAtualizado: Partial<Cliente>) => {
    setClientes(clientes.map(c => 
      c.id === id ? { ...c, ...clienteAtualizado } : c
    ));
    toast({ title: "Cliente atualizado", description: "As informações do cliente foram atualizadas." });
  };
  
  const excluirCliente = (id: string) => {
    // Verificar se o cliente tem eventos
    const clienteComEventos = eventos.some(e => e.cliente.id === id);
    if (clienteComEventos) {
      toast({ 
        title: "Operação não permitida", 
        description: "Este cliente possui eventos registrados e não pode ser excluído.", 
        variant: "destructive" 
      });
      return;
    }
    
    const clienteRemovido = clientes.find(c => c.id === id);
    setClientes(clientes.filter(c => c.id !== id));
    
    if (clienteRemovido) {
      // Remover mensagens do cliente
      setMensagens(mensagens.filter(m => m.clienteId !== id));
      toast({ title: "Cliente removido", description: `${clienteRemovido.nome} foi removido com sucesso.` });
    }
  };
  
  // Funções de kits
  const adicionarKit = (kit: Omit<Kit, 'id' | 'vezes_alugado'>) => {
    const novoKit: Kit = {
      ...kit,
      id: `k${Date.now().toString()}`,
      vezes_alugado: 0
    };
    setKits([...kits, novoKit]);
    toast({ title: "Kit adicionado", description: `Kit ${kit.nome} foi adicionado com sucesso.` });
  };
  
  const atualizarKit = (id: string, kitAtualizado: Partial<Kit>) => {
    setKits(kits.map(k => 
      k.id === id ? { ...k, ...kitAtualizado } : k
    ));
    toast({ title: "Kit atualizado", description: "As informações do kit foram atualizadas." });
  };
  
  const excluirKit = (id: string) => {
    // Verificar se o kit está associado a algum evento
    const kitEmUso = eventos.some(e => e.kit.id === id);
    if (kitEmUso) {
      toast({ 
        title: "Operação não permitida", 
        description: "Este kit está associado a eventos e não pode ser excluído.", 
        variant: "destructive" 
      });
      return;
    }
    
    // Remover kit de temas
    setTemas(temas.map(tema => ({
      ...tema,
      kits: tema.kits.filter(k => k.id !== id)
    })));
    
    const kitRemovido = kits.find(k => k.id === id);
    setKits(kits.filter(k => k.id !== id));
    
    if (kitRemovido) {
      toast({ title: "Kit removido", description: `Kit ${kitRemovido.nome} foi removido com sucesso.` });
    }
  };
  
  // Funções de temas
  const adicionarTema = (tema: Omit<Tema, 'id' | 'vezes_alugado'>) => {
    const novoTema: Tema = {
      ...tema,
      id: `t${Date.now().toString()}`,
      vezes_alugado: 0
    };
    setTemas([...temas, novoTema]);
    toast({ title: "Tema adicionado", description: `Tema ${tema.nome} foi adicionado com sucesso.` });
  };
  
  const atualizarTema = (id: string, temaAtualizado: Partial<Tema>) => {
    setTemas(temas.map(t => 
      t.id === id ? { ...t, ...temaAtualizado } : t
    ));
    toast({ title: "Tema atualizado", description: "As informações do tema foram atualizadas." });
  };
  
  const excluirTema = (id: string) => {
    // Verificar se o tema está associado a algum evento
    const temaEmUso = eventos.some(e => e.tema?.id === id);
    if (temaEmUso) {
      toast({ 
        title: "Operação não permitida", 
        description: "Este tema está associado a eventos e não pode ser excluído.", 
        variant: "destructive" 
      });
      return;
    }
    
    const temaRemovido = temas.find(t => t.id === id);
    setTemas(temas.filter(t => t.id !== id));
    
    if (temaRemovido) {
      toast({ title: "Tema removido", description: `Tema ${temaRemovido.nome} foi removido com sucesso.` });
    }
  };
  
  // Funções de eventos
  const adicionarEvento = (evento: Omit<Evento, 'id'>) => {
    const novoEvento: Evento = {
      ...evento,
      id: `e${Date.now().toString()}`
    };
    
    // Atualizar contagem de aluguéis para kit e tema
    if (novoEvento.kit) {
      const kitAtualizado = kits.find(k => k.id === novoEvento.kit.id);
      if (kitAtualizado) {
        atualizarKit(kitAtualizado.id, { 
          vezes_alugado: kitAtualizado.vezes_alugado + 1 
        });
      }
    }
    
    if (novoEvento.tema) {
      const temaAtualizado = temas.find(t => t.id === novoEvento.tema?.id);
      if (temaAtualizado) {
        atualizarTema(temaAtualizado.id, { 
          vezes_alugado: temaAtualizado.vezes_alugado + 1 
        });
      }
    }
    
    // Adicionar evento ao histórico do cliente
    const clienteAtualizado = clientes.find(c => c.id === novoEvento.cliente.id);
    if (clienteAtualizado) {
      atualizarCliente(clienteAtualizado.id, {
        historico: [...clienteAtualizado.historico, novoEvento]
      });
    }
    
    setEventos([...eventos, novoEvento]);
    toast({ title: "Evento agendado", description: `Evento para ${novoEvento.cliente.nome} foi agendado com sucesso.` });
  };
  
  const atualizarEvento = (id: string, eventoAtualizado: Partial<Evento>) => {
    setEventos(eventos.map(e => 
      e.id === id ? { ...e, ...eventoAtualizado } : e
    ));
    
    // Atualizar o histórico do cliente
    const evento = eventos.find(e => e.id === id);
    if (evento && eventoAtualizado) {
      const clienteAtualizado = clientes.find(c => c.id === evento.cliente.id);
      if (clienteAtualizado) {
        const historicoAtualizado = clienteAtualizado.historico.map(h =>
          h.id === id ? { ...h, ...eventoAtualizado } : h
        );
        atualizarCliente(clienteAtualizado.id, { historico: historicoAtualizado });
      }
    }
    
    toast({ title: "Evento atualizado", description: "As informações do evento foram atualizadas." });
  };
  
  const excluirEvento = (id: string) => {
    const eventoRemovido = eventos.find(e => e.id === id);
    
    if (eventoRemovido) {
      // Atualizar o histórico do cliente
      const clienteAtualizado = clientes.find(c => c.id === eventoRemovido.cliente.id);
      if (clienteAtualizado) {
        const historicoAtualizado = clienteAtualizado.historico.filter(h => h.id !== id);
        atualizarCliente(clienteAtualizado.id, { historico: historicoAtualizado });
      }
      
      setEventos(eventos.filter(e => e.id !== id));
      toast({ title: "Evento removido", description: "O evento foi removido com sucesso." });
    }
  };
  
  // Funções de mensagens
  const adicionarMensagem = (mensagem: Omit<Mensagem, 'id' | 'datahora'>) => {
    const novaMensagem: Mensagem = {
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
  
  // Função para recalcular estatísticas
  const atualizarEstatisticas = () => {
    const novasEstatisticas = gerarEstatisticas(eventos);
    setEstatisticas(novasEstatisticas);
  };
  
  return (
    <FestaContext.Provider value={{
      clientes,
      kits,
      temas,
      eventos,
      mensagens,
      estatisticas,
      adicionarCliente,
      atualizarCliente,
      excluirCliente,
      adicionarKit,
      atualizarKit,
      excluirKit,
      adicionarTema,
      atualizarTema,
      excluirTema,
      adicionarEvento,
      atualizarEvento,
      excluirEvento,
      adicionarMensagem,
      marcarMensagemComoLida,
      atualizarEstatisticas
    }}>
      {children}
    </FestaContext.Provider>
  );
};

export const useFestaContext = () => {
  const context = useContext(FestaContext);
  if (context === undefined) {
    throw new Error('useFestaContext must be used within a FestaProvider');
  }
  return context;
};
