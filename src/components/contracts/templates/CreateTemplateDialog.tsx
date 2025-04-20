
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newTemplateName: string;
  onNameChange: (name: string) => void;
  onCreateTemplate: () => void;
  isCreating?: boolean;
}

const CreateTemplateDialog = ({
  isOpen,
  onOpenChange,
  newTemplateName,
  onNameChange,
  onCreateTemplate,
  isCreating = false
}: CreateTemplateDialogProps) => {
  const handleCreate = async () => {
    const result = await onCreateTemplate();
    if (result) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Modelo de Contrato</DialogTitle>
          <DialogDescription>
            Crie um novo modelo de contrato para usar com seus clientes.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Nome do modelo de contrato"
          value={newTemplateName}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCreate();
            }
          }}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? 'Criando...' : 'Criar Modelo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateDialog;
