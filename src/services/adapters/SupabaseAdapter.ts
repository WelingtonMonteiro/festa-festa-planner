
import { supabase } from "@/integrations/supabase/client";
import { SupabaseAdapterConfig, StorageAdapter } from "@/types/crud";
import { toast } from "sonner";

export class SupabaseAdapter<T extends Record<string, any>> implements StorageAdapter<T> {
  private tableName: string;

  constructor(config: SupabaseAdapterConfig) {
    this.tableName = config.tableName;
  }

  async getAll(): Promise<T[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return (data || []) as T[];
    } catch (error) {
      console.error(`Falha ao buscar dados do Supabase (${this.tableName}):`, error);
      toast.error(`Falha ao carregar dados de ${this.tableName}`);
      return [];
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
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

  async create(item: Omit<T, 'id'>): Promise<T | null> {
    try {
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

  async update(id: string, item: Partial<T>): Promise<T | null> {
    try {
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

  async delete(id: string): Promise<boolean> {
    try {
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
