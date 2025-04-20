
import { useState, useEffect, useRef } from 'react';
import { ContractTemplate, Contract, Client } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Variable } from 'lucide-react';
import { TemplateVariable } from './ContractTemplates'; // Importando a interface do outro arquivo

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
  const editorRef = useRef<ReactQuill>(null);

  // Use this effect to only set content when the dialog is opened or the template/contract changes
  useEffect(() => {
    if (isOpen) {
      if (template) {
        // Delay initialization slightly to avoid freezing
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
      // Reset the initializing state when the dialog closes
      setIsInitializing(true);
    }
  }, [template, contract, isOpen, previewClient]);

  // Update processed content whenever content or previewClient changes
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

    // Call the save function passed from the parent
    onSave(content);
    
    // Close the dialog after saving with a slight delay to prevent errors
    setTimeout(() => {
      onOpenChange(false);
    }, 200);
  };

  const handleCancel = () => {
    setContent(initialContent);
    onOpenChange(false);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }]
    ],
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
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
        
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="bg-white p-4 min-h-[500px]">
            {!isInitializing && (
              <ReactQuill 
                ref={editorRef}
                theme="snow" 
                value={previewClient ? processedContent : content}
                onChange={setContent} 
                modules={modules}
                className="h-[450px] mb-12"
              />
            )}
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Variáveis disponíveis:</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            {template?.variables ? 
              Object.entries(groupVariablesByEntity(parseTemplateVariables(template.variables))).map(([entity, variables]) => (
                Array.isArray(variables) && variables.length > 0 && (
                  <div key={entity} className="border rounded p-2">
                    <h4 className="font-medium mb-1 capitalize">{entity}</h4>
                    <div className="flex flex-wrap gap-1">
                      {variables.map((variable: TemplateVariable, index: number) => (
                        <div key={index} className="flex items-center gap-1">
                          <code className="bg-secondary px-1 py-0.5 rounded">
                            {`{${variable.name}}`}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))
            : null}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to parse template variables from string to array
const parseTemplateVariables = (variables: string | undefined): TemplateVariable[] => {
  if (!variables) return [];
  
  try {
    const parsedVariables = JSON.parse(variables);
    if (!Array.isArray(parsedVariables)) return [];
    
    // Garantir que cada item tem as propriedades obrigatórias
    return parsedVariables.filter(item => {
      // Filtramos itens que não tenham as propriedades obrigatórias
      return item && typeof item === 'object' && 
             typeof item.name === 'string' && 
             typeof item.description === 'string';
    }) as TemplateVariable[];
  } catch (error) {
    console.error('Erro ao analisar variáveis:', error);
    return [];
  }
};

// Helper function to group variables by entity
const groupVariablesByEntity = (variables: TemplateVariable[]) => {
  return variables.reduce((groups: Record<string, TemplateVariable[]>, variable) => {
    const entity = variable.entity || 'outros';
    if (!groups[entity]) {
      groups[entity] = [];
    }
    groups[entity].push(variable);
    return groups;
  }, {});
};

// Helper function to replace variables with actual data
const replaceVariables = (text: string, client: Client) => {
  if (!text) return '';

  const today = new Date();
  
  const replacements: Record<string, string> = {
    '{cliente.nome}': client.nome || '',
    '{cliente.email}': client.email || '',
    '{cliente.telefone}': client.telefone || '',
    '{cliente.endereco}': client.endereco || '',
    '{empresa.nome}': 'Festana Decorações',
    '{empresa.telefone}': '(11) 98765-4321',
    '{empresa.email}': 'contato@festanadecoracoes.com',
    '{data.hoje}': today.toLocaleDateString('pt-BR'),
    '{data.mes}': today.toLocaleDateString('pt-BR', { month: 'long' }),
    '{data.ano}': today.getFullYear().toString(),
    // Additional placeholders for event, kit, and theme could be populated if data was available
    '{evento.nome}': 'Nome do Evento',
    '{evento.data}': today.toLocaleDateString('pt-BR'),
    '{evento.local}': 'Local do Evento',
    '{evento.valor}': 'R$ 0,00',
    '{kit.nome}': 'Kit Básico',
    '{kit.descricao}': 'Descrição do Kit',
    '{kit.valor}': 'R$ 0,00',
    '{tema.nome}': 'Tema Padrão',
    '{tema.descricao}': 'Descrição do Tema',
    '{tema.valor}': 'R$ 0,00',
  };

  let processedText = text;
  
  Object.entries(replacements).forEach(([variable, value]) => {
    processedText = processedText.replace(new RegExp(variable, 'g'), value);
  });
  
  return processedText;
};

export default ContractEditor;
