import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, Upload, X, Loader2, Package, Tag } from 'lucide-react';
import { Product } from '@/types/product';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductFormProps {
  onSubmit: (productData: Omit<Product, 'id'>) => void;
  onCancel: () => void;
  initialData?: Product;
  isEditing: boolean;
  availableKits?: Product[];
  isLoading?: boolean;
  productType?: string;
}

const ProductForm = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isEditing, 
  availableKits = [],
  isLoading = false,
  productType
}: ProductFormProps) => {
  const [type, setType] = useState<string>(initialData?.type || productType || 'kit');

  const [kitForm, setKitForm] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    items: (initialData?.metadata?.items ?? ['']) as string[],
    images: initialData?.images || ['']
  });

  const [themeForm, setThemeForm] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    investmentValue: initialData?.metadata?.valorGasto?.toString() || '',
    images: initialData?.images || [''],
    kitsIds: initialData?.metadata?.kitsIds || []
  });

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      if (initialData.type === 'kit') {
        setKitForm({
          name: initialData.name || '',
          description: initialData.description || '',
          price: initialData.price?.toString() || '',
          items: (initialData.metadata?.items ?? ['']) as string[],
          images: initialData.images || ['']
        });
      } else if (initialData.type === 'theme') {
        setThemeForm({
          name: initialData.name || '',
          description: initialData.description || '',
          investmentValue: initialData.metadata?.valorGasto?.toString() || '',
          images: initialData.images || [''],
          kitsIds: initialData.metadata?.kitsIds || []
        });
      }
    }
  }, [initialData]);

  const handleKitChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setKitForm({ ...kitForm, [name]: value });
  };

  const handleKitItemChange = (index: number, value: string) => {
    const newItems = [...kitForm.items];
    newItems[index] = value;
    setKitForm({ ...kitForm, items: newItems });
  };

  const addKitItem = () => {
    setKitForm({ ...kitForm, items: [...kitForm.items, ''] });
  };

  const removeKitItem = (index: number) => {
    const newItems = kitForm.items.filter((_, i) => i !== index);
    setKitForm({ ...kitForm, items: newItems.length ? newItems : [''] });
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setThemeForm({ ...themeForm, [name]: value });
  };

  const handleKitToggle = (kitId: string) => {
    const newKitsIds = themeForm.kitsIds.includes(kitId)
      ? themeForm.kitsIds.filter(id => id !== kitId)
      : [...themeForm.kitsIds, kitId];

    setThemeForm({ ...themeForm, kitsIds: newKitsIds });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (type === 'kit') {
            setKitForm({
              ...kitForm,
              images: [...kitForm.images.filter(img => img !== ''), reader.result]
            });
          } else {
            setThemeForm({
              ...themeForm,
              images: [...themeForm.images.filter(img => img !== ''), reader.result]
            });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    if (type === 'kit') {
      const newImages = kitForm.images.filter((_, i) => i !== index);
      setKitForm({ ...kitForm, images: newImages.length ? newImages : [''] });
    } else {
      const newImages = themeForm.images.filter((_, i) => i !== index);
      setThemeForm({ ...themeForm, images: newImages.length ? newImages : [''] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'kit') {
      const productData: Omit<Product, 'id'> = {
        name: kitForm.name,
        description: kitForm.description,
        type: 'kit',
        price: parseFloat(kitForm.price) || 0,
        images: kitForm.images.filter(img => img !== ''),
        metadata: {
          items: kitForm.items.filter(item => item.trim() !== '')
        }
      };
      onSubmit(productData);
    } else {
      const selectedKits = availableKits.filter(kit => themeForm.kitsIds.includes(kit.id));
      const productData: Omit<Product, 'id'> = {
        name: themeForm.name,
        description: themeForm.description,
        type: 'theme',
        images: themeForm.images.filter(img => img !== ''),
        metadata: {
          valorGasto: parseFloat(themeForm.investmentValue) || 0,
          kitsIds: themeForm.kitsIds,
          kits: selectedKits
        }
      };
      onSubmit(productData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!productType && (
        <Tabs value={type} onValueChange={setType} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="kit" className="flex items-center" data-state={type === 'kit' ? 'active' : 'inactive'}>
              <Package className="mr-2 h-4 w-4" /> Kit
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center" data-state={type === 'theme' ? 'active' : 'inactive'}>
              <Tag className="mr-2 h-4 w-4" /> Tema
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      {type === 'kit' ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Kit</Label>
              <Input 
                id="name" 
                name="name" 
                value={kitForm.name}
                onChange={handleKitChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Valor do Kit (R$)</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                value={kitForm.price}
                onChange={handleKitChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={kitForm.description}
              onChange={handleKitChange}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Itens do Kit</Label>
            {kitForm.items.map((item, index) => (
              <div key={`item-${index}`} className="flex gap-2 items-center">
                <Input
                  value={item}
                  onChange={(e) => handleKitItemChange(index, e.target.value)}
                  placeholder={`Item ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeKitItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addKitItem}
            >
              Adicionar Item
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Tema</Label>
              <Input 
                id="name" 
                name="name" 
                value={themeForm.name}
                onChange={handleThemeChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="investmentValue">Valor Investido (R$)</Label>
              <Input 
                id="investmentValue" 
                name="investmentValue" 
                type="number" 
                value={themeForm.investmentValue}
                onChange={handleThemeChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={themeForm.description}
              onChange={handleThemeChange}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Kits Disponíveis</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableKits
                .filter(kit => kit.type === 'kit')
                .map(kit => (
                <div key={`kit-${kit.id}`} className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant={themeForm.kitsIds.includes(kit.id) ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleKitToggle(kit.id)}
                  >
                    {themeForm.kitsIds.includes(kit.id) && (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    {kit.name}
                  </Button>
                </div>
              ))}
            </div>
            {availableKits.filter(k => k.type === 'kit').length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum kit disponível. Adicione kits antes de criar um tema.
              </p>
            )}
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <Label>Imagens do {type === 'kit' ? 'Kit' : 'Tema'}</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {(type === 'kit' ? kitForm.images : themeForm.images).map((img, index) =>
            img !== '' ? (
              <div key={`image-${index}`} className="relative rounded-md overflow-hidden border h-24">
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
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : null
          )}
          
          <div className="border rounded-md flex flex-col items-center justify-center p-4 h-24 cursor-pointer hover:bg-muted/50 transition-colors">
            <Label htmlFor="product-image-upload" className="cursor-pointer flex flex-col items-center gap-1">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload</span>
            </Label>
            <Input
              id="product-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
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
          disabled={isLoading || (type === 'theme' && themeForm.kitsIds.length === 0)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Salvando...' : 'Adicionando...'}
            </>
          ) : (
            isEditing ? `Salvar ${type === 'kit' ? 'Kit' : 'Tema'}` : `Adicionar ${type === 'kit' ? 'Kit' : 'Tema'}`
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProductForm;
