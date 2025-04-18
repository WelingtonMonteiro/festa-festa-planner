
import { useStorage } from "@/contexts/storageContext";
import { useApi } from "@/contexts/apiContext";
import { StorageAdapter, StorageAdapterConfig, StorageAdapterFactory } from "@/types/crud";
import { ApiRestAdapter } from "./adapters/ApiRestAdapter";
import { LocalStorageAdapter } from "./adapters/LocalStorageAdapter";
import { SupabaseAdapter } from "./adapters/SupabaseAdapter";

export class StorageAdapterFactoryImpl implements StorageAdapterFactory {
  private storageType: 'localStorage' | 'supabase' | 'apiRest';
  private apiUrl?: string;

  constructor(storageType: 'localStorage' | 'supabase' | 'apiRest', apiUrl?: string) {
    this.storageType = storageType;
    this.apiUrl = apiUrl;
    console.log("StorageAdapterFactory created with storage type:", storageType, "and API URL:", apiUrl);
  }

  getCurrentStorageType(): 'localStorage' | 'supabase' | 'apiRest' {
    return this.storageType;
  }

  createAdapter<T>(config: StorageAdapterConfig): StorageAdapter<T> {
    // Log qual adaptador está sendo criado
    console.log(`Creating adapter for type: ${this.storageType}, config:`, config);

    // Adequar a configuração ao tipo de armazenamento atual
    let adaptedConfig: StorageAdapterConfig;
    
    // Determinar o endpoint/storageKey/tableName 
    if (this.storageType === 'apiRest') {
      let resourceIdentifier: string;
      
      if (config.type === 'supabase') {
        resourceIdentifier = config.config.tableName;
      } else if (config.type === 'localStorage') {
        resourceIdentifier = config.config.storageKey;
      } else { // apiRest
        resourceIdentifier = config.config.endpoint;
      }
      
      adaptedConfig = {
        type: 'apiRest',
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
      case 'localStorage': 
        const storageKey = adaptedConfig.type === 'localStorage' 
          ? adaptedConfig.config.storageKey 
          : adaptedConfig.type === 'supabase' 
            ? adaptedConfig.config.tableName 
            : adaptedConfig.config.endpoint;
            
        console.log(`Criando LocalStorageAdapter com chave: ${storageKey}`);
        return new LocalStorageAdapter<T>({ storageKey });
        
      case 'supabase':
        const tableName = adaptedConfig.type === 'supabase' 
          ? adaptedConfig.config.tableName 
          : adaptedConfig.type === 'localStorage' 
            ? adaptedConfig.config.storageKey 
            : adaptedConfig.config.endpoint;
            
        console.log(`Criando SupabaseAdapter com tabela: ${tableName}`);
        return new SupabaseAdapter<T>({ tableName });
        
      case 'apiRest':
        if (!this.apiUrl) {
          console.warn('URL da API não configurada, usando localStorage como fallback');
          return new LocalStorageAdapter<T>({ storageKey: adaptedConfig.type === 'localStorage' 
            ? adaptedConfig.config.storageKey 
            : adaptedConfig.type === 'supabase' 
              ? adaptedConfig.config.tableName 
              : adaptedConfig.config.endpoint });
        }
        
        const endpoint = adaptedConfig.type === 'apiRest' 
          ? adaptedConfig.config.endpoint 
          : adaptedConfig.type === 'supabase' 
            ? adaptedConfig.config.tableName 
            : adaptedConfig.config.storageKey;
            
        console.log(`Criando ApiRestAdapter com URL: ${this.apiUrl} e endpoint: ${endpoint}`);
        return new ApiRestAdapter<T>({
          apiUrl: this.apiUrl,
          endpoint
        });
    }
  }
}

// Hook para usar a fábrica de adaptadores
export const useStorageAdapterFactory = (): StorageAdapterFactory => {
  const { storageType } = useStorage();
  const { apiType, apiUrl } = useApi();
  
  // Determina o tipo de armazenamento com base nas configurações
  const currentStorageType: 'localStorage' | 'supabase' | 'apiRest' = 
    apiType === 'rest' ? 'apiRest' : storageType;
  
  console.log("useStorageAdapterFactory: currentStorageType =", currentStorageType, "apiType =", apiType, "apiUrl =", apiUrl);
  
  return new StorageAdapterFactoryImpl(currentStorageType, apiUrl);
};
