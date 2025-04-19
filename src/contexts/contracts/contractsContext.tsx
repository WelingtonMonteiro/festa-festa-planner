
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Contract, ContractTemplate, Message } from '../../types';
import { toast } from 'sonner';
import { useCrud } from '@/hooks/useCrud';

interface ContractsContextType {
  contracts: Contract[];
  contractTemplates: ContractTemplate[];
  
  addContractTemplate: (template: Omit<ContractTemplate, 'id' | 'createdAt' | 'updatedAt'>) => ContractTemplate;
  updateContractTemplate: (id: string, template: Partial<ContractTemplate>) => void;
  removeContractTemplate: (id: string) => void;
  
  addContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => Contract;
  updateContract: (id: string, contract: Partial<Contract>) => void;
  removeContract: (id: string) => void;
  sendContractToClient: (contractId: string, clientId: string) => void;
  signContract: (contractId: string, signatureUrl: string) => void;
  
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  refresh: () => void;
}

const ContractsContext = createContext<ContractsContextType | undefined>(undefined);

export const ContractsProvider: React.FC<{ 
  children: React.ReactNode,
  onAddMessage?: (message: Omit<Message, 'id' | 'datahora'>) => void 
}> = ({ children, onAddMessage }) => {
  // Use CRUD hook for contracts
  const contractsCrud = useCrud<Contract>({
    type: 'apiRest',
    config: {
      apiUrl: import.meta.env.VITE_APP_API_URL || '',
      endpoint: 'contracts'
    }
  });

  // Use CRUD hook for templates
  const templatesCrud = useCrud<ContractTemplate>({
    type: 'apiRest',
    config: {
      apiUrl: import.meta.env.VITE_APP_API_URL || '',
      endpoint: 'contractTemplates'
    }
  });
  
  useEffect(() => {
    // Initialize data
    contractsCrud.refresh();
    templatesCrud.refresh();
  }, []);
  
  const adicionarModeloContrato = async (modelo: Omit<ContractTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const novoModelo: Omit<ContractTemplate, 'id'> = {
      ...modelo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const resultado = await templatesCrud.create(novoModelo);
    
    if (resultado) {
      toast.success(`${modelo.name} foi adicionado com sucesso.`);
      return resultado;
    } else {
      toast.error('Erro ao adicionar modelo de contrato.');
      // Return a default template to prevent errors
      return {
        ...novoModelo,
        id: `error-${Date.now()}`
      } as ContractTemplate;
    }
  };
  
  const atualizarModeloContrato = async (id: string, modeloAtualizado: Partial<ContractTemplate>) => {
    const updated = await templatesCrud.update(id, {
      ...modeloAtualizado,
      updatedAt: new Date().toISOString()
    });
    
    if (updated) {
      toast.success("O modelo de contrato foi atualizado com sucesso.");
    } else {
      toast.error("Erro ao atualizar modelo de contrato.");
    }
  };
  
  const excluirModeloContrato = async (id: string) => {
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
  };
  
  const adicionarContrato = async (contrato: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => {
    const novoContrato: Omit<Contract, 'id'> = {
      ...contrato,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const resultado = await contractsCrud.create(novoContrato);
    
    if (resultado) {
      toast.success(`${contrato.title} foi adicionado com sucesso.`);
      return resultado;
    } else {
      toast.error('Erro ao adicionar contrato.');
      // Return a default contract to prevent errors
      return {
        ...novoContrato,
        id: `error-${Date.now()}`
      } as Contract;
    }
  };
  
  const atualizarContrato = async (id: string, contratoAtualizado: Partial<Contract>) => {
    const updated = await contractsCrud.update(id, {
      ...contratoAtualizado,
      updatedAt: new Date().toISOString()
    });
    
    if (updated) {
      toast.success("O contrato foi atualizado com sucesso.");
    } else {
      toast.error("Erro ao atualizar contrato.");
    }
  };
  
  const excluirContrato = async (id: string) => {
    const contratoRemovido = contractsCrud.data.find(c => c.id === id);
    const resultado = await contractsCrud.remove(id);
    
    if (resultado && contratoRemovido) {
      toast.success(`${contratoRemovido.title} foi removido com sucesso.`);
    } else {
      toast.error("Erro ao remover contrato.");
    }
  };
  
  const enviarContratoParaCliente = async (contractId: string, clientId: string) => {
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
  };
  
  const assinarContrato = async (contractId: string, signatureUrl: string) => {
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
  };
  
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
      setPage: (page) => contractsCrud.refresh(page, contractsCrud.limit),
      setLimit: (limit) => contractsCrud.refresh(1, limit),
      refresh: () => contractsCrud.refresh()
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
