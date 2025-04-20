
import { TemplateVariable } from '@/types/contracts';
import { groupVariablesByEntity } from '@/utils/contractUtils';

interface ContractVariablesReferenceProps {
  variables?: string;
}

const ContractVariablesReference = ({ variables }: ContractVariablesReferenceProps) => {
  if (!variables) return null;

  return (
    <div className="border-t pt-4">
      <h3 className="text-sm font-medium mb-2">Variáveis disponíveis:</h3>
      <div className="flex flex-wrap gap-2 text-xs">
        {Object.entries(groupVariablesByEntity(JSON.parse(variables))).map(([entity, vars]) => (
          Array.isArray(vars) && vars.length > 0 && (
            <div key={entity} className="border rounded p-2">
              <h4 className="font-medium mb-1 capitalize">{entity}</h4>
              <div className="flex flex-wrap gap-1">
                {vars.map((variable: TemplateVariable, index: number) => (
                  <div key={index} className="flex items-center gap-1">
                    <code className="bg-secondary px-1 py-0.5 rounded">
                      {`{${variable.name}}`}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default ContractVariablesReference;
