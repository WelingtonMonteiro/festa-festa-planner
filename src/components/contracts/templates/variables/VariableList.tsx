
import { TemplateVariable } from '@/types/contracts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

interface VariableListProps {
  variables: TemplateVariable[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const VariableList = ({ variables, onEdit, onDelete }: VariableListProps) => {
  const groupVariables = (variables: TemplateVariable[]): Record<string, TemplateVariable[]> => {
    return variables.reduce((acc: Record<string, TemplateVariable[]>, variable) => {
      const entity = variable.entity || 'outros';
      if (!acc[entity]) {
        acc[entity] = [];
      }
      acc[entity].push(variable);
      return acc;
    }, {});
  };

  const groupedVariables = groupVariables(variables);

  if (variables.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h4 className="font-medium mb-2">Variáveis Existentes</h4>
      {Object.entries(groupedVariables).map(([entity, entityVariables]) => (
        entityVariables.length > 0 && (
          <div key={entity} className="mb-4">
            <h5 className="text-sm font-medium mb-2 capitalize">{entity}</h5>
            <div className="space-y-2">
              {entityVariables.map((variable: TemplateVariable, index: number) => {
                const globalIndex = variables.findIndex(v => v === variable);
                return (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <Badge variant="secondary" className="mb-1">
                        {`{${variable.name}}`}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{variable.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEdit(globalIndex)}
                        title="Editar variável"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onDelete(globalIndex)}
                        title="Remover variável"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default VariableList;
