
import { supabase } from "@/integrations/supabase/client";
import { SupabaseAdapterConfig, StorageAdapter, PaginatedResponse } from "@/types/crud";
import { toast } from "sonner";

export class SupabaseAdapter<T extends Record<string, any>> implements StorageAdapter<T> {
  private tableName: string;

  constructor(config: SupabaseAdapterConfig) {
    this.tableName = config.tableName;
  }

  async getAll(page: number = 1, limit: number = 10, headers?: HeadersInit): Promise<PaginatedResponse<T>> {
    try {
      // Headers não são usados no Supabase, mas mantidos na assinatura para compatibilidade
      
      // First, get the total count
      const { count, error: countError } = await supabase
        .from(this.tableName as any)
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      // Calculate pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      // Get paginated data
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .range(from, to)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return {
        data: (data || []) as unknown as T[],
        total: count || 0,
        page,
        limit
      };
    } catch (error) {
      console.error(`Falha ao buscar dados do Supabase (${this.tableName}):`, error);
      toast.error(`Falha ao carregar dados de ${this.tableName}`);
      return {
        data: [],
        total: 0,
        page,
        limit
      };
    }
  }

  async getById(id: string, headers?: HeadersInit): Promise<T | null> {
    try {
      // Headers não são usados no Supabase, mas mantidos na assinatura para compatibilidade
      
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .eq('id', id)
        .single();
          
      if (error) throw error;
      return data as unknown as T;
    } catch (error) {
      console.error(`Falha ao buscar item do Supabase (${this.tableName}):`, error);
      toast.error(`Falha ao buscar dado de ${this.tableName}`);
      return null;
    }
  }

  async create(item: Omit<T, 'id'>, headers?: HeadersInit): Promise<T | null> {
    try {
      // Headers não são usados no Supabase, mas mantidos na assinatura para compatibilidade
      
      const { data, error } = await supabase
        .from(this.tableName as any)
        .insert([item as any])
        .select()
        .single();
          
      if (error) throw error;
      return data as unknown as T;
    } catch (error) {
      console.error(`Falha ao criar item no Supabase (${this.tableName}):`, error);
      toast.error(`Falha ao criar item em ${this.tableName}`);
      return null;
    }
  }

  async update(id: string, item: Partial<T>, headers?: HeadersInit): Promise<T | null> {
    try {
      // Headers não são usados no Supabase, mas mantidos na assinatura para compatibilidade
      
      const { data, error } = await supabase
        .from(this.tableName as any)
        .update(item as any)
        .eq('id', id)
        .select()
        .single();
          
      if (error) throw error;
      return data as unknown as T;
    } catch (error) {
      console.error(`Falha ao atualizar item no Supabase (${this.tableName}):`, error);
      toast.error(`Falha ao atualizar item em ${this.tableName}`);
      return null;
    }
  }

  async delete(id: string, headers?: HeadersInit): Promise<boolean> {
    try {
      // Headers não são usados no Supabase, mas mantidos na assinatura para compatibilidade
      
      const { error } = await supabase
        .from(this.tableName as any)
        .delete()
        .eq('id', id);
          
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Falha ao remover item do Supabase (${this.tableName}):`, error);
      toast.error(`Falha ao remover item de ${this.tableName}`);
      return false;
    }
  }
}
