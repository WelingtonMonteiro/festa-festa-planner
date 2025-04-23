
export type Product = {
  id: string;
  name: string;
  description?: string;
  type: 'kit' | 'theme' | 'service' | string;
  subtype?: string;
  price?: number;
  images?: string[];
  available?: boolean;
  metadata?: Record<string, any>;
};
