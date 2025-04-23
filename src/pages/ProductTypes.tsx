
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProductType {
  id: string;
  name: string;
  subtypes: string[];
}

const ProductTypes = () => {
  const [types, setTypes] = useState<ProductType[]>([
    { id: '1', name: 'kit', subtypes: ['infantil', 'adulto'] },
    { id: '2', name: 'theme', subtypes: ['casamento', 'aniversário'] }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<ProductType | null>(null);
  const [formData, setFormData] = useState({ name: '', subtypes: '' });

  const handleSubmit = () => {
    const subtypesArray = formData.subtypes.split(',').map(s => s.trim());
    if (editingType) {
      setTypes(types.map(type => 
        type.id === editingType.id 
          ? { ...type, name: formData.name, subtypes: subtypesArray }
          : type
      ));
    } else {
      setTypes([...types, { 
        id: Date.now().toString(), 
        name: formData.name, 
        subtypes: subtypesArray 
      }]);
    }
    setIsDialogOpen(false);
    setEditingType(null);
    setFormData({ name: '', subtypes: '' });
  };

  const handleEdit = (type: ProductType) => {
    setEditingType(type);
    setFormData({ 
      name: type.name, 
      subtypes: type.subtypes.join(', ') 
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTypes(types.filter(type => type.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tipos de Produtos</h1>
        <Button
          onClick={() => {
            setEditingType(null);
            setFormData({ name: '', subtypes: '' });
            setIsDialogOpen(true);
          }}
          className="bg-festa-primary hover:bg-festa-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Tipo
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Subtipos</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type.id}>
                <TableCell className="font-medium">{type.name}</TableCell>
                <TableCell>{type.subtypes.join(', ')}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(type)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(type.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingType ? 'Editar Tipo' : 'Novo Tipo de Produto'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Tipo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtypes">Subtipos (separados por vírgula)</Label>
              <Input
                id="subtypes"
                value={formData.subtypes}
                onChange={(e) => setFormData({ ...formData, subtypes: e.target.value })}
                placeholder="Ex: infantil, adulto, temático"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingType ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductTypes;
