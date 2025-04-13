
import { supabase } from "@/integrations/supabase/client";
import { Them, Kit } from "@/types";
import { ThemRecord, themFromRecord } from "@/types/supabase";
import { toast } from "sonner";

export const themService = {
  async getAll(allKits: Kit[]): Promise<Them[]> {
    try {
      const { data, error } = await supabase
        .from('thems')
        .select('*');
      
      if (error) {
        console.error('Error fetching thems:', error);
        throw error;
      }
      
      const thems = (data || []).map(record => themFromRecord(record, allKits));
      return thems;
    } catch (error) {
      console.error('Failed to fetch thems:', error);
      toast.error('Falha ao buscar temas do Supabase');
      return [];
    }
  },
  
  async getById(id: string, allKits: Kit[]): Promise<Them | null> {
    try {
      const { data, error } = await supabase
        .from('thems')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching them:', error);
        return null;
      }
      
      return themFromRecord(data, allKits);
    } catch (error) {
      console.error('Failed to fetch them by id:', error);
      toast.error('Falha ao buscar tema do Supabase');
      return null;
    }
  },
  
  async create(them: Omit<Them, 'id' | 'vezes_alugado'>, allKits: Kit[]): Promise<Them | null> {
    try {
      // Get kit ids from the kits array
      const kits_ids = them.kits.map(kit => kit.id);
      
      const newThem: any = {
        nome: them.nome,
        descricao: them.descricao,
        imagens: them.imagens,
        valorgasto: them.valorGasto, // Use valorgasto instead of valorGasto to match DB field
        vezes_alugado: 0,
        kits_ids: kits_ids
      };
      
      const { data, error } = await supabase
        .from('thems')
        .insert([newThem])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating them:', error);
        toast.error('Falha ao criar tema no Supabase');
        return null;
      }
      
      return themFromRecord(data, allKits);
    } catch (error) {
      console.error('Failed to create them:', error);
      toast.error('Falha ao criar tema no Supabase');
      return null;
    }
  },
  
  async update(id: string, them: Partial<Them>, allKits: Kit[]): Promise<Them | null> {
    try {
      // Calculate which values to update
      const updateData: any = {
        nome: them.nome,
        descricao: them.descricao,
        imagens: them.imagens,
        valorgasto: them.valorGasto, // Use valorgasto instead of valorGasto to match DB field
        vezes_alugado: them.vezes_alugado
      };
      
      // If kits are provided, update kits_ids
      if (them.kits) {
        updateData.kits_ids = them.kits.map(kit => kit.id);
      }
      
      const { data, error } = await supabase
        .from('thems')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating them:', error);
        toast.error('Falha ao atualizar tema no Supabase');
        return null;
      }
      
      return themFromRecord(data, allKits);
    } catch (error) {
      console.error('Failed to update them:', error);
      toast.error('Falha ao atualizar tema no Supabase');
      return null;
    }
  },
  
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('thems')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting them:', error);
        toast.error('Falha ao remover tema do Supabase');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to delete them:', error);
      toast.error('Falha ao remover tema do Supabase');
      return false;
    }
  },

  async createTables() {
    try {
      // Check if the table already exists
      const { error: checkError } = await supabase
        .from('thems')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') { // Table doesn't exist
        // Create the table via RPC
        const { error } = await supabase.rpc('create_thems_table');
        
        if (error) {
          console.error('Error creating thems table:', error);
          return false;
        }
        
        toast.success('Tabela de temas criada com sucesso');
        return true;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to create thems table:', error);
      return false;
    }
  }
};
