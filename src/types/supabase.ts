
// Custom Supabase types for our application
import { Kit, Them } from './index';

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

// Extended Database type definition for Supabase
export interface Database {
  public: {
    Tables: {
      kits: {
        Row: KitRecord;
        Insert: Omit<KitRecord, "id" | "created_at">;
        Update: Partial<Omit<KitRecord, "id" | "created_at">>;
      };
      thems: {
        Row: ThemRecord;
        Insert: Omit<ThemRecord, "id" | "created_at">;
        Update: Partial<Omit<ThemRecord, "id" | "created_at">>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_kits_table: {
        Args: Record<string, never>;
        Returns: undefined;
      };
      create_thems_table: {
        Args: Record<string, never>;
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
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

export const themFromRecord = (record: ThemRecord, allKits: Kit[]): Them => {
  // Find all kits that are referenced by this theme
  const kits = allKits.filter(kit => record.kits_ids.includes(kit.id));
  
  return {
    id: record.id,
    nome: record.nome,
    descricao: record.descricao,
    imagens: record.imagens,
    valorGasto: record.valorGasto,
    vezes_alugado: record.vezes_alugado,
    kits: kits
  };
};
