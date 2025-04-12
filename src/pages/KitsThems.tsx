import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useHandleContext } from '@/contexts/handleContext.tsx';
import { Package, Tag, Edit, Trash2, PlusCircle, Check, X, Image, Upload } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const KitsThems = () => {
  const { kits, thems, addKit, addThems, updateKit, updateThems, removeKit, removeThems } = useHandleContext();
  
  const [kitDialogOpen, setKitDialogOpen] = useState(false);
  const [themDialogOpen, setThemDialogOpen] = useState(false);
  const [deleteKitDialogOpen, setDeleteKitDialogOpen] = useState(false);
  const [deleteThemDialogOpen, setDeleteThemDialogOpen] = useState(false);
  const [kitToDelete, setKitToDelete] = useState<string | null>(null);
  const [themToDelete, setThemToDelete] = useState<string | null>(null);
  const [editingKit, setEditingKit] = useState<string | null>(null);
  const [editingThem, setEditingThem] = useState<string | null>(null);
  
  const [kitForm, setKitForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    itens: [''],
    imagens: ['']
  });
  
  const [themForm, setThemForm] = useState({
    nome: '',
    descricao: '',
    valorGasto: '',
    imagens: [''],
    kitsIds: [] as string[]
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
  
  const removeKitImage = (index: number) => {
    const newImages = kitForm.imagens.filter((_, i) => i !== index);
    setKitForm({ ...kitForm, imagens: newImages.length ? newImages : [''] });
  };
  
  const removeThemImage = (index: number) => {
    const newImages = themForm.imagens.filter((_, i) => i !== index);
    setThemForm({ ...themForm, imagens: newImages.length ? newImages : [''] });
  };
  
  const resetKitForm = () => {
    setKitForm({
      nome: '',
      descricao: '',
      preco: '',
      itens: [''],
      imagens: ['']
    });
    setEditingKit(null);
  };
  
  const resetThemForm = () => {
    setThemForm({
      nome: '',
      descricao: '',
      valorGasto: '',
      imagens: [''],
      kitsIds: []
    });
    setEditingThem(null);
  };
  
  const handleKitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const kitData = {
      nome: kitForm.nome,
      descricao: kitForm.descricao,
      itens: kitForm.itens.filter(item => item.trim() !== ''),
      preco: parseFloat(kitForm.preco) || 0,
      imagens: kitForm.imagens.filter(img => img.trim() !== '')
    };
    
    if (editingKit) {
      updateKit(editingKit, kitData);
    } else {
      addKit(kitData);
    }
    
    setKitDialogOpen(false);
    resetKitForm();
  };
  
  const handleThemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const themData = {
      nome: themForm.nome,
      descricao: themForm.descricao,
      valorGasto: parseFloat(themForm.valorGasto) || 0,
      imagens: themForm.imagens.filter(img => img.trim() !== ''),
      kits: kits.filter(kit => themForm.kitsIds.includes(kit.id))
    };
    
    if (editingThem) {
      updateThems(editingThem, themData);
    } else {
      addThems(themData);
    }
    
    setThemDialogOpen(false);
    resetThemForm();
  };
  
  const handleEditKit = (kit: typeof kits[0]) => {
    setKitForm({
      nome: kit.nome,
      descricao: kit.descricao,
      preco: kit.preco.toString(),
      itens: [...kit.itens],
      imagens: [...kit.imagens]
    });
    setEditingKit(kit.id);
    setKitDialogOpen(true);
  };
  
  const handleEditTema = (tema: typeof thems[0]) => {
    setThemForm({
      nome: tema.nome,
      descricao: tema.descricao,
      valorGasto: tema.valorGasto.toString(),
      imagens: [...tema.imagens],
      kitsIds: tema.kits.map(k => k.id)
    });
    setEditingThem(tema.id);
    setThemDialogOpen(true);
  };
  
  const calcROI = (them: typeof thems[0]) => {
    const receitaTotal = them.vezes_alugado * (them.kits.reduce((sum, kit) => sum + kit.preco, 0) / them.kits.length);
    const roi = them.valorGasto > 0 ? ((receitaTotal / them.valorGasto) - 1) * 100 : 0;
    return roi.toFixed(2);
  };

  const handleDeleteKitClick = (id: string) => {
    setKitToDelete(id);
    setDeleteKitDialogOpen(true);
  };

  const handleDeleteThemClick = (id: string) => {
    setThemToDelete(id);
    setDeleteThemDialogOpen(true);
  };

  const confirmDeleteKit = () => {
    if (kitToDelete) {
      removeKit(kitToDelete);
      setDeleteKitDialogOpen(false);
      setKitToDelete(null);
    }
  };

  const confirmDeleteThem = () => {
    if (themToDelete) {
      removeThems(themToDelete);
      setDeleteThemDialogOpen(false);
      setThemToDelete(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kits & Temas</h1>
      </div>
      
      <Tabs defaultValue="kits" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="kits" className="flex items-center">
            <Package className="mr-2 h-4 w-4" /> Kits
          </TabsTrigger>
          <TabsTrigger value="temas" className="flex items-center">
            <Tag className="mr-2 h-4 w-4" /> Temas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="kits" className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => {
                resetKitForm();
                setKitDialogOpen(true);
              }}
              className="bg-festa-primary hover:bg-festa-primary/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Kit
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {kits.map(kit => (
              <Card key={kit.id}>
                <CardHeader className="relative">
                  {kit.imagens && kit.imagens.length > 0 && kit.imagens[0] !== '' && (
                    <div className="absolute inset-0 rounded-t-lg overflow-hidden">
                      <img 
                        src={kit.imagens[0]} 
                        alt={kit.nome}
                        className="w-full h-24 object-cover opacity-20"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
                    </div>
                  )}
                  <CardTitle className="relative z-10">{kit.nome}</CardTitle>
                  <CardDescription className="relative z-10">
                    R$ {kit.preco.toLocaleString('pt-BR')}
                  </CardDescription>
                  <div className="absolute right-4 top-4 flex space-x-2 z-10">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEditKit(kit)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDeleteKitClick(kit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{kit.descricao}</p>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Itens inclusos:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {kit.itens.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="text-sm text-muted-foreground">
                    Alugado {kit.vezes_alugado} {kit.vezes_alugado === 1 ? 'vez' : 'vezes'}
                  </div>
                </CardFooter>
              </Card>
            ))}
            
            {kits.length === 0 && (
              <div className="col-span-full">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">
                      Nenhum kit cadastrado. Adicione seu primeiro kit!
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setKitDialogOpen(true)} 
                      className="mt-4"
                    >
                      Adicionar Kit
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="temas" className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => {
                resetThemForm();
                setThemDialogOpen(true);
              }}
              className="bg-festa-primary hover:bg-festa-primary/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Tema
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {thems.map(tema => (
              <Card key={tema.id}>
                <CardHeader className="relative">
                  {tema.imagens && tema.imagens.length > 0 && tema.imagens[0] !== '' && (
                    <div className="absolute inset-0 rounded-t-lg overflow-hidden">
                      <img 
                        src={tema.imagens[0]} 
                        alt={tema.nome}
                        className="w-full h-24 object-cover opacity-20"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
                    </div>
                  )}
                  <CardTitle className="relative z-10">{tema.nome}</CardTitle>
                  <CardDescription className="relative z-10">
                    Investimento: R$ {tema.valorGasto.toLocaleString('pt-BR')}
                  </CardDescription>
                  <div className="absolute right-4 top-4 flex space-x-2 z-10">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEditTema(tema)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDeleteThemClick(tema.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{tema.descricao}</p>
                  <div className="mb-3">
                    <h4 className="text-sm font-medium mb-2">Kits disponíveis:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tema.kits.map(kit => (
                        <div key={kit.id} className="bg-muted rounded-full px-3 py-1 text-xs">
                          {kit.nome}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-muted rounded p-2">
                      <div className="font-medium">Alugado</div>
                      <div>{tema.vezes_alugado} {tema.vezes_alugado === 1 ? 'vez' : 'vezes'}</div>
                    </div>
                    <div className="bg-muted rounded p-2">
                      <div className="font-medium">ROI</div>
                      <div className={Number(calcROI(tema)) > 0 ? "text-green-600" : "text-red-600"}>
                        {calcROI(tema)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {thems.length === 0 && (
              <div className="col-span-full">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">
                      Nenhum tema cadastrado. Adicione seu primeiro tema!
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setThemDialogOpen(true)}
                      className="mt-4"
                    >
                      Adicionar Tema
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={kitDialogOpen} onOpenChange={setKitDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingKit ? 'Editar Kit' : 'Adicionar Novo Kit'}</DialogTitle>
            <DialogDescription>
              Preencha os dados para {editingKit ? 'editar' : 'adicionar'} um kit.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleKitSubmit} className="space-y-4">
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
              <Button type="button" variant="outline" onClick={() => {
                setKitDialogOpen(false);
                resetKitForm();
              }}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-festa-primary hover:bg-festa-primary/90">
                {editingKit ? 'Salvar Alterações' : 'Adicionar Kit'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={themDialogOpen} onOpenChange={setThemDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingThem ? 'Editar Tema' : 'Adicionar Novo Tema'}</DialogTitle>
            <DialogDescription>
              Preencha os dados para {editingThem ? 'editar' : 'adicionar'} um tema.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleThemSubmit} className="space-y-4">
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
              <Button type="button" variant="outline" onClick={() => {
                setThemDialogOpen(false);
                resetThemForm();
              }}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-festa-primary hover:bg-festa-primary/90"
                disabled={kits.length === 0 || themForm.kitsIds.length === 0}
              >
                {editingThem ? 'Salvar Alterações' : 'Adicionar Tema'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteKitDialogOpen} onOpenChange={setDeleteKitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Kit</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este kit? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteKitDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteKit} className="bg-destructive hover:bg-destructive/90">
              Sim, excluir kit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteThemDialogOpen} onOpenChange={setDeleteThemDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Tema</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este tema? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteThemDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteThem} className="bg-destructive hover:bg-destructive/90">
              Sim, excluir tema
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default KitsThems;
