import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Kit, Them, Event, Message, Statistic, User, Contract, ContractTemplate } from '../types';
import { clientesMock, kitsMock, temasMock, eventosMock, mensagensMock, gerarEstatisticas } from '../data/mockData';
import { toast } from '@/hooks/use-toast';
import { kitService } from '@/services/kitService';
import { themService } from '@/services/themService';
import { useStorage } from './storageContext';
import { useApi } from './apiContext';
import { kitRestService } from '@/services/api/kitRestService';
import { themRestService } from '@/services/api/themRestService';

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

  const { storageType, isInitialized } = useStorage();
  const { isRestApi, apiUrl, isApiInitialized } = useApi();
  const [isLoading, setIsLoading] = useState(true);
  
  // Carregar dados quando o storage ou API é inicializado
  useEffect(() => {
    if (!isInitialized || !isApiInitialized) return;

    const loadData = async () => {
      setIsLoading(true);
      
      // Carregar dados usando REST API
      if (isRestApi) {
        try {
          if (!apiUrl) {
            console.error('URL da API REST não configurada');
            toast({ 
              title: "Erro de configuração", 
              description: "URL da API REST não configurada. Por favor, configure na página de Administração.", 
              variant: "destructive" 
            });
            
            // Usar dados do localStorage como fallback
            const loadedKits = localStorage.getItem('kits');
            const loadedTemas = localStorage.getItem('temas');
            setKits(loadedKits ? JSON.parse(loadedKits) : kitsMock);
            setTemas(loadedTemas ? JSON.parse(loadedTemas) : temasMock);
            
            loadLocalStorageData();
          } else {
            console.log('Carregando dados da API REST:', apiUrl);
            
            // Carregar kits primeiro
            const restKits = await kitRestService.getAll(apiUrl);
            setKits(restKits.length > 0 ? restKits : kitsMock);
            
            // Depois carregar temas usando os kits carregados
            const restThems = await themRestService.getAll(apiUrl, restKits.length > 0 ? restKits : kitsMock);
            setTemas(restThems.length > 0 ? restThems : temasMock);
            
            // Outros dados ainda vêm do localStorage até que sejam implementados na API
            loadLocalStorageData();
          }
        } catch (error) {
          console.error('Falha ao carregar dados da API REST:', error);
          toast({ 
            title: "Erro ao carregar dados", 
            description: "Falha ao carregar dados da API REST. Usando dados locais.", 
            variant: "destructive" 
          });
          
          // Usar dados do localStorage como fallback
          const loadedKits = localStorage.getItem('kits');
          const loadedTemas = localStorage.getItem('temas');
          setKits(loadedKits ? JSON.parse(loadedKits) : kitsMock);
          setTemas(loadedTemas ? JSON.parse(loadedTemas) : temasMock);
          
          loadLocalStorageData();
        }
      }
      // Carregar dados do Supabase
      else if (storageType === 'supabase') {
        try {
          const supabaseKits = await kitService.getAll();
          setKits(supabaseKits.length > 0 ? supabaseKits : kitsMock);
          
          const supabaseThems = await themService.getAll(supabaseKits.length > 0 ? supabaseKits : kitsMock);
          setTemas(supabaseThems.length > 0 ? supabaseThems : temasMock);
          
          loadLocalStorageData();
        } catch (error) {
          console.error('Falha ao carregar dados do Supabase:', error);
          toast({ 
            title: "Erro ao carregar dados", 
            description: "Falha ao carregar dados do Supabase. Usando dados locais.", 
            variant: "destructive" 
          });
          
          // Usar dados do localStorage como fallback
          const loadedKits = localStorage.getItem('kits');
          const loadedTemas = localStorage.getItem('temas');
          setKits(loadedKits ? JSON.parse(loadedKits) : kitsMock);
          setTemas(loadedTemas ? JSON.parse(loadedTemas) : temasMock);
          
          loadLocalStorageData();
        }
      } 
      // Carregar dados do localStorage
      else {
        const loadedKits = localStorage.getItem('kits');
        const loadedTemas = localStorage.getItem('temas');
        setKits(loadedKits ? JSON.parse(loadedKits) : kitsMock);
        setTemas(loadedTemas ? JSON.parse(loadedTemas) : temasMock);
        
        loadLocalStorageData();
      }
      
      const loadedUsuario = localStorage.getItem('usuario');
      if (loadedUsuario) {
        setUsuario(JSON.parse(loadedUsuario));
      }
      
      setIsLoading(false);
    };
    
    const loadLocalStorageData = () => {
      const loadedClientes = localStorage.getItem('clients');
      const loadedEventos = localStorage.getItem('events');
      const loadedMensagens = localStorage.getItem('mensagens');
      const loadedContratos = localStorage.getItem('contratos');
      const loadedModelosContrato = localStorage.getItem('modelosContrato');
      
      const clientesWithActiveStatus = loadedClientes 
        ? JSON.parse(loadedClientes) 
        : clientesMock.map(c => ({ ...c, ativo: true }));
      
      setClientes(clientesWithActiveStatus);
      setEventos(loadedEventos ? JSON.parse(loadedEventos) : eventosMock);
      setMensagens(loadedMensagens ? JSON.parse(loadedMensagens) : mensagensMock);
      setContratos(loadedContratos ? JSON.parse(loadedContratos) : []);
      setModelosContrato(loadedModelosContrato ? JSON.parse(loadedModelosContrato) : []);
    };
    
    loadData();
  }, [storageType, isInitialized, isRestApi, apiUrl, isApiInitialized]);
  
  // Persistir dados no localStorage
  useEffect(() => {
    if (isLoading || !isInitialized) return;
    
    if (storageType === 'localStorage' && !isRestApi) {
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
    } else {
      // Mesmo quando estamos usando Supabase ou API REST, ainda salvamos alguns dados no localStorage
      // como backup ou para dados que ainda não estão implementados na API
      if (clientes.length) {
        const clientesForStorage = prepareForStorage(clientes);
        localStorage.setItem('clients', JSON.stringify(clientesForStorage));
      }
      
      if (eventos.length) {
        const eventosForStorage = prepareForStorage(eventos);
        localStorage.setItem('events', JSON.stringify(eventosForStorage));
      }
      
      if (mensagens.length) localStorage.setItem('mensagens', JSON.stringify(mensagens));
      if (contratos.length) localStorage.setItem('contratos', JSON.stringify(contratos));
      if (modelosContrato.length) localStorage.setItem('modelosContrato', JSON.stringify(modelosContrato));
    }
    
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }, [clientes, kits, temas, eventos, mensagens, usuario, contratos, modelosContrato, storageType, isLoading, isInitialized, isRestApi]);
  
  // O restante do código permanece o mesmo
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
  
  const adicionarKit = async (kit: Omit<Kit, 'id' | 'vezes_alugado'>) => {
    // Se estiver usando API REST
    if (isRestApi) {
      if (!apiUrl) {
        toast({ title: "Erro", description: "URL da API REST não configurada.", variant: "destructive" });
        return null;
      }
      
      try {
        const novoKit = await kitRestService.create(kit, apiUrl);
        if (novoKit) {
          setKits([...kits, novoKit]);
          toast({ title: "Kit adicionado", description: `Kit ${kit.nome} foi adicionado com sucesso via API REST.` });
          return novoKit;
        }
        return null;
      } catch (error) {
        console.error('Falha ao adicionar kit via API REST:', error);
        toast({ title: "Erro", description: "Falha ao adicionar kit via API REST.", variant: "destructive" });
        return null;
      }
    }
    // Se estiver usando Supabase
    else if (storageType === 'supabase') {
      try {
        const novoKit = await kitService.create(kit);
        if (novoKit) {
          setKits([...kits, novoKit]);
          toast({ title: "Kit adicionado", description: `Kit ${kit.nome} foi adicionado com sucesso.` });
          return novoKit;
        }
        return null;
      } catch (error) {
        console.error('Failed to add kit to Supabase:', error);
        toast({ title: "Erro", description: "Falha ao adicionar kit no Supabase.", variant: "destructive" });
        return null;
      }
    }
    // Usando localStorage
    else {
      const novoKit: Kit = {
        ...kit,
        id: `k${Date.now().toString()}`,
        vezes_alugado: 0
      };
      setKits([...kits, novoKit]);
      toast({ title: "Kit adicionado", description: `Kit ${kit.nome} foi adicionado com sucesso.` });
      return novoKit;
    }
  };
  
  const atualizarKit = async (id: string, kitAtualizado: Partial<Kit>) => {
    // Se estiver usando API REST
    if (isRestApi) {
      if (!apiUrl) {
        toast({ title: "Erro", description: "URL da API REST não configurada.", variant: "destructive" });
        return null;
      }
      
      try {
        const updatedKit = await kitRestService.update(id, kitAtualizado, apiUrl);
        if (updatedKit) {
          setKits(kits.map(k => k.id === id ? updatedKit : k));
          toast({ title: "Kit atualizado", description: "As informações do kit foram atualizadas via API REST." });
          return updatedKit;
        }
        return null;
      } catch (error) {
        console.error('Falha ao atualizar kit via API REST:', error);
        toast({ title: "Erro", description: "Falha ao atualizar kit via API REST.", variant: "destructive" });
        return null;
      }
    }
    // Se estiver usando Supabase
    else if (storageType === 'supabase') {
      try {
        const updatedKit = await kitService.update(id, kitAtualizado);
        if (updatedKit) {
          setKits(kits.map(k => k.id === id ? updatedKit : k));
          toast({ title: "Kit atualizado", description: "As informações do kit foram atualizadas." });
          return updatedKit;
        }
        return null;
      } catch (error) {
        console.error('Failed to update kit in Supabase:', error);
        toast({ title: "Erro", description: "Falha ao atualizar kit no Supabase.", variant: "destructive" });
        return null;
      }
    }
    // Usando localStorage
    else {
      setKits(kits.map(k => 
        k.id === id ? { ...k, ...kitAtualizado } : k
      ));
      toast({ title: "Kit atualizado", description: "As informações do kit foram atualizadas." });
      return kits.find(k => k.id === id);
    }
  };
  
  const excluirKit = async (id: string) => {
    const kitEmUso = eventos.some(e => e.kit.id === id);
    if (kitEmUso) {
      toast({ 
        title: "Operação não permitida", 
        description: "Este kit está associado a events e não pode ser excluído.",
        variant: "destructive" 
      });
      return false;
    }
    
    // Atualiza os temas para remover referências ao kit excluído
    setTemas(temas.map(tema => ({
      ...tema,
      kits: tema.kits.filter(k => k.id !== id)
    })));
    
    const kitRemovido = kits.find(k => k.id === id);
    
    // Se estiver usando API REST
    if (isRestApi) {
      if (!apiUrl) {
        toast({ title: "Erro", description: "URL da API REST não configurada.", variant: "destructive" });
        return false;
      }
      
      try {
        const result = await kitRestService.delete(id, apiUrl);
        if (result) {
          setKits(kits.filter(k => k.id !== id));
          
          if (kitRemovido) {
            toast({ title: "Kit removido", description: `Kit ${kitRemovido.nome} foi removido com sucesso via API REST.` });
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('Falha ao excluir kit via API REST:', error);
        toast({ title: "Erro", description: "Falha ao excluir kit via API REST.", variant: "destructive" });
        return false;
      }
    }
    // Se estiver usando Supabase
    else if (storageType === 'supabase') {
      try {
        const result = await kitService.delete(id);
        if (result) {
          setKits(kits.filter(k => k.id !== id));
          
          if (kitRemovido) {
            toast({ title: "Kit removido", description: `Kit ${kitRemovido.nome} foi removido com sucesso.` });
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('Failed to delete kit from Supabase:', error);
        toast({ title: "Erro", description: "Falha ao remover kit do Supabase.", variant: "destructive" });
        return false;
      }
    }
    // Usando localStorage
    else {
      setKits(kits.filter(k => k.id !== id));
      
      if (kitRemovido) {
        toast({ title: "Kit removido", description: `Kit ${kitRemovido.nome} foi removido com sucesso.` });
      }
      return true;
    }
  };
  
  const adicionarTema = async (tema: Omit<Them, 'id' | 'vezes_alugado'>) => {
    // Se estiver usando API REST
    if (isRestApi) {
      if (!apiUrl) {
        toast({ title: "Erro", description: "URL da API REST não configurada.", variant: "destructive" });
        return null;
      }
      
      try {
        const novoTema = await themRestService.create(tema, apiUrl);
        if (novoTema) {
          setTemas([...temas, novoTema]);
          toast({ title: "Tema adicionado", description: `Tema ${tema.nome} foi adicionado com sucesso via API REST.` });
          return novoTema;
        }
        return null;
      } catch (error) {
        console.error('Falha ao adicionar tema via API REST:', error);
        toast({ title: "Erro", description: "Falha ao adicionar tema via API REST.", variant: "destructive" });
        return null;
      }
    }
    // Se estiver usando Supabase
    else if (storageType === 'supabase') {
      try {
        const novoTema = await themService.create(tema, kits);
        if (novoTema) {
          setTemas([...temas, novoTema]);
          toast({ title: "Tema adicionado", description: `Tema ${tema.nome} foi adicionado com sucesso.` });
          return novoTema;
        }
        return null;
      } catch (error) {
        console.error('Failed to add them to Supabase:', error);
        toast({ title: "Erro", description: "Falha ao adicionar tema no Supabase.", variant: "destructive" });
        return null;
      }
    }
    // Usando localStorage
    else {
      const novoTema: Them = {
        ...tema,
        id: `t${Date.now().toString()}`,
        vezes_alugado: 0
      };
      setTemas([...temas, novoTema]);
      toast({ title: "Tema adicionado", description: `Tema ${tema.nome} foi adicionado com sucesso.` });
      return novoTema;
    }
  };
  
  const atualizarTema = async (id: string, temaAtualizado: Partial<Them>) => {
    // Se estiver usando API REST
    if (isRestApi) {
      if (!apiUrl) {
        toast({ title: "Erro", description: "URL da API REST não configurada.", variant: "destructive" });
        return null;
      }
      
      try {
        const updatedThem = await themRestService.update(id, temaAtualizado, apiUrl);
        if (updatedThem) {
          setTemas(temas.map(t => t.id === id ? updatedThem : t));
          toast({ title: "Tema atualizado", description: "As informações do tema foram atualizadas via API REST." });
          return updatedThem;
        }
        return null;
      } catch (error) {
        console.error('Falha ao atualizar tema via API REST:', error);
        toast({ title: "Erro", description: "Falha ao atualizar tema via API REST.", variant: "destructive" });
        return null;
      }
    }
    // Se estiver usando Supabase
    else if (storageType === 'supabase') {
      try {
        const updatedThem = await themService.update(id, temaAtualizado, kits);
        if (updatedThem) {
          setTemas(temas.map(t => t.id === id ? updatedThem : t));
          toast({ title: "Tema atualizado", description: "As informações do tema foram atualizadas." });
          return updatedThem;
        }
        return null;
      } catch (error) {
        console.error('Failed to update them in Supabase:', error);
        toast({ title: "Erro", description: "Falha ao atualizar tema no Supabase.", variant: "destructive" });
        return null;
      }
    }
    // Usando localStorage
    else {
      setTemas(temas.map(t => 
        t.id === id ? { ...t, ...temaAtualizado } : t
      ));
      toast({ title: "Tema atualizado", description: "As informações do tema foram atualizadas." });
      return temas.find(t => t.id === id);
    }
  };
  
  const excluirTema = async (id: string) => {
    const temaEmUso = eventos.some(e => e.tema?.id === id);
    if (temaEmUso) {
      toast({ 
        title: "Operação não permitida", 
        description: "Este tema está associado a events e não pode ser excluído.",
        variant: "destructive" 
      });
      return false;
    }
    
    const temaRemovido = temas.find(t => t.id === id);
    
    // Se estiver usando API REST
    if (isRestApi) {
      if (!apiUrl) {
        toast({ title: "Erro", description: "URL da API REST não configurada.", variant: "destructive" });
        return false;
      }
      
      try {
        const result = await themRestService.delete(id, apiUrl);
        if (result) {
          setTemas(temas.filter(t => t.id !== id));
          
          if (temaRemovido) {
            toast({ title: "Tema removido", description: `Tema ${temaRemovido.nome} foi removido com sucesso via API REST.` });
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('Falha ao excluir tema via API REST:', error);
        toast({ title: "Erro", description: "Falha ao excluir tema via API REST.", variant: "destructive" });
        return false;
      }
    }
    // Se estiver usando Supabase
    else if (storageType === 'supabase') {
      try {
        const result = await themService.delete(id);
        if (result) {
          setTemas(temas.filter(t => t.id !== id));
          
          if (temaRemovido) {
            toast({ title: "Tema removido", description: `Tema ${temaRemovido.nome} foi removido com sucesso.` });
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('Failed to delete them from Supabase:', error);
        toast({ title: "Erro", description: "Falha ao remover tema do Supabase.", variant: "destructive" });
        return false;
      }
    }
    // Usando localStorage
    else {
      setTemas(temas.filter(t => t.id !== id));
      
      if (temaRemovido) {
        toast({ title: "Tema removido", description: `Tema ${temaRemovido.nome} foi removido com sucesso.` });
      }
      return true;
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
      toast({ title: "Modelo removido", description: `${modeloRemovido.name} foi removido com
