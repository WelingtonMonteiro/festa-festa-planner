
import { useState, useEffect } from 'react';
import { ContractTemplate, Contract, Client } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { replaceVariables } from '@/utils/contractUtils';
import ContractEditorHeader from './editor/ContractEditorHeader';
import ContractEditorQuill from './editor/ContractEditorQuill';
import ContractVariablesReference from './editor/ContractVariablesReference';

interface ContractEditorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  template?: ContractTemplate;
  contract?: Contract;
  onSave: (content: string) => void;
  previewClient?: Client;
  onEditVariables?: () => void;
}

const ContractEditor = ({ 
  isOpen, 
  onOpenChange, 
  template, 
  contract, 
  onSave,
  previewClient,
  onEditVariables
}: ContractEditorProps) => {
  const [content, setContent] = useState<string>('');
  const [initialContent, setInitialContent] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [processedContent, setProcessedContent] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (template) {
        setTimeout(() => {
          setContent(template.content);
          setInitialContent(template.content);
          if (previewClient) {
            setProcessedContent(replaceVariables(template.content, previewClient));
          } else {
            setProcessedContent(template.content);
          }
          setIsInitializing(false);
        }, 100);
      } else if (contract) {
        setTimeout(() => {
          setContent(contract.content);
          setInitialContent(contract.content);
          if (previewClient) {
            setProcessedContent(replaceVariables(contract.content, previewClient));
          } else {
            setProcessedContent(contract.content);
          }
          setIsInitializing(false);
        }, 100);
      }
    } else {
      setIsInitializing(true);
    }
  }, [template, contract, isOpen, previewClient]);

  useEffect(() => {
    if (previewClient && !isInitializing) {
      setProcessedContent(replaceVariables(content, previewClient));
    }
  }, [content, previewClient, isInitializing]);

  const handleSave = () => {
    if (content.trim() === '') {
      toast.error('O conteúdo do contrato não pode estar vazio');
      return;
    }

    onSave(content);
    setTimeout(() => onOpenChange(false), 200);
  };

  const handleCancel = () => {
    setContent(initialContent);
    onOpenChange(false);
  };

  const editorTitle = template 
    ? `Editar Modelo: ${template.name}` 
    : contract 
      ? `Editar Contrato: ${contract.title}` 
      : 'Editor de Documento';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        {/* Adding DialogTitle and DialogDescription for accessibility */}
        <DialogTitle className="sr-only">{editorTitle}</DialogTitle>
        <DialogDescription className="sr-only">
          Editor de documento com formatação avançada
        </DialogDescription>
        
        <ContractEditorHeader 
          template={template}
          contract={contract}
          previewClient={previewClient}
          onEditVariables={onEditVariables}
        />
        
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="bg-white p-4 min-h-[500px]">
            <ContractEditorQuill
              content={content}
              processedContent={processedContent}
              onChange={setContent}
              isInitializing={isInitializing}
              previewClient={!!previewClient}
            />
          </div>
        </div>
        
        <ContractVariablesReference variables={template?.variables} />
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContractEditor;
