
import { supabase } from '@/integrations/supabase/client';

export const setupSupabaseDatabase = async () => {
  try {
    // Check if kits table exists
    const { count: kitsCount, error: kitsError } = await supabase
      .from('kits')
      .select('id', { count: 'exact', head: true });
    
    // If there's an error and it's because the table doesn't exist
    if (kitsError && kitsError.code === '42P01') {
      console.log('Creating kits table...');
      await createKitsTable();
    }

    // Check if thems table exists
    const { count: themsCount, error: themsError } = await supabase
      .from('thems')
      .select('id', { count: 'exact', head: true });
    
    // If there's an error and it's because the table doesn't exist
    if (themsError && themsError.code === '42P01') {
      console.log('Creating thems table...');
      await createThemsTable();
    }

    return true;
  } catch (error) {
    console.error('Error setting up Supabase database:', error);
    return false;
  }
};

const createKitsTable = async () => {
  try {
    // Create kits table with proper schema
    const { error } = await supabase.rpc('create_kits_table');
    
    if (error) {
      // If the RPC function doesn't exist, create the table manually
      await supabase.from('kits').insert({
        id: 'initial_entry',
        nome: 'Test Kit',
        descricao: 'Initial kit to create table',
        itens: [],
        preco: 0,
        imagens: [],
        vezes_alugado: 0
      });

      // Set permissions
      await setupTablePermissions('kits');
    }
    
    return true;
  } catch (error) {
    console.error('Error creating kits table:', error);
    return false;
  }
};

const createThemsTable = async () => {
  try {
    // Create thems table with proper schema
    const { error } = await supabase.rpc('create_thems_table');
    
    if (error) {
      // If the RPC function doesn't exist, create the table manually
      await supabase.from('thems').insert({
        id: 'initial_entry',
        nome: 'Test Theme',
        descricao: 'Initial theme to create table',
        imagens: [],
        valorGasto: 0,
        vezes_alugado: 0,
        kits_ids: []
      });

      // Set permissions
      await setupTablePermissions('thems');
    }
    
    return true;
  } catch (error) {
    console.error('Error creating thems table:', error);
    return false;
  }
};

// Set up permissions for the table
const setupTablePermissions = async (tableName: string) => {
  try {
    // Since we can't create policies directly through the JS client,
    // we'll just log a reminder for the user
    console.log(`Remember to set up Row Level Security policies for the ${tableName} table in the Supabase dashboard.`);
    return true;
  } catch (error) {
    console.error(`Error setting permissions for ${tableName} table:`, error);
    return false;
  }
};
