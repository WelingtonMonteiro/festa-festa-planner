
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Contract, ContractTemplate, Message } from '../../types';
import { toast } from 'sonner';

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
}

const ContractsContext = createContext<ContractsContextType | undefined>(undefined);

export const ContractsProvider: React.FC<{ 
  children: React.ReactNode,
  onAddMessage?: (message: Omit<Message, 'id' | 'datahora'>) => void 
}> = ({ children, onAddMessage }) => {
  const [contratos, setContratos] = useState<Contract[]>([]);
  const [modelosContrato, setModelosContrato] = useState<ContractTemplate[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Inicialização
  useEffect(() => {
    const loadData = () => {
      const loadedContratos = localStorage.getItem('contratos');
      const loadedModelosContrato = localStorage.getItem('modelosContrato');
      
      setContratos(loadedContratos ? JSON.parse(loadedContratos) : []);
      setModelosContrato(loadedModelosContrato ? JSON.parse(loadedModelosContrato) : []);
      setIsInitialized(true);
    };
    
    loadData();
  }, []);
  
  // Persistência
  useEffect(() => {
    if (!isInitialized) return;
    
    if (contratos.length) {
      localStorage.setItem('contratos', JSON.stringify(contratos));
    }
    
    if (modelosContrato.length) {
      localStorage.setItem('modelosContrato', JSON.stringify(modelosContrato));
    }
  }, [contratos, modelosContrato, isInitialized]);
  
  const adicionarModeloContrato = (modelo: Omit<ContractTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const novoModelo: ContractTemplate = {
      ...modelo,
      id: `ct${Date.now().toString()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setModelosContrato([...modelosContrato, novoModelo]);
    toast.success(`${modelo.name} foi adicionado com sucesso.`);
    return novoModelo;
  };
  
  const atualizarModeloContrato = (id: string, modeloAtualizado: Partial<ContractTemplate>) => {
    setModelosContrato(modelosContrato.map(m => 
      m.id === id ? { ...m, ...modeloAtualizado, updatedAt: new Date().toISOString() } : m
    ));
    toast.success("O modelo de contrato foi atualizado com sucesso.");
  };
  
  const excluirModeloContrato = (id: string) => {
    const modeloEmUso = contratos.some(c => c.templateId === id);
    if (modeloEmUso) {
      toast.error("Este modelo está associado a contratos e não pode ser excluído.");
      return;
    }
    
    const modeloRemovido = modelosContrato.find(m => m.id === id);
    setModelosContrato(modelosContrato.filter(m => m.id !== id));
    
    if (modeloRemovido) {
      toast.success(`${modeloRemovido.name} foi removido com sucesso.`);
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
    toast.success(`${contrato.title} foi adicionado com sucesso.`);
    return novoContrato;
  };
  
  const atualizarContrato = (id: string, contratoAtualizado: Partial<Contract>) => {
    setContratos(contratos.map(c => 
      c.id === id ? { ...c, ...contratoAtualizado, updatedAt: new Date().toISOString() } : c
    ));
    toast.success("O contrato foi atualizado com sucesso.");
  };
  
  const excluirContrato = (id: string) => {
    const contratoRemovido = contratos.find(c => c.id === id);
    setContratos(contratos.filter(c => c.id !== id));
    
    if (contratoRemovido) {
      toast.success(`${contratoRemovido.title} foi removido com sucesso.`);
    }
  };
  
  const enviarContratoParaCliente = (contractId: string, clientId: string) => {
    const contrato = contratos.find(c => c.id === contractId);
    
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
    
    atualizarContrato(contractId, { status: 'sent' });
    
    toast.success("O contrato foi enviado para o cliente com sucesso.");
  };
  
  const assinarContrato = (contractId: string, signatureUrl: string) => {
    const contrato = contratos.find(c => c.id === contractId);
    
    if (!contrato) {
      toast.error("Contrato não encontrado.");
      return;
    }
    
    atualizarContrato(contractId, {
      status: 'signed',
      signatureUrl,
      signedAt: new Date().toISOString()
    });
    
    toast.success("O contrato foi assinado com sucesso.");
  };
  
  return (
    <ContractsContext.Provider value={{
      contracts: contratos,
      contractTemplates: modelosContrato,
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
