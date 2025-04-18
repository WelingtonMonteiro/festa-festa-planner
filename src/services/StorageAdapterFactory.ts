
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
  }

  getCurrentStorageType(): 'localStorage' | 'supabase' | 'apiRest' {
    return this.storageType;
  }

  createAdapter<T>(config: StorageAdapterConfig): StorageAdapter<T> {
    // Sobrescrever o tipo de configuração passado pelo tipo de armazenamento atual
    switch (this.storageType) {
      case 'localStorage': 
        if (config.type !== 'localStorage') {
          console.warn('Usando localStorage em vez do tipo de armazenamento configurado');
        }
        return new LocalStorageAdapter<T>(
          config.type === 'localStorage' ? config.config : {
            storageKey: config.type === 'supabase' 
              ? config.config.tableName 
              : config.config.endpoint
          }
        );
        
      case 'supabase':
        if (config.type !== 'supabase') {
          console.warn('Usando Supabase em vez do tipo de armazenamento configurado');
        }
        return new SupabaseAdapter<T>(
          config.type === 'supabase' ? config.config : {
            tableName: config.type === 'localStorage' 
              ? config.config.storageKey 
              : config.config.endpoint
          }
        );
        
      case 'apiRest':
        if (!this.apiUrl) {
          console.warn('URL da API não configurada, usando localStorage');
          return new LocalStorageAdapter<T>(
            config.type === 'localStorage' ? config.config : {
              storageKey: config.type === 'supabase' 
                ? config.config.tableName 
                : config.config.endpoint
            }
          );
        }
        
        if (config.type !== 'apiRest') {
          console.warn('Usando API REST em vez do tipo de armazenamento configurado');
        }
        
        return new ApiRestAdapter<T>({
          apiUrl: this.apiUrl,
          endpoint: config.type === 'apiRest' ? config.config.endpoint : 
                    config.type === 'supabase' ? config.config.tableName : 
                    config.config.storageKey
        });
    }
  }
}

// Hook para usar a fábrica de adaptadores
export const useStorageAdapterFactory = (): StorageAdapterFactory => {
  const { storageType } = useStorage();
  const { apiType, apiUrl } = useApi();
  
  const currentStorageType: 'localStorage' | 'supabase' | 'apiRest' = 
    apiType === 'rest' ? 'apiRest' : storageType;
  
  return new StorageAdapterFactoryImpl(currentStorageType, apiUrl);
};
