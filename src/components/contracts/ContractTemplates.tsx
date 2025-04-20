import { useState, useCallback, useEffect } from 'react';
import { useHandleContext } from '@/contexts/handleContext';
import { ContractTemplate } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { toast } from 'sonner';
import ContractEditor from './ContractEditor';
import TemplatesList from './templates/TemplatesList';
import VariableForm from './templates/VariableForm';
import CreateTemplateDialog from './templates/CreateTemplateDialog';
import DeleteTemplateDialog from './templates/DeleteTemplateDialog';

export interface TemplateVariable {
  name: string;
  description: string;
  entity?: string;
  entityField?: string;
  defaultValue?: string;
}

interface ContractTemplatesProps {
  selectedTemplate: string | null;
  setSelectedTemplate: (id: string | null) => void;
  isActive?: boolean;
}

const ContractTemplates = ({ selectedTemplate, setSelectedTemplate, isActive = false }: ContractTemplatesProps) => {
  const { contractTemplates, addContractTemplate, updateContractTemplate, removeContractTemplate } = useHandleContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [templateToEdit, setTemplateToEdit] = useState<ContractTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [isVariableDialogOpen, setIsVariableDialogOpen] = useState(false);
  const [currentVariables, setCurrentVariables] = useState<TemplateVariable[]>([]);
  const [editingVariableIndex, setEditingVariableIndex] = useState<number | null>(null);

  const safeContractTemplates = contractTemplates || [];
  const filteredTemplates = safeContractTemplates.filter(template => 
    template && template.name && 
    template.name.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const handleCreateTemplate = useCallback(() => {
    if (!newTemplateName.trim()) {
      toast.error('O nome do modelo não pode estar vazio');
      return;
    }

    const templateData = {
      name: newTemplateName.trim(),
      content: `<h1>${newTemplateName}</h1><p>Insira aqui o conteúdo do contrato.</p>`
    };
    
    addContractTemplate(templateData);
    setNewTemplateName('');
    setIsCreateDialogOpen(false);
    
    setTimeout(() => {
      const newTemplate = contractTemplates.find(t => t.name === templateData.name);
      if (newTemplate) {
        setSelectedTemplate(newTemplate.id);
        setTemplateToEdit(newTemplate);
        setIsEditDialogOpen(true);
      }
    }, 100);
  }, [newTemplateName, addContractTemplate, setSelectedTemplate, contractTemplates]);

  const handleEditTemplate = useCallback((template: ContractTemplate) => {
    setTemplateToEdit(template);
    setSelectedTemplate(template.id);
    setIsEditDialogOpen(true);
  }, [setSelectedTemplate]);

  const handleDeleteTemplate = useCallback(() => {
    if (templateToDelete) {
      removeContractTemplate(templateToDelete);
      setTemplateToDelete(null);
      setIsDeleteDialogOpen(false);

      if (selectedTemplate === templateToDelete) {
        setSelectedTemplate(null);
      }
    }
  }, [templateToDelete, removeContractTemplate, selectedTemplate, setSelectedTemplate]);

  const handleCopyTemplate = useCallback((template: ContractTemplate) => {
    const copyData = {
      name: `${template.name} (Cópia)`,
      content: template.content
    };
    
    addContractTemplate(copyData);
    toast.success(`Modelo "${template.name}" copiado com sucesso`);
  }, [addContractTemplate]);

  const handleSaveTemplate = useCallback((content: string) => {
    if (templateToEdit) {
      updateContractTemplate(templateToEdit.id, { content });
      setTemplateToEdit(null);
      setIsEditDialogOpen(false);
      toast.success('Modelo salvo com sucesso');
    }
  }, [templateToEdit, updateContractTemplate]);

  const handleAddVariable = useCallback((data: any) => {
    if (editingVariableIndex !== null) {
      const newVariables = [...currentVariables];
      newVariables[editingVariableIndex] = data as TemplateVariable;
      setCurrentVariables(newVariables);
      if (templateToEdit) {
        updateContractTemplate(templateToEdit.id, {
          variables: JSON.stringify(newVariables)
        });
      }
    } else {
      const newVariables = [...currentVariables, data as TemplateVariable];
      setCurrentVariables(newVariables);
      if (templateToEdit) {
        updateContractTemplate(templateToEdit.id, {
          variables: JSON.stringify(newVariables)
        });
      }
    }
    setIsVariableDialogOpen(false);
    setEditingVariableIndex(null);
    toast.success(editingVariableIndex !== null ? 'Variável atualizada' : 'Variável adicionada');
  }, [currentVariables, templateToEdit, editingVariableIndex, updateContractTemplate]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar modelos de contrato..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Novo Modelo
        </Button>
      </div>

      <TemplatesList
        templates={filteredTemplates}
        onEdit={handleEditTemplate}
        onCopy={handleCopyTemplate}
        onDelete={(id) => {
          setTemplateToDelete(id);
          setIsDeleteDialogOpen(true);
        }}
      />

      <CreateTemplateDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        newTemplateName={newTemplateName}
        onNameChange={setNewTemplateName}
        onCreateTemplate={handleCreateTemplate}
      />

      <DeleteTemplateDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDeleteTemplate={handleDeleteTemplate}
      />

      {templateToEdit && (
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setTemplateToEdit(null);
            setCurrentVariables([]);
          }
        }}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <ContractEditor
              isOpen={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              template={templateToEdit}
              onSave={handleSaveTemplate}
              onEditVariables={() => setIsVariableDialogOpen(true)}
            />
          </DialogContent>
        </Dialog>
      )}

      {templateToEdit && (
        <Dialog open={isVariableDialogOpen} onOpenChange={setIsVariableDialogOpen}>
          <DialogContent>
            <VariableForm 
              onSubmit={handleAddVariable}
              onCancel={() => {
                setIsVariableDialogOpen(false);
                setEditingVariableIndex(null);
              }}
              currentVariables={currentVariables}
              editingVariable={editingVariableIndex !== null ? currentVariables[editingVariableIndex] : undefined}
              onEditVariable={(index) => {
                setEditingVariableIndex(index);
              }}
              onDeleteVariable={(index) => {
                const newVariables = currentVariables.filter((_, i) => i !== index);
                setCurrentVariables(newVariables);
                if (templateToEdit) {
                  updateContractTemplate(templateToEdit.id, {
                    variables: JSON.stringify(newVariables)
                  });
                }
                toast.success('Variável removida');
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ContractTemplates;
