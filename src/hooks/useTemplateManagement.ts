
import { useState, useCallback, useEffect } from 'react';
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
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

  const filteredTemplates = (contractTemplates || []).filter(template => 
    template && template.name && 
    template.name.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const handleCreateTemplate = useCallback(async () => {
    if (!newTemplateName.trim()) {
      toast.error('O nome do modelo não pode estar vazio');
      return;
    }

    setIsCreatingTemplate(true);

    try {
      const templateData = {
        name: newTemplateName.trim(),
        content: `<h1>${newTemplateName}</h1><p>Insira aqui o conteúdo do contrato.</p>`
      };
      
      const newTemplate = await addContractTemplate(templateData);
      setNewTemplateName('');
      
      // Selecionar o novo template após criação
      if (newTemplate && newTemplate.id) {
        onTemplateSelect?.(newTemplate.id);
        setTemplateToEdit(newTemplate);
      }
      
      toast.success(`Modelo "${templateData.name}" criado com sucesso`);
      return newTemplate;
    } catch (error) {
      console.error('Erro ao criar template:', error);
      toast.error('Erro ao criar modelo de contrato');
    } finally {
      setIsCreatingTemplate(false);
    }
  }, [newTemplateName, addContractTemplate, onTemplateSelect]);

  const handleEditTemplate = useCallback((template: ContractTemplate) => {
    setTemplateToEdit(template);
    
    // Carregar variáveis do template
    if (template.variables) {
      try {
        const parsedVariables = JSON.parse(template.variables);
        setCurrentVariables(Array.isArray(parsedVariables) ? parsedVariables : []);
      } catch (e) {
        console.error('Erro ao processar variáveis do template:', e);
        setCurrentVariables([]);
      }
    } else {
      setCurrentVariables([]);
    }
    
    onTemplateSelect?.(template.id);
  }, [onTemplateSelect]);

  const handleDeleteTemplate = useCallback(async () => {
    if (templateToDelete) {
      try {
        await removeContractTemplate(templateToDelete);
        toast.success('Modelo excluído com sucesso');
        
        if (onTemplateSelect) {
          onTemplateSelect(null);
        }
        return true;
      } catch (error) {
        console.error('Erro ao excluir template:', error);
        toast.error('Erro ao excluir modelo de contrato');
      }
    }
    return false;
  }, [templateToDelete, removeContractTemplate, onTemplateSelect]);

  const handleCopyTemplate = useCallback(async (template: ContractTemplate) => {
    const copyData = {
      name: `${template.name} (Cópia)`,
      content: template.content,
      variables: template.variables
    };
    
    try {
      await addContractTemplate(copyData);
      toast.success(`Modelo "${template.name}" copiado com sucesso`);
    } catch (error) {
      console.error('Erro ao copiar template:', error);
      toast.error('Erro ao copiar modelo');
    }
  }, [addContractTemplate]);

  const handleSaveTemplate = useCallback(async (content: string) => {
    if (templateToEdit) {
      try {
        await updateContractTemplate(templateToEdit.id, { content });
        toast.success('Modelo salvo com sucesso');
        return true;
      } catch (error) {
        console.error('Erro ao salvar template:', error);
        toast.error('Erro ao salvar modelo');
        return false;
      }
    }
    return false;
  }, [templateToEdit, updateContractTemplate]);

  const handleAddVariable = useCallback((data: any) => {
    if (!templateToEdit) return;

    try {
      let newVariables = [...currentVariables];
      
      if (editingVariableIndex !== null) {
        newVariables[editingVariableIndex] = data as TemplateVariable;
      } else {
        newVariables = [...newVariables, data as TemplateVariable];
      }
      
      setCurrentVariables(newVariables);
      updateContractTemplate(templateToEdit.id, {
        variables: JSON.stringify(newVariables)
      });
      
      setEditingVariableIndex(null);
      toast.success(editingVariableIndex !== null ? 'Variável atualizada' : 'Variável adicionada');
    } catch (error) {
      console.error('Erro ao adicionar/atualizar variável:', error);
      toast.error('Erro ao processar variável');
    }
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
    isCreatingTemplate,
    handleCreateTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
    handleCopyTemplate,
    handleSaveTemplate,
    handleAddVariable
  };
};
