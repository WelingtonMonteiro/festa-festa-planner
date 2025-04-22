
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import KitForm from '@/components/kits/KitForm';
import { Kit } from '@/types';
import { useState } from 'react';

interface KitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (kitData: Omit<Kit, 'id' | 'vezes_alugado'>) => Promise<void>;
  onCancel: () => void;
  editingKit: Kit | null;
  isLoading: boolean;
  title?: string;
  description?: string;
}

const KitDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  editingKit,
  isLoading,
  title,
  description
}: KitDialogProps) => {
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async (kitData: Omit<Kit, 'id' | 'vezes_alugado'>) => {
    setSubmitting(true);
    try {
      await onSubmit(kitData);
    } finally {
      setSubmitting(false);
    }
  };
  
  const dialogTitle = title || (editingKit ? 'Editar Kit' : 'Adicionar Novo Kit');
  const dialogDescription = description || `Preencha os dados para ${editingKit ? 'editar' : 'adicionar'} um kit.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        
        <KitForm 
          onSubmit={handleSubmit}
          onCancel={onCancel}
          initialData={editingKit}
          isEditing={!!editingKit}
          isLoading={isLoading || submitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default KitDialog;
