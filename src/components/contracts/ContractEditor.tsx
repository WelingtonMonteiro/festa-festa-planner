
import { useState, useEffect } from 'react';
import { ContractTemplate, Contract } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// Add TinyMCE editor
<lov-add-dependency>react-quill@^2.0.0</lov-add-dependency>
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ContractEditorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  template?: ContractTemplate;
  contract?: Contract;
  onSave: (content: string) => void;
}

const ContractEditor = ({ 
  isOpen, 
  onOpenChange, 
  template, 
  contract, 
  onSave 
}: ContractEditorProps) => {
  const [content, setContent] = useState<string>('');
  const [initialContent, setInitialContent] = useState<string>('');
  
  useEffect(() => {
    if (template) {
      setContent(template.content);
      setInitialContent(template.content);
    } else if (contract) {
      setContent(contract.content);
      setInitialContent(contract.content);
    }
  }, [template, contract, isOpen]);

  const handleSave = () => {
    if (content.trim() === '') {
      toast.error('O conteúdo do contrato não pode estar vazio');
      return;
    }

    onSave(content);
    toast.success('Alterações salvas com sucesso');
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
      ['link', 'image'],
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
          <DialogTitle>
            {template ? `Editar Modelo: ${template.name}` : `Editar Contrato: ${contract?.title}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="bg-white p-4 min-h-[500px]">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={modules}
              className="h-[450px] mb-12"
            />
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Variáveis disponíveis:</h3>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <code className="bg-secondary px-1 py-0.5 rounded">{'{cliente.nome}'}</code>
            <code className="bg-secondary px-1 py-0.5 rounded">{'{cliente.email}'}</code>
            <code className="bg-secondary px-1 py-0.5 rounded">{'{cliente.telefone}'}</code>
            <code className="bg-secondary px-1 py-0.5 rounded">{'{cliente.endereco}'}</code>
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

export default ContractEditor;
