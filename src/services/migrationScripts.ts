
import { supabase } from "@/integrations/supabase/client";

export const setupSupabaseDatabase = async () => {
  try {
    // Create kits table if not exists
    const { error: kitsError } = await supabase
      .from('kits')
      .select('id')
      .limit(1)
      .maybeSingle();
      
    if (kitsError && kitsError.code === '42P01') { // Table doesn't exist
      // Create table
      await supabase.rpc('create_kits_table');
    }
    
    // Create thems table if not exists
    const { error: themsError } = await supabase
      .from('thems')
      .select('id')
      .limit(1)
      .maybeSingle();
      
    if (themsError && themsError.code === '42P01') { // Table doesn't exist
      // Create table
      await supabase.rpc('create_thems_table');
    }
    
    // Create stored procedures if they don't exist
    await createStoredProcedures();

    return true;
  } catch (error) {
    console.error('Failed to set up Supabase database:', error);
    return false;
  }
};

const createStoredProcedures = async () => {
  try {
    // Test if the function exists by calling it
    const { error: fnError } = await supabase.rpc('create_kits_table');
    
    // If function doesn't exist, create it
    if (fnError && fnError.message.includes('does not exist')) {
      // We can't use SQL directly with Supabase client in browser
      // Instead, we'll need to create these functions via Supabase dashboard
      console.warn('Please create the stored procedures manually in the Supabase dashboard');
    }
    
    return true;
  } catch (error) {
    console.error('Failed to create stored procedures:', error);
    return false;
  }
};

export const migrateLocalStorageToSupabase = async () => {
  try {
    // Get kits from localStorage
    const storedKits = localStorage.getItem('kits');
    if (storedKits) {
      const kits = JSON.parse(storedKits);
      
      // Insert kits into Supabase
      for (const kit of kits) {
        const { error } = await supabase
          .from('kits')
          .insert({
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
          .insert({
            id: them.id,
            nome: them.nome,
            descricao: them.descricao,
            imagens: them.imagens,
            valorGasto: them.valorGasto,
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
};
