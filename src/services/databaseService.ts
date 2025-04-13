
import { supabase } from "@/integrations/supabase/client";
import { setupSupabaseDatabase } from "./migrationScripts";

export const databaseService = {
  async setupDatabase() {
    return await setupSupabaseDatabase();
  },

  async migrateLocalStorageToSupabase() {
    try {
      // Get kits from localStorage
      const storedKits = localStorage.getItem('kits');
      if (storedKits) {
        const kits = JSON.parse(storedKits);
        
        // Insert kits into Supabase
        for (const kit of kits) {
          const { error } = await supabase
            .from('kits')
            .upsert({
              id: kit.id,
              nome: kit.nome,
              descricao: kit.descricao,
              itens: kit.itens,
              preco: kit.preco,
              imagens: kit.imagens,
              vezes_alugado: kit.vezes_alugado
            })
            .single();
            
          if (error && error.code !== '23505') { // Ignore unique violation errors
            console.error('Error migrating kit:', error);
          }
        }
      }
      
      // Get thems from localStorage
      const storedThems = localStorage.getItem('temas');
      if (storedThems) {
        const thems = JSON.parse(storedThems);
        
        // Insert thems into Supabase
        for (const them of thems) {
          const { error } = await supabase
            .from('thems')
            .upsert({
              id: them.id,
              nome: them.nome,
              descricao: them.descricao,
              imagens: them.imagens,
              valorgasto: them.valorGasto, // Use valorgasto instead of valorGasto to match DB field
              vezes_alugado: them.vezes_alugado,
              kits_ids: them.kits.map((kit: any) => kit.id)
            })
            .single();
            
          if (error && error.code !== '23505') { // Ignore unique violation errors
            console.error('Error migrating them:', error);
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Failed to migrate localStorage to Supabase:', error);
      return false;
    }
  }
};
