
import { useStorage } from "@/contexts/storageContext";
import { useApi } from "@/contexts/apiContext";
import { StorageAdapter, StorageAdapterConfig, StorageAdapterFactory, StorageType } from "@/types/crud";
import { ApiRestAdapter } from "./adapters/ApiRestAdapter";
import { LocalStorageAdapter } from "./adapters/LocalStorageAdapter";
import { SupabaseAdapter } from "./adapters/SupabaseAdapter";

export class StorageAdapterFactoryImpl implements StorageAdapterFactory {
  private storageType: StorageType;
  private apiUrl?: string;

  constructor(storageType: StorageType, apiUrl?: string) {
    this.storageType = storageType;
    this.apiUrl = apiUrl;
    console.log("StorageAdapterFactory created with storage type:", storageType, "and API URL:", apiUrl);
  }

  getCurrentStorageType(): StorageType {
    return this.storageType;
  }

  createAdapter<T>(config: StorageAdapterConfig): StorageAdapter<T> {
    // Log qual adaptador está sendo criado
    console.log(`Creating adapter for type: ${this.storageType}, config:`, config);

    // Adequar a configuração ao tipo de armazenamento atual
    let adaptedConfig: StorageAdapterConfig;
    
    // Determinar o endpoint/storageKey/tableName 
    if (this.storageType === StorageType.ApiRest) {
      let resourceIdentifier: string;
      
      if (config.type === StorageType.Supabase) {
        resourceIdentifier = config.config.tableName;
      } else if (config.type === StorageType.LocalStorage) {
        resourceIdentifier = config.config.storageKey;
      } else { // apiRest
        resourceIdentifier = config.config.endpoint;
      }
      
      adaptedConfig = {
        type: StorageType.ApiRest,
        config: { 
          apiUrl: this.apiUrl || '',
          endpoint: resourceIdentifier
        }
      };
    } else {
      // Se não for apiRest, mantém a configuração original
      adaptedConfig = config;
    }

    // Criar o adaptador com base no tipo de armazenamento atual
    switch (this.storageType) {
      case StorageType.LocalStorage: 
        const storageKey = adaptedConfig.type === StorageType.LocalStorage 
          ? adaptedConfig.config.storageKey 
          : adaptedConfig.type === StorageType.Supabase 
            ? adaptedConfig.config.tableName 
            : adaptedConfig.config.endpoint;
            
        console.log(`Criando LocalStorageAdapter com chave: ${storageKey}`);
        return new LocalStorageAdapter<T>({ storageKey });
        
      case StorageType.Supabase:
        const tableName = adaptedConfig.type === StorageType.Supabase 
          ? adaptedConfig.config.tableName 
          : adaptedConfig.type === StorageType.LocalStorage 
            ? adaptedConfig.config.storageKey 
            : adaptedConfig.config.endpoint;
            
        console.log(`Criando SupabaseAdapter com tabela: ${tableName}`);
        return new SupabaseAdapter<T>({ tableName });
        
      case StorageType.ApiRest:
        if (!this.apiUrl) {
          console.warn('URL da API não configurada, usando localStorage como fallback');
          return new LocalStorageAdapter<T>({ storageKey: adaptedConfig.type === StorageType.LocalStorage 
            ? adaptedConfig.config.storageKey 
            : adaptedConfig.type === StorageType.Supabase 
              ? adaptedConfig.config.tableName 
              : adaptedConfig.config.endpoint });
        }
        
        const endpoint = adaptedConfig.type === StorageType.ApiRest 
          ? adaptedConfig.config.endpoint 
          : adaptedConfig.type === StorageType.Supabase 
            ? adaptedConfig.config.tableName 
            : adaptedConfig.config.storageKey;
            
        console.log(`Criando ApiRestAdapter com URL: ${this.apiUrl} e endpoint: ${endpoint}`);
        return new ApiRestAdapter<T>(this.apiUrl, endpoint);
    }
  }
}

// Hook para usar a fábrica de adaptadores
export const useStorageAdapterFactory = (): StorageAdapterFactory => {
  const { storageType } = useStorage();
  const { apiType, apiUrl } = useApi();
  
  // Determina o tipo de armazenamento com base nas configurações
  const currentStorageType: StorageType = 
    apiType === 'rest' ? StorageType.ApiRest : 
    storageType === 'supabase' ? StorageType.Supabase : StorageType.LocalStorage;
  
  console.log("useStorageAdapterFactory: currentStorageType =", currentStorageType, "apiType =", apiType, "apiUrl =", apiUrl);
  
  return new StorageAdapterFactoryImpl(currentStorageType, apiUrl);
};
