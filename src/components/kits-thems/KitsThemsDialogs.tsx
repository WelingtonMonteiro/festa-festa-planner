
import DeleteConfirmDialog from '@/components/kits-thems/DeleteConfirmDialog';
import KitDialog from './dialogs/KitDialog';
import ThemDialog from './dialogs/ThemDialog';
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
      <KitDialog 
        open={kitDialogOpen}
        onOpenChange={setKitDialogOpen}
        onSubmit={onKitSubmit}
        onCancel={() => {
          setKitDialogOpen(false);
          resetKitForm();
        }}
        editingKit={editingKit}
        isLoading={isLoading}
      />
      
      <ThemDialog 
        open={themDialogOpen}
        onOpenChange={setThemDialogOpen}
        onSubmit={onThemSubmit}
        onCancel={() => {
          setThemDialogOpen(false);
          resetThemForm();
        }}
        editingThem={editingThem}
        kits={localKits}
        isLoading={isLoading}
      />

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
