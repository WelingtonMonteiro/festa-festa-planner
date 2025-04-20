
import { ContractTemplate } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
      onOpenChange={(open) => {
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        {template && (
          <ContractEditor
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            template={template}
            onSave={onSave}
            onEditVariables={onEditVariables}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplateDialog;
