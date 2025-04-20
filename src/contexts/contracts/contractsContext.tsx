
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Contract, ContractTemplate, Message } from '../../types';
import { toast } from 'sonner';
import { useCrud } from '@/hooks/useCrud';
import { StorageType } from '@/types/crud';

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
  // Use CRUD hook for contracts with a fixed API configuration
  const contractsCrud = useCrud<Contract>({
    type: StorageType.ApiRest,
    config: {
      apiUrl: import.meta.env.VITE_APP_API_URL || '',
      endpoint: 'contracts'
    }
  });

  // Use CRUD hook for templates with a fixed API configuration
  const templatesCrud = useCrud<ContractTemplate>({
    type: StorageType.ApiRest,
    config: {
      apiUrl: import.meta.env.VITE_APP_API_URL || '',
      endpoint: 'contractTemplates'
    }
  });
  
  // Memoize refresh function to prevent unnecessary rerenders
  const refreshData = useCallback(async () => {
    console.log('ContractsContext: Atualizando dados');
    await Promise.all([
      contractsCrud.refresh(),
      templatesCrud.refresh()
    ]);
  }, [contractsCrud, templatesCrud]);

  // Load data only once on initial mount
  useEffect(() => {
    console.log('ContractsContext: Inicializando');
    let isMounted = true;

    const loadInitialData = async () => {
      if (isMounted) {
        await refreshData();
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [refreshData]);
  
  const adicionarModeloContrato = async (modelo: Omit<ContractTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContractTemplate> => {
    const novoModelo: Omit<ContractTemplate, 'id'> = {
      ...modelo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      const resultado = await templatesCrud.create(novoModelo);
      
      if (resultado) {
        toast.success(`${modelo.name} foi adicionado com sucesso.`);
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
      const updated = await templatesCrud.update(id, {
        ...modeloAtualizado,
        updatedAt: new Date().toISOString()
      });
      
      if (updated) {
        toast.success("O modelo de contrato foi atualizado com sucesso.");
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
      const modeloEmUso = contractsCrud.data.some(c => c.templateId === id);
      if (modeloEmUso) {
        toast.error("Este modelo está associado a contratos e não pode ser excluído.");
        return;
      }
      
      const modeloRemovido = templatesCrud.data.find(m => m.id === id);
      const resultado = await templatesCrud.remove(id);
      
      if (resultado && modeloRemovido) {
        toast.success(`${modeloRemovido.name} foi removido com sucesso.`);
      } else {
        toast.error("Erro ao remover modelo de contrato.");
      }
    } catch (error) {
      console.error('Erro ao excluir modelo de contrato:', error);
      toast.error("Erro ao remover modelo de contrato.");
      throw error;
    }
  };
  
  const adicionarContrato = async (contrato: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contract> => {
    const novoContrato: Omit<Contract, 'id'> = {
      ...contrato,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      const resultado = await contractsCrud.create(novoContrato);
      
      if (resultado) {
        toast.success(`${contrato.title} foi adicionado com sucesso.`);
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
      const updated = await contractsCrud.update(id, {
        ...contratoAtualizado,
        updatedAt: new Date().toISOString()
      });
      
      if (updated) {
        toast.success("O contrato foi atualizado com sucesso.");
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
      const contratoRemovido = contractsCrud.data.find(c => c.id === id);
      const resultado = await contractsCrud.remove(id);
      
      if (resultado && contratoRemovido) {
        toast.success(`${contratoRemovido.title} foi removido com sucesso.`);
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
      const contrato = contractsCrud.data.find(c => c.id === contractId);
      
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
      
      await atualizarContrato(contractId, { status: 'sent' });
      toast.success("O contrato foi enviado para o cliente com sucesso.");
    } catch (error) {
      console.error('Erro ao enviar contrato para cliente:', error);
      toast.error("Erro ao enviar contrato para o cliente.");
      throw error;
    }
  };
  
  const assinarContrato = async (contractId: string, signatureUrl: string) => {
    try {
      const contrato = contractsCrud.data.find(c => c.id === contractId);
      
      if (!contrato) {
        toast.error("Contrato não encontrado.");
        return;
      }
      
      await atualizarContrato(contractId, {
        status: 'signed',
        signatureUrl,
        signedAt: new Date().toISOString()
      });
      
      toast.success("O contrato foi assinado com sucesso.");
    } catch (error) {
      console.error('Erro ao assinar contrato:', error);
      toast.error("Erro ao assinar contrato.");
      throw error;
    }
  };
  
  // Função que controla o carregamento por página de forma otimizada
  const handleSetPage = useCallback((newPage: number) => {
    console.log(`ContractsContext: Alterando para página ${newPage}`);
    if (newPage !== contractsCrud.page) {
      contractsCrud.refresh(newPage, contractsCrud.limit);
    }
  }, [contractsCrud]);

  // Função que controla a quantidade de itens por página
  const handleSetLimit = useCallback((newLimit: number) => {
    console.log(`ContractsContext: Alterando limite para ${newLimit}`);
    if (newLimit !== contractsCrud.limit) {
      contractsCrud.refresh(1, newLimit);
    }
  }, [contractsCrud]);
  
  return (
    <ContractsContext.Provider value={{
      contracts: contractsCrud.data,
      contractTemplates: templatesCrud.data,
      addContractTemplate: adicionarModeloContrato,
      updateContractTemplate: atualizarModeloContrato,
      removeContractTemplate: excluirModeloContrato,
      addContract: adicionarContrato,
      updateContract: atualizarContrato,
      removeContract: excluirContrato,
      sendContractToClient: enviarContratoParaCliente,
      signContract: assinarContrato,
      total: contractsCrud.total,
      page: contractsCrud.page,
      limit: contractsCrud.limit,
      loading: contractsCrud.loading,
      setPage: handleSetPage,
      setLimit: handleSetLimit,
      refresh: refreshData
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
