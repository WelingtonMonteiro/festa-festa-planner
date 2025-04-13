
// Custom Supabase types for our application
import { Kit, Them } from './index';
import { Database as GeneratedDatabase } from '@/integrations/supabase/types';

// Reuse the generated types from Supabase to ensure compatibility
export type Database = GeneratedDatabase;

export interface KitRecord {
  id: string;
  nome: string;
  descricao: string;
  itens: string[];
  preco: number;
  imagens: string[];
  vezes_alugado: number;
  created_at?: string;
}

export interface ThemRecord {
  id: string;
  nome: string;
  descricao: string;
  imagens: string[];
  valorGasto: number;
  vezes_alugado: number;
  kits_ids: string[]; // We'll store references to kits
  created_at?: string;
}

// Convert from database model to application model
export const kitFromRecord = (record: KitRecord): Kit => {
  return {
    id: record.id,
    nome: record.nome,
    descricao: record.descricao,
    itens: record.itens,
    preco: record.preco,
    imagens: record.imagens,
    vezes_alugado: record.vezes_alugado
  };
};

export const themFromRecord = (record: any, allKits: Kit[]): Them => {
  // Find all kits that are referenced by this theme
  const kits = allKits.filter(kit => record.kits_ids.includes(kit.id));
  
  return {
    id: record.id,
    nome: record.nome,
    descricao: record.descricao,
    imagens: record.imagens,
    valorGasto: record.valorgasto || 0, // Map DB field 'valorgasto' to 'valorGasto'
    vezes_alugado: record.vezes_alugado,
    kits: kits
  };
};
