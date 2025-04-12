import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Kit, Them, Event, Message, Statistic, User, Contract, ContractTemplate } from '../types';
import { clientesMock, kitsMock, temasMock, eventosMock, mensagensMock, gerarEstatisticas } from '../data/mockData';
import { toast } from '@/hooks/use-toast';

interface HandleContextType {
  clients: Client[];
  kits: Kit[];
  thems: Them[];
  events: Event[];
  messages: Message[];
  statistics: Statistic;
  users: User;
  contracts: Contract[];
  contractTemplates: ContractTemplate[];
  
  addClients: (cliente: Omit<Client, 'id' | 'historico'>) => void;
  updateClients: (id: string, cliente: Partial<Client>) => void;
  removeClients: (id: string) => void;
  
  addKit: (kit: Omit<Kit, 'id' | 'vezes_alugado'>) => void;
  updateKit: (id: string, kit: Partial<Kit>) => void;
  removeKit: (id: string) => void;
  
  addThems: (tema: Omit<Them, 'id' | 'vezes_alugado'>) => void;
  updateThems: (id: string, tema: Partial<Them>) => void;
  removeThems: (id: string) => void;
  
  addEvent: (evento: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, evento: Partial<Event>) => void;
  removeEvent: (id: string) => void;
  
  addMessage: (mensagem: Omit<Message, 'id' | 'datahora'>) => void;
  markMessageAsRead: (id: string) => void;
  
  updateStatistic: () => void;

  addContractTemplate: (template: Omit<ContractTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContractTemplate: (id: string, template: Partial<ContractTemplate>) => void;
  removeContractTemplate: (id: string) => void;
  
  addContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContract: (id: string, contract: Partial<Contract>) => void;
  removeContract: (id: string) => void;
  sendContractToClient: (contractId: string, clientId: string) => void;
  signContract: (contractId: string, signatureUrl: string) => void;
}

const HandleContext = createContext<HandleContextType | undefined>(undefined);

const prepareForStorage = (data: any) => {
  if (Array.isArray(data)) {
    return data.map(item => prepareForStorage(item));
  } else if (data && typeof data === 'object') {
    const result = { ...data };
    
    if (result.cliente && result.cliente.historico) {
      result.clienteId = result.cliente.id;
      delete result.cliente;
    }
    
    if (result.historico && Array.isArray(result.historico)) {
      result.historicoIds = result.historico.map((e: Event) => e.id);
      delete result.historico;
    }
    
    return result;
  }
  return data;
};

export const FestaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientes, setClientes] = useState<Client[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);
  const [temas, setTemas] = useState<Them[]>([]);
  const [eventos, setEventos] = useState<Event[]>([]);
  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [contratos, setContratos] = useState<Contract[]>([]);
  const [modelosContrato, setModelosContrato] = useState<ContractTemplate[]>([]);
  const [estatisticas, setEstatisticas] = useState<Statistic>({
    eventosPorMes: {},
    kitsPopulares: [],
    temasPorMes: {},
    temasPorAno: {},
    faturamentoMensal: {}
  });
  const [usuario, setUsuario] = useState<User>({
    nome: "Administrador",
    email: "admin@festadecoracoes.com",
    telefone: "(11) 98765-4321"
  });
  
  useEffect(() => {
    const loadedClientes = localStorage.getItem('clients');
    const loadedKits = localStorage.getItem('kits');
    const loadedTemas = localStorage.getItem('temas');
    const loadedEventos = localStorage.getItem('events');
    const loadedMensagens = localStorage.getItem('mensagens');
    const loadedContratos = localStorage.getItem('contratos');
    const loadedModelosContrato = localStorage.getItem('modelosContrato');
    
    const clientesWithActiveStatus = loadedClientes 
      ? JSON.parse(loadedClientes) 
      : clientesMock.map(c => ({ ...c, ativo: true }));
    
    setClientes(clientesWithActiveStatus);
    setKits(loadedKits ? JSON.parse(loadedKits) : kitsMock);
    setTemas(loadedTemas ? JSON.parse(loadedTemas) : temasMock);
    setEventos(loadedEventos ? JSON.parse(loadedEventos) : eventosMock);
    setMensagens(loadedMensagens ? JSON.parse(loadedMensagens) : mensagensMock);
    setContratos(loadedContratos ? JSON.parse(loadedContratos) : []);
    setModelosContrato(loadedModelosContrato ? JSON.parse(loadedModelosContrato) : []);
    
    const loadedUsuario = localStorage.getItem('usuario');
    if (loadedUsuario) {
      setUsuario(JSON.parse(loadedUsuario));
    }
  }, []);
  
  useEffect(() => {
    if (clientes.length) {
      const clientesForStorage = prepareForStorage(clientes);
      localStorage.setItem('clients', JSON.stringify(clientesForStorage));
    }
    
    if (kits.length) localStorage.setItem('kits', JSON.stringify(kits));
    if (temas.length) localStorage.setItem('temas', JSON.stringify(temas));
    
    if (eventos.length) {
      const eventosForStorage = prepareForStorage(eventos);
      localStorage.setItem('events', JSON.stringify(eventosForStorage));
    }
    
    if (mensagens.length) localStorage.setItem('mensagens', JSON.stringify(mensagens));
    
    if (contratos.length) localStorage.setItem('contratos', JSON.stringify(contratos));
    if (modelosContrato.length) localStorage.setItem('modelosContrato', JSON.stringify(modelosContrato));
    
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }, [clientes, kits, temas, eventos, mensagens, usuario, contratos, modelosContrato]);
  
  useEffect(() => {
    atualizarEstatisticas();
  }, [eventos]);
  
  const adicionarCliente = (cliente: Omit<Client, 'id' | 'historico'>) => {
    const novoCliente: Client = {
      ...cliente,
      id: `c${Date.now().toString()}`,
      historico: [],
      ativo: cliente.ativo !== false
    };
    setClientes([...clientes, novoCliente]);
    toast({ title: "Cliente adicionado", description: `${cliente.nome} foi adicionado com sucesso.` });
  };
  
  const atualizarCliente = (id: string, clienteAtualizado: Partial<Client>) => {
    setClientes(clientes.map(c => 
      c.id === id ? { ...c, ...clienteAtualizado } : c
    ));
    toast({ title: "Cliente atualizado", description: "As informações do cliente foram atualizadas." });
  };
  
  const excluirCliente = (id: string) => {
    const clienteComEventos = eventos.some(e => e.cliente.id === id);
    if (clienteComEventos) {
      toast({ 
        title: "Operação não permitida", 
        description: "Este cliente possui events registrados e não pode ser excluído.",
        variant: "destructive" 
      });
      return;
    }
    
    const cliente = clientes.find(c => c.id === id);
    if (cliente) {
      atualizarCliente(id, { ativo: false });
      toast({ 
        title: "Cliente desativado", 
        description: `${cliente.nome} foi marcado como inativo com sucesso.` 
      });
    }
  };
  
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
    const kitEmUso = eventos.some(e => e.kit.id === id);
    if (kitEmUso) {
      toast({ 
        title: "Operação não permitida", 
        description: "Este kit está associado a events e não pode ser excluído.",
        variant: "destructive" 
      });
      return;
    }
    
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
  
  const adicionarTema = (tema: Omit<Them, 'id' | 'vezes_alugado'>) => {
    const novoTema: Them = {
      ...tema,
      id: `t${Date.now().toString()}`,
      vezes_alugado: 0
    };
    setTemas([...temas, novoTema]);
    toast({ title: "Tema adicionado", description: `Tema ${tema.nome} foi adicionado com sucesso.` });
  };
  
  const atualizarTema = (id: string, temaAtualizado: Partial<Them>) => {
    setTemas(temas.map(t => 
      t.id === id ? { ...t, ...temaAtualizado } : t
    ));
    toast({ title: "Tema atualizado", description: "As informações do tema foram atualizadas." });
  };
  
  const excluirTema = (id: string) => {
    const temaEmUso = eventos.some(e => e.tema?.id === id);
    if (temaEmUso) {
      toast({ 
        title: "Operação não permitida", 
        description: "Este tema está associado a events e não pode ser excluído.",
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
  
  const adicionarEvento = (evento: Omit<Event, 'id'>) => {
    const novoEvento: Event = {
      ...evento,
      id: `e${Date.now().toString()}`
    };
    
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
    
    const clienteAtualizado = clientes.find(c => c.id === novoEvento.cliente.id);
    if (clienteAtualizado) {
      if (!clienteAtualizado.historico) {
        clienteAtualizado.historico = []
      }
      const clienteComHistoricoAtualizado = {
        ...clienteAtualizado,
        historico: [...clienteAtualizado.historico, novoEvento]
      };
      
      setClientes(clientes.map(c => 
        c.id === clienteAtualizado.id ? clienteComHistoricoAtualizado : c
      ));
    }
    
    const eventosAtualizados = [...eventos, novoEvento];
    setEventos(eventosAtualizados);
    
    const eventosForStorage = prepareForStorage(eventosAtualizados);
    localStorage.setItem('events', JSON.stringify(eventosForStorage));
    
    return novoEvento;
  };
  
  const atualizarEvento = (id: string, eventoAtualizado: Partial<Event>) => {
    setEventos(eventos.map(e => 
      e.id === id ? { ...e, ...eventoAtualizado } : e
    ));
    
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
      const clienteAtualizado = clientes.find(c => c.id === eventoRemovido.cliente.id);
      if (clienteAtualizado) {
        const historicoAtualizado = clienteAtualizado.historico.filter(h => h.id !== id);
        atualizarCliente(clienteAtualizado.id, { historico: historicoAtualizado });
      }
      
      setEventos(eventos.filter(e => e.id !== id));
      toast({ title: "Evento removido", description: "O evento foi removido com sucesso." });
    }
  };
  
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
  
  const atualizarEstatisticas = () => {
    const novasEstatisticas = gerarEstatisticas(eventos);
    setEstatisticas(novasEstatisticas);
  };
  
  const adicionarModeloContrato = (modelo: Omit<ContractTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const novoModelo: ContractTemplate = {
      ...modelo,
      id: `ct${Date.now().toString()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setModelosContrato([...modelosContrato, novoModelo]);
    toast({ title: "Modelo de contrato adicionado", description: `${modelo.name} foi adicionado com sucesso.` });
    return novoModelo;
  };
  
  const atualizarModeloContrato = (id: string, modeloAtualizado: Partial<ContractTemplate>) => {
    setModelosContrato(modelosContrato.map(m => 
      m.id === id ? { ...m, ...modeloAtualizado, updatedAt: new Date().toISOString() } : m
    ));
    toast({ title: "Modelo atualizado", description: "O modelo de contrato foi atualizado com sucesso." });
  };
  
  const excluirModeloContrato = (id: string) => {
    const modeloEmUso = contratos.some(c => c.templateId === id);
    if (modeloEmUso) {
      toast({ 
        title: "Operação não permitida", 
        description: "Este modelo está associado a contratos e não pode ser excluído.",
        variant: "destructive" 
      });
      return;
    }
    
    const modeloRemovido = modelosContrato.find(m => m.id === id);
    setModelosContrato(modelosContrato.filter(m => m.id !== id));
    
    if (modeloRemovido) {
      toast({ title: "Modelo removido", description: `${modeloRemovido.name} foi removido com sucesso.` });
    }
  };
  
  const adicionarContrato = (contrato: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => {
    const novoContrato: Contract = {
      ...contrato,
      id: `c${Date.now().toString()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setContratos([...contratos, novoContrato]);
    toast({ title: "Contrato adicionado", description: `${contrato.title} foi adicionado com sucesso.` });
    return novoContrato;
  };
  
  const atualizarContrato = (id: string, contratoAtualizado: Partial<Contract>) => {
    setContratos(contratos.map(c => 
      c.id === id ? { ...c, ...contratoAtualizado, updatedAt: new Date().toISOString() } : c
    ));
    toast({ title: "Contrato atualizado", description: "O contrato foi atualizado com sucesso." });
  };
  
  const excluirContrato = (id: string) => {
    const contratoRemovido = contratos.find(c => c.id === id);
    setContratos(contratos.filter(c => c.id !== id));
    
    if (contratoRemovido) {
      toast({ title: "Contrato removido", description: `${contratoRemovido.title} foi removido com sucesso.` });
    }
  };
  
  const enviarContratoParaCliente = (contractId: string, clientId: string) => {
    const contrato = contratos.find(c => c.id === contractId);
    
    if (!contrato) {
      toast({ 
        title: "Erro", 
        description: "Contrato não encontrado.",
        variant: "destructive" 
      });
      return;
    }
    
    adicionarMensagem({
      remetente: 'empresa',
      clienteId: clientId,
      conteudo: `Um novo contrato "${contrato.title}" foi enviado para você. Por favor, revise e assine.`,
      lida: true
    });
    
    atualizarContrato(contractId, { status: 'sent' });
    
    toast({ title: "Contrato enviado", description: "O contrato foi enviado para o cliente com sucesso." });
  };
  
  const assinarContrato = (contractId: string, signatureUrl: string) => {
    const contrato = contratos.find(c => c.id === contractId);
    
    if (!contrato) {
      toast({ 
        title: "Erro", 
        description: "Contrato não encontrado.",
        variant: "destructive" 
      });
      return;
    }
    
    atualizarContrato(contractId, {
      status: 'signed',
      signatureUrl,
      signedAt: new Date().toISOString()
    });
    
    toast({ title: "Contrato assinado", description: "O contrato foi assinado com sucesso." });
  };
  
  return (
    <HandleContext.Provider value={{
      clients: clientes,
      kits,
      thems: temas,
      events: eventos,
      messages: mensagens,
      statistics: estatisticas,
      users: usuario,
      contracts: contratos,
      contractTemplates: modelosContrato,
      addClients: adicionarCliente,
      updateClients: atualizarCliente,
      removeClients: excluirCliente,
      addKit: adicionarKit,
      updateKit: atualizarKit,
      removeKit: excluirKit,
      addThems: adicionarTema,
      updateThems: atualizarTema,
      removeThems: excluirTema,
      addEvent: adicionarEvento,
      updateEvent: atualizarEvento,
      removeEvent: excluirEvento,
      addMessage: adicionarMensagem,
      markMessageAsRead: marcarMensagemComoLida,
      updateStatistic: atualizarEstatisticas,
      addContractTemplate: adicionarModeloContrato,
      updateContractTemplate: atualizarModeloContrato,
      removeContractTemplate: excluirModeloContrato,
      addContract: adicionarContrato,
      updateContract: atualizarContrato,
      removeContract: excluirContrato,
      sendContractToClient: enviarContratoParaCliente,
      signContract: assinarContrato
    }}>
      {children}
    </HandleContext.Provider>
  );
};

export const useHandleContext = () => {
  const context = useContext(HandleContext);
  if (context === undefined) {
    throw new Error('useHandleContext must be used within a FestaProvider');
  }
  return context;
};
