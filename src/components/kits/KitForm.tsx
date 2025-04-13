
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';
import { Kit } from '@/types';

interface KitFormProps {
  onSubmit: (kitData: Omit<Kit, 'id' | 'vezes_alugado'>) => void;
  onCancel: () => void;
  initialData?: Kit;
  isEditing: boolean;
}

const KitForm = ({ onSubmit, onCancel, initialData, isEditing }: KitFormProps) => {
  const [kitForm, setKitForm] = useState({
    nome: initialData?.nome || '',
    descricao: initialData?.descricao || '',
    preco: initialData?.preco?.toString() || '',
    itens: initialData?.itens || [''],
    imagens: initialData?.imagens || ['']
  });
  
  const handleKitChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setKitForm({ ...kitForm, [name]: value });
  };
  
  const handleKitItemChange = (index: number, value: string) => {
    const newItens = [...kitForm.itens];
    newItens[index] = value;
    setKitForm({ ...kitForm, itens: newItens });
  };
  
  const addKitItem = () => {
    setKitForm({ ...kitForm, itens: [...kitForm.itens, ''] });
  };
  
  const removeKitItem = (index: number) => {
    const newItens = kitForm.itens.filter((_, i) => i !== index);
    setKitForm({ ...kitForm, itens: newItens });
  };
  
  const handleKitImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setKitForm({ 
            ...kitForm, 
            imagens: [...kitForm.imagens.filter(img => img !== ''), reader.result] 
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeKitImage = (index: number) => {
    const newImages = kitForm.imagens.filter((_, i) => i !== index);
    setKitForm({ ...kitForm, imagens: newImages.length ? newImages : [''] });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const kitData = {
      nome: kitForm.nome,
      descricao: kitForm.descricao,
      itens: kitForm.itens.filter(item => item.trim() !== ''),
      preco: parseFloat(kitForm.preco) || 0,
      imagens: kitForm.imagens.filter(img => img.trim() !== '')
    };
    
    onSubmit(kitData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Kit</Label>
          <Input 
            id="nome" 
            name="nome" 
            value={kitForm.nome} 
            onChange={handleKitChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preco">Preço (R$)</Label>
          <Input 
            id="preco" 
            name="preco" 
            type="number" 
            value={kitForm.preco} 
            onChange={handleKitChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea 
          id="descricao" 
          name="descricao" 
          value={kitForm.descricao} 
          onChange={handleKitChange}
          rows={3}
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Itens Inclusos</Label>
          <Button type="button" variant="outline" size="sm" onClick={addKitItem}>
            Adicionar Item
          </Button>
        </div>
        
        <div className="space-y-2">
          {kitForm.itens.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input 
                value={item}
                onChange={(e) => handleKitItemChange(index, e.target.value)}
                placeholder={`Item ${index + 1}`}
              />
              {kitForm.itens.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeKitItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Imagens do Kit</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {kitForm.imagens.map((img, index) => 
            img !== '' ? (
              <div key={index} className="relative rounded-md overflow-hidden border h-24">
                <img 
                  src={img} 
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                  onClick={() => removeKitImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : null
          )}
          
          <div className="border rounded-md flex flex-col items-center justify-center p-4 h-24 cursor-pointer hover:bg-muted/50 transition-colors">
            <Label htmlFor="kit-image-upload" className="cursor-pointer flex flex-col items-center gap-1">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload</span>
            </Label>
            <Input
              id="kit-image-upload"
              type="file"
              accept="image/*"
              onChange={handleKitImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-festa-primary hover:bg-festa-primary/90">
          {isEditing ? 'Salvar Alterações' : 'Adicionar Kit'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default KitForm;
