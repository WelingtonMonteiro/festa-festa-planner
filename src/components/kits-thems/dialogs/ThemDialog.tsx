
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ThemForm from '@/components/thems/ThemForm';
import { Kit, Them } from '@/types';

interface ThemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (themData: Omit<Them, 'id' | 'vezes_alugado'>) => Promise<void>;
  onCancel: () => void;
  editingThem: Them | null;
  kits: Kit[];
  isLoading: boolean;
}

const ThemDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  editingThem,
  kits,
  isLoading
}: ThemDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingThem ? 'Editar Tema' : 'Adicionar Novo Tema'}</DialogTitle>
          <DialogDescription>
            Preencha os dados para {editingThem ? 'editar' : 'adicionar'} um tema.
          </DialogDescription>
        </DialogHeader>
        
        <ThemForm 
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialData={editingThem}
          isEditing={!!editingThem}
          kits={kits}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ThemDialog;
