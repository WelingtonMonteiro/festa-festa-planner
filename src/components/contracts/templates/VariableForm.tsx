
import { TemplateVariable } from '@/types/contracts';
import VariableFields from './variables/VariableFields';
import VariableList from './variables/VariableList';
import type { VariableFormData } from './variables/VariableFields';

interface VariableFormProps {
  onSubmit: (data: VariableFormData) => void;
  onCancel: () => void;
  currentVariables: TemplateVariable[];
  editingVariable?: TemplateVariable;
  onEditVariable: (index: number) => void;
  onDeleteVariable: (index: number) => void;
}

const VariableForm = ({ 
  onSubmit, 
  onCancel, 
  currentVariables, 
  editingVariable,
  onEditVariable,
  onDeleteVariable
}: VariableFormProps) => {
  return (
    <div className="space-y-6">
      <VariableFields
        onSubmit={onSubmit}
        onCancel={onCancel}
        editingVariable={editingVariable}
      />
      
      <VariableList
        variables={currentVariables}
        onEdit={onEditVariable}
        onDelete={onDeleteVariable}
      />
    </div>
  );
};

export default VariableForm;
