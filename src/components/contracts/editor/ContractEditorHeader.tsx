
import { Variable } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Client, ContractTemplate, Contract } from '@/types';

interface ContractEditorHeaderProps {
  template?: ContractTemplate;
  contract?: Contract;
  previewClient?: Client;
  onEditVariables?: () => void;
}

const ContractEditorHeader = ({ 
  template, 
  contract, 
  previewClient,
  onEditVariables 
}: ContractEditorHeaderProps) => {
  return (
    <DialogHeader>
      <div className="flex justify-between items-center">
        <DialogTitle>
          {template ? `Editar Modelo: ${template.name}` : `Editar Contrato: ${contract?.title}`}
        </DialogTitle>
        {onEditVariables && template && (
          <Button 
            onClick={onEditVariables} 
            variant="outline" 
            size="sm" 
            className="flex gap-2"
          >
            <Variable className="h-4 w-4" />
            <span>Adicionar Variável</span>
          </Button>
        )}
      </div>
      {previewClient && (
        <DialogDescription>
          Visualizando com dados de: <strong>{previewClient.nome}</strong>
        </DialogDescription>
      )}
    </DialogHeader>
  );
};

export default ContractEditorHeader;
