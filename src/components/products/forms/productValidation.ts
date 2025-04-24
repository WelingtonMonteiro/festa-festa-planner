
import { z } from 'zod';

export const productBaseSchema = {
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.string().optional(),
  type: z.string(),
  subtype: z.string().optional(),
  images: z.array(z.string()).default([''])
};

export type ProductFormData = z.infer<typeof productSchema>;

export const productSchema = z.object(productBaseSchema);
