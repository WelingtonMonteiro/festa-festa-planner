import { useState, useCallback } from 'react';
import { useHandleContext } from '@/contexts/handleContext';
import { ContractTemplate } from '@/types';
import { TemplateVariable } from '@/types/contracts';
import { toast } from 'sonner';

interface UseTemplateManagementProps {
  onTemplateSelect?: (id: string | null) => void;
}

export const useTemplateManagement = ({ onTemplateSelect }: UseTemplateManagementProps = {}) => {
  const { contractTemplates, addContractTemplate, updateContractTemplate, removeContractTemplate } = useHandleContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [templateToEdit, setTemplateToEdit] = useState<ContractTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [currentVariables, setCurrentVariables] = useState<TemplateVariable[]>([]);
  const [editingVariableIndex, setEditingVariableIndex] = useState<number | null>(null);

  const filteredTemplates = (contractTemplates || []).filter(template => 
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
    
    setTimeout(() => {
      const newTemplate = contractTemplates.find(t => t.name === templateData.name);
      if (newTemplate) {
        onTemplateSelect?.(newTemplate.id);
        setTemplateToEdit(newTemplate);
      }
    }, 100);
  }, [newTemplateName, addContractTemplate, onTemplateSelect, contractTemplates]);

  const handleEditTemplate = useCallback((template: ContractTemplate) => {
    setTemplateToEdit(template);
    onTemplateSelect?.(template.id);
  }, [onTemplateSelect]);

  const handleDeleteTemplate = useCallback(() => {
    if (templateToDelete) {
      removeContractTemplate(templateToDelete);
      setTemplateToDelete(null);

      if (onTemplateSelect) {
        onTemplateSelect(null);
      }
    }
  }, [templateToDelete, removeContractTemplate, onTemplateSelect]);

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
    setEditingVariableIndex(null);
    toast.success(editingVariableIndex !== null ? 'Variável atualizada' : 'Variável adicionada');
  }, [currentVariables, templateToEdit, editingVariableIndex, updateContractTemplate]);

  return {
    searchQuery,
    setSearchQuery,
    newTemplateName,
    setNewTemplateName,
    templateToEdit,
    setTemplateToEdit,
    templateToDelete,
    setTemplateToDelete,
    currentVariables,
    setCurrentVariables,
    editingVariableIndex,
    setEditingVariableIndex,
    filteredTemplates,
    handleCreateTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
    handleCopyTemplate,
    handleSaveTemplate,
    handleAddVariable
  };
};
