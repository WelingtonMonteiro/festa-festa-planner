
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Package, Tag } from 'lucide-react';
import KitList from '@/components/kits/KitList';
import KitForm from '@/components/kits/KitForm';
import ThemList from '@/components/thems/ThemList';
import ThemForm from '@/components/thems/ThemForm';
import DeleteConfirmDialog from '@/components/kits-thems/DeleteConfirmDialog';
import { DataPagination } from '@/components/common/DataPagination';
import { useDialogManager } from '@/hooks/useDialogManager';
import { useKitsThemsData } from '@/hooks/useKitsThemsData';
import { usePagination } from '@/hooks/usePagination';
import { Kit, Them } from '@/types';
import { unifiedThemService } from '@/services/unifiedThemService';
import { useApi } from '@/contexts/apiContext';
import { useStorage } from '@/contexts/storageContext';

const KitsThems = () => {
  const {
    kitDialogOpen, setKitDialogOpen,
    themDialogOpen, setThemDialogOpen,
    deleteKitDialogOpen, setDeleteKitDialogOpen,
    deleteThemDialogOpen, setDeleteThemDialogOpen,
    kitToDelete, setKitToDelete,
    themToDelete, setThemToDelete,
    editingKit, setEditingKit,
    editingThem, setEditingThem,
    resetKitForm, resetThemForm
  } = useDialogManager();

  const { apiType, apiUrl } = useApi();
  const { storageType } = useStorage();

  const getCurrentDataSource = () => {
    if (apiType === 'rest' && apiUrl) {
      return 'apiRest';
    } else if (storageType === 'supabase') {
      return 'supabase';
    }
    return 'localStorage';
  };

  const dataSource = getCurrentDataSource();

  const {
    isLoading,
    localKits,
    localThems,
    setLocalThems,
    loadData,
    handleKitSubmit,
    handleThemSubmit,
    handleKitUpdate,
    handleThemUpdate,
    handleKitDelete,
    handleThemDelete
  } = useKitsThemsData();

  const {
    currentPage,
    totalPages,
    limit,
    setTotalPages,
    setTotalItems,
    handlePageChange,
    renderPaginationLinks
  } = usePagination();

  useEffect(() => {
    const fetchData = async () => {
      const result = await loadData(currentPage, limit);
      setTotalPages(Math.ceil(result.total / limit));
      setTotalItems(result.total);
      
      try {
        const themResponse = await unifiedThemService.getAll(dataSource, result.kits, apiUrl, currentPage, limit);
        if ('data' in themResponse) {
          setLocalThems(themResponse.data);
        } else {
          setLocalThems(Array.isArray(themResponse) ? themResponse : []);
        }
      } catch (error) {
        console.error('Error loading themes:', error);
      }
    };

    fetchData();
  }, [currentPage, limit]);

  const onKitSubmit = async (kitData: Omit<Kit, 'id' | 'vezes_alugado'>) => {
    if (editingKit) {
      await handleKitUpdate(editingKit.id, kitData);
    } else {
      await handleKitSubmit(kitData);
    }
    setKitDialogOpen(false);
    resetKitForm();
    loadData(currentPage, limit);
  };

  const onThemSubmit = async (themData: Omit<Them, 'id' | 'vezes_alugado'>) => {
    if (editingThem) {
      await handleThemUpdate(editingThem.id, themData);
    } else {
      await handleThemSubmit(themData);
    }
    setThemDialogOpen(false);
    resetThemForm();
    loadData(currentPage, limit);
  };

  const confirmDeleteKit = async () => {
    if (kitToDelete) {
      const success = await handleKitDelete(kitToDelete);
      if (success) {
        loadData(currentPage, limit);
      }
      setDeleteKitDialogOpen(false);
      setKitToDelete(null);
    }
  };

  const confirmDeleteThem = async () => {
    if (themToDelete) {
      const success = await handleThemDelete(themToDelete);
      if (success) {
        loadData(currentPage, limit);
      }
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
        
        <TabsContent value="kits">
          <KitList 
            kits={localKits} 
            onAddKit={() => {
              resetKitForm();
              setKitDialogOpen(true);
            }} 
            onEditKit={(kit) => {
              setEditingKit(kit);
              setKitDialogOpen(true);
            }}
            onDeleteKit={(id) => {
              setKitToDelete(id);
              setDeleteKitDialogOpen(true);
            }}
            isLoading={isLoading}
          />
          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            paginationLinks={renderPaginationLinks()}
          />
        </TabsContent>
        
        <TabsContent value="temas">
          <ThemList 
            themes={Array.isArray(localThems) ? localThems : []} 
            onAddThem={() => {
              resetThemForm();
              setThemDialogOpen(true);
            }}
            onEditThem={(them) => {
              setEditingThem(them);
              setThemDialogOpen(true);
            }}
            onDeleteThem={(id) => {
              setThemToDelete(id);
              setDeleteThemDialogOpen(true);
            }}
            isLoading={isLoading}
          />
          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            paginationLinks={renderPaginationLinks()}
          />
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
          
          <KitForm 
            onSubmit={onKitSubmit}
            onCancel={() => {
              setKitDialogOpen(false);
              resetKitForm();
            }}
            initialData={editingKit}
            isEditing={!!editingKit}
            isLoading={isLoading}
          />
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
          
          <ThemForm 
            onSubmit={onThemSubmit}
            onCancel={() => {
              setThemDialogOpen(false);
              resetThemForm();
            }}
            initialData={editingThem}
            isEditing={!!editingThem}
            kits={localKits}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

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
