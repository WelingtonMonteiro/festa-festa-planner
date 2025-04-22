
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import KitForm from '@/components/kits/KitForm';
import { Kit } from '@/types';

interface KitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (kitData: Omit<Kit, 'id' | 'vezes_alugado'>) => Promise<void>;
  onCancel: () => void;
  editingKit: Kit | null;
  isLoading: boolean;
}

const KitDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  editingKit,
  isLoading
}: KitDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingKit ? 'Editar Kit' : 'Adicionar Novo Kit'}</DialogTitle>
          <DialogDescription>
            Preencha os dados para {editingKit ? 'editar' : 'adicionar'} um kit.
          </DialogDescription>
        </DialogHeader>
        
        <KitForm 
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialData={editingKit}
          isEditing={!!editingKit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default KitDialog;
