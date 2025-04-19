
/* ---------------------------------------------
 * Interfaces e Tipos para Operações CRUD Genéricas
 * e Adaptação a diferentes provedores de dados
 * --------------------------------------------- */

// Enum para tipos de armazenamento disponíveis
export enum StorageType {
  LocalStorage = 'localStorage',
  Supabase = 'supabase',
  ApiRest = 'apiRest'
}

// Interface para resposta paginada
export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}

// Interface genérica para operações CRUD
export interface CrudOperations<T> {
  getAll: (page?: number, limit?: number) => Promise<PaginatedResponse<T>>;
  getById: (id: string) => Promise<T | null>;
  create: (item: Omit<T, 'id'>) => Promise<T | null>;
  update: (id: string, item: Partial<T>) => Promise<T | null>;
  delete: (id: string) => Promise<boolean>;
}

// Interface base para adaptadores de armazenamento
export interface StorageAdapter<T> extends CrudOperations<T> { }

// Interface para provedores com metadado de origem
export interface StorageProvider<T> extends StorageAdapter<T> {
  storageType: StorageType;
}

// Configurações específicas por tipo de armazenamento
export interface LocalStorageAdapterConfig {
  storageKey: string;
  mockData?: any[];
  idField?: string;
}

export interface ApiRestAdapterConfig {
  apiUrl: string;
  endpoint: string;
}

export interface SupabaseAdapterConfig {
  tableName: string;
}

// Tipo de configuração unificada para adaptadores
export type StorageAdapterConfig =
    | { type: StorageType.LocalStorage; config: LocalStorageAdapterConfig }
    | { type: StorageType.ApiRest; config: ApiRestAdapterConfig }
    | { type: StorageType.Supabase; config: SupabaseAdapterConfig };

// Interface para fábrica de adaptadores
export interface StorageAdapterFactory {
  createAdapter<T>(config: StorageAdapterConfig): StorageAdapter<T>;
  getCurrentStorageType(): StorageType;
}
