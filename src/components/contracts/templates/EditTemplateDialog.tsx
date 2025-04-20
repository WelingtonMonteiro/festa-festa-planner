
import { ContractTemplate } from '@/types';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ContractEditor from '../ContractEditor';

interface EditTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  template: ContractTemplate | null;
  onSave: (content: string) => void;
  onEditVariables: () => void;
}

const EditTemplateDialog = ({
  isOpen,
  onOpenChange,
  template,
  onSave,
  onEditVariables,
}: EditTemplateDialogProps) => {
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        {/* Adding DialogTitle and DialogDescription for accessibility */}
        <DialogTitle className="sr-only">
          {template ? `Editar Modelo: ${template.name}` : 'Editor de Modelo'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Editor de modelo de contrato com formatação avançada
        </DialogDescription>
        
        {template && (
          <ContractEditor
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            template={template}
            onSave={(content) => {
              onSave(content);
              onOpenChange(false); // Fechar a modal após salvar
            }}
            onEditVariables={onEditVariables}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplateDialog;
