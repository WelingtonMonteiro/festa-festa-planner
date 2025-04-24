
import { z } from 'zod';

export const productBaseSchema = {
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.string().optional(),
  type: z.string().min(1, 'Tipo é obrigatório'),
  subtype: z.string().optional(),
  images: z.array(z.string()).default([''])
};

export const productSchema = z.object(productBaseSchema);

export type ProductFormData = z.infer<typeof productSchema>;
