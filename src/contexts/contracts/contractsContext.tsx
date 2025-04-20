
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Contract, ContractTemplate, Message } from '../../types';
import { toast } from 'sonner';
import { useContractService, useContractTemplateService } from '@/services/entityServices/contractService';
import { PaginatedResponse } from '@/types/crud';

interface ContractsContextType {
  contracts: Contract[];
  contractTemplates: ContractTemplate[];
  
  addContractTemplate: (template: Omit<ContractTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ContractTemplate>;
  updateContractTemplate: (id: string, template: Partial<ContractTemplate>) => Promise<void>;
  removeContractTemplate: (id: string) => Promise<void>;
  
  addContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Contract>;
  updateContract: (id: string, contract: Partial<Contract>) => Promise<void>;
  removeContract: (id: string) => Promise<void>;
  sendContractToClient: (contractId: string, clientId: string) => Promise<void>;
  signContract: (contractId: string, signatureUrl: string) => Promise<void>;
  
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  refresh: () => Promise<void>;
}

const ContractsContext = createContext<ContractsContextType | undefined>(undefined);

export const ContractsProvider: React.FC<{ 
  children: React.ReactNode,
  onAddMessage?: (message: Omit<Message, 'id' | 'datahora'>) => void 
}> = ({ children, onAddMessage }) => {
  // Use os serviços de contrato e template
  const contractService = useContractService();
  const templateService = useContractTemplateService();
  
  // Estado para contratos e templates
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractTemplates, setContractTemplates] = useState<ContractTemplate[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  
  // Função para buscar e atualizar a lista de contratos
  const fetchContracts = useCallback(async (pageNum: number = page, limitNum: number = limit) => {
    setLoading(true);
    try {
      const result: PaginatedResponse<Contract> = await contractService.getAll(pageNum, limitNum);
      
      setContracts(result.data);
      setTotal(result.total);
      setPage(result.page);
      setLimit(result.limit);
      
      return result;
    } catch (error) {
      console.error('Erro ao buscar contratos:', error);
      return { data: [], total: 0, page: 1, limit: 10 } as PaginatedResponse<Contract>;
    } finally {
      setLoading(false);
    }
  }, [contractService, page, limit]);

  // Função para buscar e atualizar a lista de templates
  const fetchTemplates = useCallback(async () => {
    try {
      const result = await templateService.getAll();
      setContractTemplates(result.data);
      return result;
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      return { data: [], total: 0, page: 1, limit: 10 } as PaginatedResponse<ContractTemplate>;
    }
  }, [templateService]);
  
  // Memoize refresh function to prevent unnecessary rerenders
  const refreshData = useCallback(async () => {
    // Evitar chamadas em loop se os dados já estiverem carregados
    if (!initialDataLoaded) {
      console.log('ContractsContext: Carregando dados iniciais');
      
      try {
        await Promise.all([
          fetchContracts(),
          fetchTemplates()
        ]);
        setInitialDataLoaded(true);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      }
    } else {
      console.log('ContractsContext: Dados já carregados, ignorando refresh automático');
    }
  }, [fetchContracts, fetchTemplates, initialDataLoaded]);

  // Load data only once on initial mount
  useEffect(() => {
    console.log('ContractsContext: Inicializando');
    let isMounted = true;

    const loadInitialData = async () => {
      if (isMounted && !initialDataLoaded) {
        await refreshData();
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [refreshData, initialDataLoaded]);
  
  // Reset do estado de "initialDataLoaded" quando mudar a página ou limite
  const forceRefresh = useCallback(async () => {
    console.log('ContractsContext: Forçando atualização de dados');
    try {
      await Promise.all([
        fetchContracts(),
        fetchTemplates()
      ]);
    } catch (error) {
      console.error('Erro ao forçar atualização de dados:', error);
    }
  }, [fetchContracts, fetchTemplates]);
  
  // Operações de CRUD para modelos de contrato
  const adicionarModeloContrato = async (modelo: Omit<ContractTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContractTemplate> => {
    const novoModelo: Omit<ContractTemplate, 'id'> = {
      ...modelo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      const resultado = await templateService.create(novoModelo);
      
      if (resultado) {
        toast.success(`${modelo.name} foi adicionado com sucesso.`);
        await fetchTemplates(); // Atualizar a lista após adicionar
        return resultado;
      } else {
        toast.error('Erro ao adicionar modelo de contrato.');
        throw new Error('Falha ao criar modelo de contrato');
      }
    } catch (error) {
      console.error('Erro ao adicionar modelo de contrato:', error);
      toast.error('Erro ao adicionar modelo de contrato.');
      throw error;
    }
  };
  
  const atualizarModeloContrato = async (id: string, modeloAtualizado: Partial<ContractTemplate>) => {
    try {
      const updated = await templateService.update(id, {
        ...modeloAtualizado,
        updatedAt: new Date().toISOString()
      });
      
      if (updated) {
        toast.success("O modelo de contrato foi atualizado com sucesso.");
        await fetchTemplates(); // Atualizar a lista após editar
      } else {
        toast.error("Erro ao atualizar modelo de contrato.");
      }
    } catch (error) {
      console.error('Erro ao atualizar modelo de contrato:', error);
      toast.error("Erro ao atualizar modelo de contrato.");
      throw error;
    }
  };
  
  const excluirModeloContrato = async (id: string) => {
    try {
      const modeloEmUso = contracts.some(c => c.templateId === id);
      if (modeloEmUso) {
        toast.error("Este modelo está associado a contratos e não pode ser excluído.");
        return;
      }
      
      const modeloRemovido = contractTemplates.find(m => m.id === id);
      const resultado = await templateService.delete(id);
      
      if (resultado && modeloRemovido) {
        toast.success(`${modeloRemovido.name} foi removido com sucesso.`);
        await fetchTemplates(); // Atualizar a lista após excluir
      } else {
        toast.error("Erro ao remover modelo de contrato.");
      }
    } catch (error) {
      console.error('Erro ao excluir modelo de contrato:', error);
      toast.error("Erro ao remover modelo de contrato.");
      throw error;
    }
  };
  
  // Operações de CRUD para contratos
  const adicionarContrato = async (contrato: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contract> => {
    const novoContrato: Omit<Contract, 'id'> = {
      ...contrato,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      const resultado = await contractService.create(novoContrato);
      
      if (resultado) {
        toast.success(`${contrato.title} foi adicionado com sucesso.`);
        await fetchContracts(); // Atualizar a lista após adicionar
        return resultado;
      } else {
        toast.error('Erro ao adicionar contrato.');
        throw new Error('Falha ao criar contrato');
      }
    } catch (error) {
      console.error('Erro ao adicionar contrato:', error);
      toast.error('Erro ao adicionar contrato.');
      throw error;
    }
  };
  
  const atualizarContrato = async (id: string, contratoAtualizado: Partial<Contract>) => {
    try {
      const updated = await contractService.update(id, {
        ...contratoAtualizado,
        updatedAt: new Date().toISOString()
      });
      
      if (updated) {
        toast.success("O contrato foi atualizado com sucesso.");
        await fetchContracts(); // Atualizar a lista após editar
      } else {
        toast.error("Erro ao atualizar contrato.");
      }
    } catch (error) {
      console.error('Erro ao atualizar contrato:', error);
      toast.error("Erro ao atualizar contrato.");
      throw error;
    }
  };
  
  const excluirContrato = async (id: string) => {
    try {
      const contratoRemovido = contracts.find(c => c.id === id);
      const resultado = await contractService.delete(id);
      
      if (resultado && contratoRemovido) {
        toast.success(`${contratoRemovido.title} foi removido com sucesso.`);
        await fetchContracts(); // Atualizar a lista após excluir
      } else {
        toast.error("Erro ao remover contrato.");
      }
    } catch (error) {
      console.error('Erro ao excluir contrato:', error);
      toast.error("Erro ao remover contrato.");
      throw error;
    }
  };
  
  const enviarContratoParaCliente = async (contractId: string, clientId: string) => {
    try {
      const contrato = contracts.find(c => c.id === contractId);
      
      if (!contrato) {
        toast.error("Contrato não encontrado.");
        return;
      }
      
      if (onAddMessage) {
        onAddMessage({
          remetente: 'empresa',
          clienteId: clientId,
          conteudo: `Um novo contrato "${contrato.title}" foi enviado para você. Por favor, revise e assine.`,
          lida: true
        });
      }
      
      await contractService.sendToClient(contractId, clientId);
      toast.success("O contrato foi enviado para o cliente com sucesso.");
      await fetchContracts(); // Atualizar contratos após enviar
    } catch (error) {
      console.error('Erro ao enviar contrato para cliente:', error);
      toast.error("Erro ao enviar contrato para o cliente.");
      throw error;
    }
  };
  
  const assinarContrato = async (contractId: string, signatureUrl: string) => {
    try {
      const contrato = contracts.find(c => c.id === contractId);
      
      if (!contrato) {
        toast.error("Contrato não encontrado.");
        return;
      }
      
      await contractService.signContract(contractId, signatureUrl);
      toast.success("O contrato foi assinado com sucesso.");
      await fetchContracts(); // Atualizar contratos após assinar
    } catch (error) {
      console.error('Erro ao assinar contrato:', error);
      toast.error("Erro ao assinar contrato.");
      throw error;
    }
  };
  
  // Funções para controlar paginação
  const handleSetPage = useCallback((newPage: number) => {
    console.log(`ContractsContext: Alterando para página ${newPage}`);
    if (newPage !== page) {
      fetchContracts(newPage, limit);
    }
  }, [fetchContracts, page, limit]);

  const handleSetLimit = useCallback((newLimit: number) => {
    console.log(`ContractsContext: Alterando limite para ${newLimit}`);
    if (newLimit !== limit) {
      fetchContracts(1, newLimit);
    }
  }, [fetchContracts, limit]);
  
  return (
    <ContractsContext.Provider value={{
      contracts,
      contractTemplates,
      addContractTemplate: adicionarModeloContrato,
      updateContractTemplate: atualizarModeloContrato,
      removeContractTemplate: excluirModeloContrato,
      addContract: adicionarContrato,
      updateContract: atualizarContrato,
      removeContract: excluirContrato,
      sendContractToClient: enviarContratoParaCliente,
      signContract: assinarContrato,
      total,
      page,
      limit,
      loading,
      setPage: handleSetPage,
      setLimit: handleSetLimit,
      refresh: forceRefresh
    }}>
      {children}
    </ContractsContext.Provider>
  );
};

export const useContractsContext = () => {
  const context = useContext(ContractsContext);
  if (context === undefined) {
    throw new Error('useContractsContext must be used within a ContractsProvider');
  }
  return context;
};
