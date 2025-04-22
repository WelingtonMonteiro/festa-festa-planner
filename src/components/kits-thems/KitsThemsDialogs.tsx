
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DeleteConfirmDialog from '@/components/kits-thems/DeleteConfirmDialog';
import KitForm from '@/components/kits/KitForm';
import ThemForm from '@/components/thems/ThemForm';
import { Kit, Them } from '@/types';

interface KitsThemsDialogsProps {
  kitDialogOpen: boolean;
  setKitDialogOpen: (open: boolean) => void;
  themDialogOpen: boolean;
  setThemDialogOpen: (open: boolean) => void;
  deleteKitDialogOpen: boolean;
  setDeleteKitDialogOpen: (open: boolean) => void;
  deleteThemDialogOpen: boolean;
  setDeleteThemDialogOpen: (open: boolean) => void;
  editingKit: Kit | null;
  editingThem: Them | null;
  resetKitForm: () => void;
  resetThemForm: () => void;
  onKitSubmit: (kitData: Omit<Kit, 'id' | 'vezes_alugado'>) => Promise<void>;
  onThemSubmit: (themData: Omit<Them, 'id' | 'vezes_alugado'>) => Promise<void>;
  confirmDeleteKit: () => Promise<void>;
  confirmDeleteThem: () => Promise<void>;
  isLoading: boolean;
  localKits: Kit[];
}

const KitsThemsDialogs = ({
  kitDialogOpen,
  setKitDialogOpen,
  themDialogOpen,
  setThemDialogOpen,
  deleteKitDialogOpen,
  setDeleteKitDialogOpen,
  deleteThemDialogOpen,
  setDeleteThemDialogOpen,
  editingKit,
  editingThem,
  resetKitForm,
  resetThemForm,
  onKitSubmit,
  onThemSubmit,
  confirmDeleteKit,
  confirmDeleteThem,
  isLoading,
  localKits,
}: KitsThemsDialogsProps) => {
  return (
    <>
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
    </>
  );
};

export default KitsThemsDialogs;
