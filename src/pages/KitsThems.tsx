
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useHandleContext } from '@/contexts/handleContext';
import { Package, Tag } from 'lucide-react';
import { toast } from 'sonner';
import StorageToggle from '@/components/layout/StorageToggle';
import KitList from '@/components/kits/KitList';
import KitForm from '@/components/kits/KitForm';
import ThemList from '@/components/thems/ThemList';
import ThemForm from '@/components/thems/ThemForm';
import DeleteConfirmDialog from '@/components/kits-thems/DeleteConfirmDialog';
import { Kit, Them } from '@/types';
import { useStorage } from '@/contexts/storageContext';
import { useApi } from '@/contexts/apiContext';
import { unifiedKitService, DataSource } from '@/services/unifiedKitService';
import { unifiedThemService } from '@/services/unifiedThemService';

const KitsThems = () => {
  const { kits, thems, addKit, addThems, updateKit, updateThems, removeKit, removeThems } = useHandleContext();
  const { storageType } = useStorage();
  const { apiType, apiUrl } = useApi();
  
  const [kitDialogOpen, setKitDialogOpen] = useState(false);
  const [themDialogOpen, setThemDialogOpen] = useState(false);
  const [deleteKitDialogOpen, setDeleteKitDialogOpen] = useState(false);
  const [deleteThemDialogOpen, setDeleteThemDialogOpen] = useState(false);
  const [kitToDelete, setKitToDelete] = useState<string | null>(null);
  const [themToDelete, setThemToDelete] = useState<string | null>(null);
  const [editingKit, setEditingKit] = useState<string | null>(null);
  const [editingThem, setEditingThem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [localKits, setLocalKits] = useState<Kit[]>([]);
  const [localThems, setLocalThems] = useState<Them[]>([]);

  // Determinar a fonte de dados atual
  const getCurrentDataSource = (): DataSource => {
    if (apiType === 'rest' && apiUrl) {
      return 'apiRest';
    } else if (storageType === 'supabase') {
      return 'supabase';
    } else {
      return 'localStorage';
    }
  };

  const dataSource = getCurrentDataSource();
  
  // Carregar dados na inicialização
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Carregar kits
        const loadedKits = await unifiedKitService.getAll(dataSource, apiUrl);
        setLocalKits(loadedKits);
        
        // Carregar temas
        const loadedThems = await unifiedThemService.getAll(dataSource, loadedKits, apiUrl);
        setLocalThems(loadedThems);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Falha ao carregar kits e temas');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [dataSource, apiUrl]);

  const resetKitForm = () => {
    setEditingKit(null);
  };
  
  const resetThemForm = () => {
    setEditingThem(null);
  };
  
  const handleKitSubmit = async (kitData: Omit<Kit, 'id' | 'vezes_alugado'>) => {
    setIsLoading(true);
    
    try {
      if (editingKit) {
        // Atualizar kit
        const updatedKit = await unifiedKitService.update(
          editingKit,
          {
            ...kitData,
            vezes_alugado: localKits.find(k => k.id === editingKit)?.vezes_alugado || 0
          },
          dataSource,
          apiUrl
        );
        
        if (updatedKit) {
          // Atualizar estado local
          setLocalKits(localKits.map(k => k.id === editingKit ? updatedKit : k));
          updateKit(editingKit, kitData);
          toast.success(`Kit atualizado com sucesso via ${dataSource}`);
        } else {
          throw new Error(`Falha ao atualizar kit via ${dataSource}`);
        }
      } else {
        // Criar novo kit
        const newKit = await unifiedKitService.create(kitData, dataSource, apiUrl);
        
        if (newKit) {
          // Atualizar estado local
          setLocalKits([...localKits, newKit]);
          addKit(newKit);
          toast.success(`Kit adicionado com sucesso via ${dataSource}`);
        } else {
          throw new Error(`Falha ao adicionar kit via ${dataSource}`);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar kit:', error);
      toast.error('Falha ao salvar kit');
    } finally {
      setIsLoading(false);
      setKitDialogOpen(false);
      resetKitForm();
    }
  };
  
  const handleThemSubmit = async (themData: Omit<Them, 'id' | 'vezes_alugado'>) => {
    setIsLoading(true);
    
    try {
      if (editingThem) {
        // Atualizar tema
        const updatedThem = await unifiedThemService.update(
          editingThem,
          {
            ...themData,
            vezes_alugado: localThems.find(t => t.id === editingThem)?.vezes_alugado || 0
          },
          dataSource,
          localKits,
          apiUrl
        );
        
        if (updatedThem) {
          // Atualizar estado local
          setLocalThems(localThems.map(t => t.id === editingThem ? updatedThem : t));
          updateThems(editingThem, themData);
          toast.success(`Tema atualizado com sucesso via ${dataSource}`);
        } else {
          throw new Error(`Falha ao atualizar tema via ${dataSource}`);
        }
      } else {
        // Criar novo tema
        const newThem = await unifiedThemService.create(themData, dataSource, localKits, apiUrl);
        
        if (newThem) {
          // Atualizar estado local
          setLocalThems([...localThems, newThem]);
          addThems(newThem);
          toast.success(`Tema adicionado com sucesso via ${dataSource}`);
        } else {
          throw new Error(`Falha ao adicionar tema via ${dataSource}`);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
      toast.error('Falha ao salvar tema');
    } finally {
      setIsLoading(false);
      setThemDialogOpen(false);
      resetThemForm();
    }
  };
  
  const handleEditKit = (kit: typeof localKits[0]) => {
    setEditingKit(kit.id);
    setKitDialogOpen(true);
  };
  
  const handleEditTema = (tema: typeof localThems[0]) => {
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

  const confirmDeleteKit = async () => {
    if (kitToDelete) {
      setIsLoading(true);
      
      try {
        // Excluir kit usando o serviço unificado
        const success = await unifiedKitService.delete(kitToDelete, dataSource, apiUrl);
        
        if (success) {
          // Atualizar estado local
          setLocalKits(localKits.filter(k => k.id !== kitToDelete));
          removeKit(kitToDelete);
          toast.success(`Kit excluído com sucesso via ${dataSource}`);
        } else {
          throw new Error(`Falha ao excluir kit via ${dataSource}`);
        }
      } catch (error) {
        console.error('Erro ao excluir kit:', error);
        toast.error('Falha ao excluir kit');
      } finally {
        setIsLoading(false);
        setDeleteKitDialogOpen(false);
        setKitToDelete(null);
      }
    }
  };

  const confirmDeleteThem = async () => {
    if (themToDelete) {
      setIsLoading(true);
      
      try {
        // Excluir tema usando o serviço unificado
        const success = await unifiedThemService.delete(themToDelete, dataSource, apiUrl);
        
        if (success) {
          // Atualizar estado local
          setLocalThems(localThems.filter(t => t.id !== themToDelete));
          removeThems(themToDelete);
          toast.success(`Tema excluído com sucesso via ${dataSource}`);
        } else {
          throw new Error(`Falha ao excluir tema via ${dataSource}`);
        }
      } catch (error) {
        console.error('Erro ao excluir tema:', error);
        toast.error('Falha ao excluir tema');
      } finally {
        setIsLoading(false);
        setDeleteThemDialogOpen(false);
        setThemToDelete(null);
      }
    }
  };
  
  // Componente para mostrar o modo atual
  const StorageModeIndicator = () => {
    let label = 'Local Storage';
    let description = apiUrl || '';
    
    if (dataSource === 'supabase') {
      label = 'Supabase';
    } else if (dataSource === 'apiRest') {
      label = 'API REST';
    }
    
    return (
      <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-md">
        {label}{description ? `: ${description}` : ''}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kits & Temas</h1>
        <div className="flex items-center gap-2">
          <StorageModeIndicator />
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
            kits={localKits} 
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
            themes={localThems} 
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
            initialData={editingKit ? localKits.find(k => k.id === editingKit) : undefined}
            isEditing={!!editingKit}
            isLoading={isLoading}
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
            initialData={editingThem ? localThems.find(t => t.id === editingThem) : undefined}
            isEditing={!!editingThem}
            kits={localKits}
            isLoading={isLoading}
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
