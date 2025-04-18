
/**
 * Interface genérica para operações CRUD básicas
 */
export interface CrudOperations<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: Omit<T, 'id'>): Promise<T | null>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Interface para o provedor de armazenamento
 */
export interface StorageProvider<T> extends CrudOperations<T> {
  storageType: 'localStorage' | 'supabase' | 'apiRest';
}

/**
 * Interface para adaptadores de armazenamento específicos
 */
export interface StorageAdapter<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: Omit<T, 'id'>): Promise<T | null>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Configuração para adaptador de localStorage
 */
export interface LocalStorageAdapterConfig {
  storageKey: string;
  mockData?: any[];
  idField?: string;
}

/**
 * Configuração para adaptador de API REST
 */
export interface ApiRestAdapterConfig {
  apiUrl: string;
  endpoint: string;
}

/**
 * Configuração para adaptador de Supabase
 */
export interface SupabaseAdapterConfig {
  tableName: string;
}

/**
 * Tipo de configuração de armazenamento unificada
 */
export type StorageAdapterConfig = 
  | { type: 'localStorage'; config: LocalStorageAdapterConfig }
  | { type: 'apiRest'; config: ApiRestAdapterConfig }
  | { type: 'supabase'; config: SupabaseAdapterConfig };

/**
 * Interface para o serviço de fábrica que cria adaptadores de armazenamento
 */
export interface StorageAdapterFactory {
  createAdapter<T>(config: StorageAdapterConfig): StorageAdapter<T>;
  getCurrentStorageType(): 'localStorage' | 'supabase' | 'apiRest';
}
