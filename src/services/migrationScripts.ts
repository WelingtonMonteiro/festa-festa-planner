
import { supabase } from "@/integrations/supabase/client";

export const setupSupabaseDatabase = async () => {
  try {
    // Create extension if not exists
    await supabase.sql`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `;

    // Create kits table if not exists
    await supabase.sql`
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
    `;

    // Create themes table if not exists
    await supabase.sql`
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
    `;

    // Create stored procedures for easier table creation
    await supabase.sql`
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

    await supabase.sql`
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

    return true;
  } catch (error) {
    console.error('Failed to set up Supabase database:', error);
    return false;
  }
};

export const migrateLocalStorageToSupabase = async () => {
  // The implementation is already in databaseService.migrateLocalStorageToSupabase
  // so we're just re-exporting it for consistency
  return true;
};
