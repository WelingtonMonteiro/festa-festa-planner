
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFestaContext } from '@/contexts/FestaContext';
import { Package, Tag, Edit, Trash2, PlusCircle, Check, X } from 'lucide-react';

const KitsTemas = () => {
  const { kits, temas, adicionarKit, adicionarTema, atualizarKit, atualizarTema, excluirKit, excluirTema } = useFestaContext();
  
  // Estados para os dialogs
  const [kitDialogOpen, setKitDialogOpen] = useState(false);
  const [temaDialogOpen, setTemaDialogOpen] = useState(false);
  const [editingKit, setEditingKit] = useState<string | null>(null);
  const [editingTema, setEditingTema] = useState<string | null>(null);
  
  // Estados para os formulários
  const [kitForm, setKitForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    itens: [''],
    imagens: ['']
  });
  
  const [temaForm, setTemaForm] = useState({
    nome: '',
    descricao: '',
    valorGasto: '',
    imagens: [''],
    kitsIds: [] as string[]
  });
  
  // Handlers para form do kit
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
  
  // Handlers para form do tema
  const handleTemaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTemaForm({ ...temaForm, [name]: value });
  };
  
  const handleKitToggle = (kitId: string) => {
    const newKitsIds = temaForm.kitsIds.includes(kitId)
      ? temaForm.kitsIds.filter(id => id !== kitId)
      : [...temaForm.kitsIds, kitId];
    
    setTemaForm({ ...temaForm, kitsIds: newKitsIds });
  };
  
  // Reset forms
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
  
  const resetTemaForm = () => {
    setTemaForm({
      nome: '',
      descricao: '',
      valorGasto: '',
      imagens: [''],
      kitsIds: []
    });
    setEditingTema(null);
  };
  
  // Submit handlers
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
      atualizarKit(editingKit, kitData);
    } else {
      adicionarKit(kitData);
    }
    
    setKitDialogOpen(false);
    resetKitForm();
  };
  
  const handleTemaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const temaData = {
      nome: temaForm.nome,
      descricao: temaForm.descricao,
      valorGasto: parseFloat(temaForm.valorGasto) || 0,
      imagens: temaForm.imagens.filter(img => img.trim() !== ''),
      kits: kits.filter(kit => temaForm.kitsIds.includes(kit.id))
    };
    
    if (editingTema) {
      atualizarTema(editingTema, temaData);
    } else {
      adicionarTema(temaData);
    }
    
    setTemaDialogOpen(false);
    resetTemaForm();
  };
  
  // Edit handlers
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
  
  const handleEditTema = (tema: typeof temas[0]) => {
    setTemaForm({
      nome: tema.nome,
      descricao: tema.descricao,
      valorGasto: tema.valorGasto.toString(),
      imagens: [...tema.imagens],
      kitsIds: tema.kits.map(k => k.id)
    });
    setEditingTema(tema.id);
    setTemaDialogOpen(true);
  };
  
  // Calcular ROI para um tema
  const calcularROI = (tema: typeof temas[0]) => {
    const receitaTotal = tema.vezes_alugado * (tema.kits.reduce((sum, kit) => sum + kit.preco, 0) / tema.kits.length);
    const roi = tema.valorGasto > 0 ? ((receitaTotal / tema.valorGasto) - 1) * 100 : 0;
    return roi.toFixed(2);
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
        
        {/* Conteúdo da aba Kits */}
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
                  <CardTitle>{kit.nome}</CardTitle>
                  <CardDescription>R$ {kit.preco.toLocaleString('pt-BR')}</CardDescription>
                  <div className="absolute right-4 top-4 flex space-x-2">
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
                      onClick={() => excluirKit(kit.id)}
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
        
        {/* Conteúdo da aba Temas */}
        <TabsContent value="temas" className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => {
                resetTemaForm();
                setTemaDialogOpen(true);
              }}
              className="bg-festa-primary hover:bg-festa-primary/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Tema
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {temas.map(tema => (
              <Card key={tema.id}>
                <CardHeader className="relative">
                  <CardTitle>{tema.nome}</CardTitle>
                  <CardDescription>
                    Investimento: R$ {tema.valorGasto.toLocaleString('pt-BR')}
                  </CardDescription>
                  <div className="absolute right-4 top-4 flex space-x-2">
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
                      onClick={() => excluirTema(tema.id)}
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
                      <div className={Number(calcularROI(tema)) > 0 ? "text-green-600" : "text-red-600"}>
                        {calcularROI(tema)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {temas.length === 0 && (
              <div className="col-span-full">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">
                      Nenhum tema cadastrado. Adicione seu primeiro tema!
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setTemaDialogOpen(true)} 
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
      
      {/* Dialog para adicionar/editar kit */}
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
      
      {/* Dialog para adicionar/editar tema */}
      <Dialog open={temaDialogOpen} onOpenChange={setTemaDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTema ? 'Editar Tema' : 'Adicionar Novo Tema'}</DialogTitle>
            <DialogDescription>
              Preencha os dados para {editingTema ? 'editar' : 'adicionar'} um tema.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTemaSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Tema</Label>
                <Input 
                  id="nome" 
                  name="nome" 
                  value={temaForm.nome} 
                  onChange={handleTemaChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valorGasto">Valor Investido (R$)</Label>
                <Input 
                  id="valorGasto" 
                  name="valorGasto" 
                  type="number" 
                  value={temaForm.valorGasto} 
                  onChange={handleTemaChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea 
                id="descricao" 
                name="descricao" 
                value={temaForm.descricao} 
                onChange={handleTemaChange}
                rows={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Kits Disponíveis</Label>
              <div className="grid grid-cols-2 gap-2">
                {kits.map(kit => (
                  <div key={kit.id} className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant={temaForm.kitsIds.includes(kit.id) ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleKitToggle(kit.id)}
                    >
                      {temaForm.kitsIds.includes(kit.id) && (
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
                setTemaDialogOpen(false);
                resetTemaForm();
              }}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-festa-primary hover:bg-festa-primary/90"
                disabled={kits.length === 0 || temaForm.kitsIds.length === 0}
              >
                {editingTema ? 'Salvar Alterações' : 'Adicionar Tema'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KitsTemas;
