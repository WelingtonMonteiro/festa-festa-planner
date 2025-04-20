
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteTemplate: () => void;
}

const DeleteTemplateDialog = ({
  isOpen,
  onOpenChange,
  onDeleteTemplate,
}: DeleteTemplateDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Modelo de Contrato</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir este modelo de contrato? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={onDeleteTemplate}>Excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTemplateDialog;
