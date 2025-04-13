
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useHandleContext } from '@/contexts/handleContext.tsx';
import { Package, Tag } from 'lucide-react';
import StorageToggle from '@/components/layout/StorageToggle';
import KitList from '@/components/kits/KitList';
import KitForm from '@/components/kits/KitForm';
import ThemList from '@/components/thems/ThemList';
import ThemForm from '@/components/thems/ThemForm';
import DeleteConfirmDialog from '@/components/kits-thems/DeleteConfirmDialog';
import { Kit } from '@/types';

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

  const resetKitForm = () => {
    setEditingKit(null);
  };
  
  const resetThemForm = () => {
    setEditingThem(null);
  };
  
  const handleKitSubmit = (kitData: Omit<Kit, 'id' | 'vezes_alugado'>) => {
    if (editingKit) {
      updateKit(editingKit, kitData);
    } else {
      addKit(kitData);
    }
    
    setKitDialogOpen(false);
    resetKitForm();
  };
  
  const handleThemSubmit = (themData: any) => {
    if (editingThem) {
      updateThems(editingThem, themData);
    } else {
      addThems(themData);
    }
    
    setThemDialogOpen(false);
    resetThemForm();
  };
  
  const handleEditKit = (kit: typeof kits[0]) => {
    setEditingKit(kit.id);
    setKitDialogOpen(true);
  };
  
  const handleEditTema = (tema: typeof thems[0]) => {
    setEditingThem(tema.id);
    setThemDialogOpen(true);
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
        <div className="flex items-center gap-2">
          <StorageToggle />
        </div>
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
        
        <TabsContent value="kits">
          <KitList 
            kits={kits} 
            onAddKit={() => {
              resetKitForm();
              setKitDialogOpen(true);
            }} 
            onEditKit={handleEditKit}
            onDeleteKit={handleDeleteKitClick}
          />
        </TabsContent>
        
        <TabsContent value="temas">
          <ThemList 
            themes={thems} 
            onAddThem={() => {
              resetThemForm();
              setThemDialogOpen(true);
            }}
            onEditThem={handleEditTema}
            onDeleteThem={handleDeleteThemClick}
          />
        </TabsContent>
      </Tabs>
      
      {/* Kit Form Dialog */}
      <Dialog open={kitDialogOpen} onOpenChange={setKitDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingKit ? 'Editar Kit' : 'Adicionar Novo Kit'}</DialogTitle>
            <DialogDescription>
              Preencha os dados para {editingKit ? 'editar' : 'adicionar'} um kit.
            </DialogDescription>
          </DialogHeader>
          
          <KitForm 
            onSubmit={handleKitSubmit}
            onCancel={() => {
              setKitDialogOpen(false);
              resetKitForm();
            }}
            initialData={editingKit ? kits.find(k => k.id === editingKit) : undefined}
            isEditing={!!editingKit}
          />
        </DialogContent>
      </Dialog>
      
      {/* Theme Form Dialog */}
      <Dialog open={themDialogOpen} onOpenChange={setThemDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingThem ? 'Editar Tema' : 'Adicionar Novo Tema'}</DialogTitle>
            <DialogDescription>
              Preencha os dados para {editingThem ? 'editar' : 'adicionar'} um tema.
            </DialogDescription>
          </DialogHeader>
          
          <ThemForm 
            onSubmit={handleThemSubmit}
            onCancel={() => {
              setThemDialogOpen(false);
              resetThemForm();
            }}
            initialData={editingThem ? thems.find(t => t.id === editingThem) : undefined}
            isEditing={!!editingThem}
            kits={kits}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialogs */}
      <DeleteConfirmDialog 
        open={deleteKitDialogOpen}
        onOpenChange={setDeleteKitDialogOpen}
        onConfirm={confirmDeleteKit}
        title="Excluir Kit"
        description="Tem certeza que deseja excluir este kit? Esta ação não pode ser desfeita."
      />

      <DeleteConfirmDialog 
        open={deleteThemDialogOpen}
        onOpenChange={setDeleteThemDialogOpen}
        onConfirm={confirmDeleteThem}
        title="Excluir Tema"
        description="Tem certeza que deseja excluir este tema? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default KitsThems;
