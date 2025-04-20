
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteTemplate: () => Promise<void>;
  templateName?: string;
}

const DeleteTemplateDialog = ({
  isOpen,
  onOpenChange,
  onDeleteTemplate,
  templateName = 'este modelo',
}: DeleteTemplateDialogProps) => {
  
  const handleDelete = async () => {
    try {
      await onDeleteTemplate();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      // O toast de erro já é mostrado pelo serviço
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Modelo de Contrato</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir {templateName}? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTemplateDialog;
