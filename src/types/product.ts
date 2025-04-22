
export type Product = {
  id: string;
  _id?: string; // Para compatibilidade com MongoDB
  name: string;
  description?: string;
  type: 'kit' | 'theme' | 'service' | string;
  subtype?: string;
  price?: number;
  images?: string[];
  items?: string[];
  rentCount?: number;
  available?: boolean;
  metadata?: Record<string, any>;
  created_at?: string;
};

// Type guard para verificar se um produto é do tipo 'kit'
export const isKitProduct = (product: Product): boolean => {
  return product.type === 'kit';
};

// Type guard para verificar se um produto é do tipo 'theme'
export const isThemeProduct = (product: Product): boolean => {
  return product.type === 'theme';
};

// Função para converter Kit para Product
export const kitToProduct = (kit: any): Product => {
  return {
    id: kit.id || kit._id,
    _id: kit._id,
    name: kit.nome,
    description: kit.descricao,
    type: 'kit',
    price: kit.preco,
    images: kit.imagens,
    items: kit.itens,
    rentCount: kit.vezes_alugado,
    available: true,
    created_at: kit.created_at,
  };
};

// Função para converter Theme para Product
export const themeToProduct = (theme: any, kits?: any[]): Product => {
  return {
    id: theme.id || theme._id,
    _id: theme._id,
    name: theme.nome,
    description: theme.descricao,
    type: 'theme',
    images: theme.imagens,
    rentCount: theme.vezes_alugado,
    available: true,
    metadata: {
      valorGasto: theme.valorGasto || theme.valorgasto,
      kitsIds: theme.kits_ids || (theme.kits ? theme.kits.map((k: any) => k.id) : []),
      kits: kits || theme.kits || []
    },
    created_at: theme.created_at,
  };
};

// Função para converter Product para o formato Kit antigo (para compatibilidade)
export const productToKit = (product: Product): any => {
  return {
    id: product.id,
    _id: product._id,
    nome: product.name,
    descricao: product.description || '',
    preco: product.price || 0,
    itens: product.items || [],
    imagens: product.images || [],
    vezes_alugado: product.rentCount || 0
  };
};

// Função para converter Product para o formato Theme antigo (para compatibilidade)
export const productToTheme = (product: Product): any => {
  const kits = product.metadata?.kits || [];
  return {
    id: product.id,
    _id: product._id,
    nome: product.name,
    descricao: product.description || '',
    imagens: product.images || [],
    valorGasto: product.metadata?.valorGasto || 0,
    vezes_alugado: product.rentCount || 0,
    kits: kits,
    kits_ids: product.metadata?.kitsIds || []
  };
};
