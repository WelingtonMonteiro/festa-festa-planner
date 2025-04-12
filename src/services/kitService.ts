
import { supabase } from "@/integrations/supabase/client";
import { Kit } from "@/types";
import { KitRecord, kitFromRecord } from "@/types/supabase";
import { toast } from "sonner";

export const kitService = {
  async getAll(): Promise<Kit[]> {
    try {
      const { data, error } = await supabase
        .from('kits')
        .select('*');
      
      if (error) {
        console.error('Error fetching kits:', error);
        throw error;
      }
      
      const kits = (data || []).map(kitFromRecord);
      return kits;
    } catch (error) {
      console.error('Failed to fetch kits:', error);
      toast.error('Falha ao buscar kits do Supabase');
      return [];
    }
  },
  
  async getById(id: string): Promise<Kit | null> {
    try {
      const { data, error } = await supabase
        .from('kits')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching kit:', error);
        return null;
      }
      
      return kitFromRecord(data);
    } catch (error) {
      console.error('Failed to fetch kit by id:', error);
      toast.error('Falha ao buscar kit do Supabase');
      return null;
    }
  },
  
  async create(kit: Omit<Kit, 'id' | 'vezes_alugado'>): Promise<Kit | null> {
    try {
      const newKit: Omit<KitRecord, 'id' | 'created_at'> = {
        nome: kit.nome,
        descricao: kit.descricao,
        itens: kit.itens,
        preco: kit.preco,
        imagens: kit.imagens,
        vezes_alugado: 0
      };
      
      const { data, error } = await supabase
        .from('kits')
        .insert([newKit])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating kit:', error);
        toast.error('Falha ao criar kit no Supabase');
        return null;
      }
      
      return kitFromRecord(data);
    } catch (error) {
      console.error('Failed to create kit:', error);
      toast.error('Falha ao criar kit no Supabase');
      return null;
    }
  },
  
  async update(id: string, kit: Partial<Kit>): Promise<Kit | null> {
    try {
      const { data, error } = await supabase
        .from('kits')
        .update({
          nome: kit.nome,
          descricao: kit.descricao,
          itens: kit.itens,
          preco: kit.preco,
          imagens: kit.imagens,
          vezes_alugado: kit.vezes_alugado
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating kit:', error);
        toast.error('Falha ao atualizar kit no Supabase');
        return null;
      }
      
      return kitFromRecord(data);
    } catch (error) {
      console.error('Failed to update kit:', error);
      toast.error('Falha ao atualizar kit no Supabase');
      return null;
    }
  },
  
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('kits')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting kit:', error);
        toast.error('Falha ao remover kit do Supabase');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to delete kit:', error);
      toast.error('Falha ao remover kit do Supabase');
      return false;
    }
  },

  async createTables() {
    try {
      // Check if the table already exists
      const { error: checkError } = await supabase
        .from('kits')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') { // Table doesn't exist
        // Create the table via RPC
        const { error } = await supabase.rpc('create_kits_table');
        
        if (error) {
          console.error('Error creating kits table:', error);
          return false;
        }
        
        toast.success('Tabela de kits criada com sucesso');
        return true;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to create kits table:', error);
      return false;
    }
  }
};
