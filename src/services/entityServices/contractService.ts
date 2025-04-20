
import { Contract, ContractTemplate } from "@/types";
import { CrudOperations, StorageType } from "@/types/crud";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";
import { useApi } from "@/contexts/apiContext";

// Interface para operações específicas de contratos
interface ContractService extends CrudOperations<Contract> {
  getDraftContracts: () => Promise<Contract[]>;
  getSentContracts: () => Promise<Contract[]>;
  getSignedContracts: () => Promise<Contract[]>;
  sendToClient: (contractId: string, clientId: string) => Promise<Contract | null>;
  signContract: (contractId: string, signatureUrl: string) => Promise<Contract | null>;
}

// Interface para operações específicas de templates de contratos
interface ContractTemplateService extends CrudOperations<ContractTemplate> {
  getActiveTemplates: () => Promise<ContractTemplate[]>;
  duplicateTemplate: (templateId: string) => Promise<ContractTemplate | null>;
}

// Serviço de contratos
export const useContractService = (): ContractService => {
  const factory = useStorageAdapterFactory();
  const { apiUrl } = useApi();
  
  const crudService = createCrudService<Contract>(factory, {
    type: StorageType.ApiRest,
    config: { 
      apiUrl: apiUrl || '',
      endpoint: 'contracts' 
    }
  });

  const getDraftContracts = async (): Promise<Contract[]> => {
    const response = await crudService.getAll();
    return response.data.filter(contract => contract.status === 'draft');
  };

  const getSentContracts = async (): Promise<Contract[]> => {
    const response = await crudService.getAll();
    return response.data.filter(contract => contract.status === 'sent');
  };

  const getSignedContracts = async (): Promise<Contract[]> => {
    const response = await crudService.getAll();
    return response.data.filter(contract => contract.status === 'signed');
  };

  const sendToClient = async (contractId: string, clientId: string): Promise<Contract | null> => {
    const contract = await crudService.getById(contractId);
    if (!contract) return null;
    
    return crudService.update(contractId, {
      clientId,
      status: 'sent',
      sentAt: new Date().toISOString()
    });
  };

  const signContract = async (contractId: string, signatureUrl: string): Promise<Contract | null> => {
    return crudService.update(contractId, {
      status: 'signed',
      signatureUrl,
      signedAt: new Date().toISOString()
    });
  };

  return {
    ...crudService,
    getDraftContracts,
    getSentContracts,
    getSignedContracts,
    sendToClient,
    signContract
  };
};

// Serviço de templates de contratos
export const useContractTemplateService = (): ContractTemplateService => {
  const factory = useStorageAdapterFactory();
  const { apiUrl } = useApi();
  
  const crudService = createCrudService<ContractTemplate>(factory, {
    type: StorageType.ApiRest,
    config: { 
      apiUrl: apiUrl || '',
      endpoint: 'contractTemplates' 
    }
  });

  const getActiveTemplates = async (): Promise<ContractTemplate[]> => {
    const response = await crudService.getAll();
    return response.data;
  };

  const duplicateTemplate = async (templateId: string): Promise<ContractTemplate | null> => {
    const template = await crudService.getById(templateId);
    if (!template) return null;
    
    const { id, createdAt, updatedAt, ...templateData } = template;
    const newTemplate = {
      ...templateData,
      name: `${template.name} (Cópia)`,
    };
    
    return crudService.create(newTemplate);
  };

  return {
    ...crudService,
    getActiveTemplates,
    duplicateTemplate
  };
};
