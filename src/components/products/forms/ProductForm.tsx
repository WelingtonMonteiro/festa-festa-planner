
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Product } from '@/types/product';
import ImageUpload from './ImageUpload';
import { productSchema, type ProductFormData } from './productValidation';
import { z } from 'zod';

interface ProductFormProps {
  onSubmit: (productData: Omit<Product, 'id'>) => void;
  onCancel: () => void;
  initialData?: Product;
  isEditing: boolean;
  isLoading?: boolean;
  type?: string;
}

const ProductForm = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isEditing, 
  isLoading = false,
  type
}: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    type: type || initialData?.type || '',
    subtype: initialData?.subtype || '',
    price: initialData?.price?.toString() || '',
    images: initialData?.images || ['']
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images.filter(img => img !== ''), reader.result]
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: newImages.length ? newImages : ['']
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = productSchema.parse(formData);
      const productData: Omit<Product, 'id'> = {
        ...validatedData,
        type: type || validatedData.type,
        price: parseFloat(validatedData.price || '0'),
        images: validatedData.images.filter(img => img.trim() !== '')
      };
      
      onSubmit(productData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Valor (R$)</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            value={formData.price}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </div>

      {!type && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Input 
              id="type" 
              name="type" 
              value={formData.type}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtype">Subtipo</Label>
            <Input 
              id="subtype" 
              name="subtype" 
              value={formData.subtype}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
      
      <ImageUpload 
        images={formData.images}
        onImageUpload={handleImageUpload}
        onRemoveImage={removeImage}
      />
      
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Salvando...' : 'Adicionando...'}
            </>
          ) : (
            isEditing ? 'Salvar Produto' : 'Adicionar Produto'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProductForm;
