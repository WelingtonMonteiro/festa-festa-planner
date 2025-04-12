
import { supabase } from "@/integrations/supabase/client";

export const databaseService = {
  async setupDatabase() {
    // Create SQL function for kits table if not exists
    await supabase.rpc('create_kits_table').catch(error => {
      // If function doesn't exist, create it
      if (error.message.includes('does not exist')) {
        return supabase.sql`
          CREATE OR REPLACE FUNCTION create_kits_table()
          RETURNS void AS $$
          BEGIN
            CREATE TABLE IF NOT EXISTS kits (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              nome TEXT NOT NULL,
              descricao TEXT NOT NULL,
              itens TEXT[] NOT NULL DEFAULT '{}',
              preco NUMERIC NOT NULL DEFAULT 0,
              imagens TEXT[] NOT NULL DEFAULT '{}',
              vezes_alugado INTEGER NOT NULL DEFAULT 0,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          END;
          $$ LANGUAGE plpgsql;
        `;
      }
    });

    // Create SQL function for thems table if not exists
    await supabase.rpc('create_thems_table').catch(error => {
      // If function doesn't exist, create it
      if (error.message.includes('does not exist')) {
        return supabase.sql`
          CREATE OR REPLACE FUNCTION create_thems_table()
          RETURNS void AS $$
          BEGIN
            CREATE TABLE IF NOT EXISTS thems (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              nome TEXT NOT NULL,
              descricao TEXT NOT NULL,
              imagens TEXT[] NOT NULL DEFAULT '{}',
              valorGasto NUMERIC NOT NULL DEFAULT 0,
              vezes_alugado INTEGER NOT NULL DEFAULT 0,
              kits_ids TEXT[] NOT NULL DEFAULT '{}',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          END;
          $$ LANGUAGE plpgsql;
        `;
      }
    });

    // Create the tables
    await supabase.rpc('create_kits_table').catch(console.error);
    await supabase.rpc('create_thems_table').catch(console.error);
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
            .insert([{
              id: kit.id,
              nome: kit.nome,
              descricao: kit.descricao,
              itens: kit.itens,
              preco: kit.preco,
              imagens: kit.imagens,
              vezes_alugado: kit.vezes_alugado
            }]);
          
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
            .insert([{
              id: them.id,
              nome: them.nome,
              descricao: them.descricao,
              imagens: them.imagens,
              valorGasto: them.valorGasto,
              vezes_alugado: them.vezes_alugado,
              kits_ids: them.kits.map((kit: any) => kit.id)
            }]);
          
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
