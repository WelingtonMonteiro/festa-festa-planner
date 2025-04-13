import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, Upload, X, Loader2 } from 'lucide-react';
import { Kit, Them } from '@/types';

interface ThemFormProps {
  onSubmit: (themData: Omit<Them, 'id' | 'vezes_alugado'>) => void;
  onCancel: () => void;
  initialData?: Them;
  isEditing: boolean;
  kits: Kit[];
  isLoading?: boolean;
}

const ThemForm = ({ onSubmit, onCancel, initialData, isEditing, kits, isLoading = false }: ThemFormProps) => {
  const [themForm, setThemForm] = useState({
    nome: initialData?.nome || '',
    descricao: initialData?.descricao || '',
    valorGasto: initialData?.valorGasto?.toString() || '',
    imagens: initialData?.imagens || [''],
    kitsIds: initialData?.kits.map(k => k.id) || []
  });
  
  const handleThemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setThemForm({ ...themForm, [name]: value });
  };
  
  const handleKitToggle = (kitId: string) => {
    const newKitsIds = themForm.kitsIds.includes(kitId)
      ? themForm.kitsIds.filter(id => id !== kitId)
      : [...themForm.kitsIds, kitId];
    
    setThemForm({ ...themForm, kitsIds: newKitsIds });
  };
  
  const handleThemImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setThemForm({
            ...themForm,
            imagens: [...themForm.imagens.filter(img => img !== ''), reader.result]
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeThemImage = (index: number) => {
    const newImages = themForm.imagens.filter((_, i) => i !== index);
    setThemForm({ ...themForm, imagens: newImages.length ? newImages : [''] });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const themData = {
      nome: themForm.nome,
      descricao: themForm.descricao,
      valorGasto: parseFloat(themForm.valorGasto) || 0,
      imagens: themForm.imagens.filter(img => img.trim() !== ''),
      kits: kits.filter(kit => themForm.kitsIds.includes(kit.id))
    };
    
    onSubmit(themData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Tema</Label>
          <Input 
            id="nome" 
            name="nome" 
            value={themForm.nome}
            onChange={handleThemChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="valorGasto">Valor Investido (R$)</Label>
          <Input 
            id="valorGasto" 
            name="valorGasto" 
            type="number" 
            value={themForm.valorGasto}
            onChange={handleThemChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea 
          id="descricao" 
          name="descricao" 
          value={themForm.descricao}
          onChange={handleThemChange}
          rows={3}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Imagens do Tema</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {themForm.imagens.map((img, index) =>
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
                  onClick={() => removeThemImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : null
          )}
          
          <div className="border rounded-md flex flex-col items-center justify-center p-4 h-24 cursor-pointer hover:bg-muted/50 transition-colors">
            <Label htmlFor="tema-image-upload" className="cursor-pointer flex flex-col items-center gap-1">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload</span>
            </Label>
            <Input
              id="tema-image-upload"
              type="file"
              accept="image/*"
              onChange={handleThemImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Kits Disponíveis</Label>
        <div className="grid grid-cols-2 gap-2">
          {kits.map(kit => (
            <div key={kit.id} className="flex items-center space-x-2">
              <Button
                type="button"
                variant={themForm.kitsIds.includes(kit.id) ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={() => handleKitToggle(kit.id)}
              >
                {themForm.kitsIds.includes(kit.id) && (
                  <Check className="mr-2 h-4 w-4" />
                )}
                {kit.nome}
              </Button>
            </div>
          ))}
        </div>
        {kits.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum kit disponível. Adicione kits antes de criar um tema.
          </p>
        )}
      </div>
      
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
          className="bg-festa-primary hover:bg-festa-primary/90"
          disabled={isLoading || kits.length === 0 || themForm.kitsIds.length === 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Salvando...' : 'Adicionando...'}
            </>
          ) : (
            isEditing ? 'Salvar Alterações' : 'Adicionar Tema'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ThemForm;
