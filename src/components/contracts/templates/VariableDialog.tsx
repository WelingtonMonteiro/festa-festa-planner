import { Dialog, DialogContent } from '@/components/ui/dialog';
import VariableForm from './VariableForm';
import { TemplateVariable } from '@/types/contracts';

interface VariableDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  currentVariables: TemplateVariable[];
  editingVariable?: TemplateVariable;
  onEditVariable: (index: number) => void;
  onDeleteVariable: (index: number) => void;
}

const VariableDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  currentVariables,
  editingVariable,
  onEditVariable,
  onDeleteVariable,
}: VariableDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <VariableForm
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          currentVariables={currentVariables}
          editingVariable={editingVariable}
          onEditVariable={onEditVariable}
          onDeleteVariable={onDeleteVariable}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VariableDialog;
