
import { useState, useEffect } from 'react';
import { ContractTemplate } from '@/types';
import { TemplateVariable } from '@/types/contracts';

export const useTemplateDialogs = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isVariableDialogOpen, setIsVariableDialogOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<ContractTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [currentVariables, setCurrentVariables] = useState<TemplateVariable[]>([]);
  const [editingVariableIndex, setEditingVariableIndex] = useState<number | null>(null);

  // Efeito para carregar as variáveis quando o template é definido
  useEffect(() => {
    if (templateToEdit && templateToEdit.variables) {
      try {
        const parsedVariables = JSON.parse(templateToEdit.variables);
        setCurrentVariables(Array.isArray(parsedVariables) ? parsedVariables : []);
      } catch (e) {
        console.error('Erro ao processar variáveis do template:', e);
        setCurrentVariables([]);
      }
    } else {
      setCurrentVariables([]);
    }
  }, [templateToEdit]);

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  // Limpar estados quando a modal de edição é fechada
  useEffect(() => {
    if (!isEditDialogOpen) {
      // Aguardar um pouco para garantir que a animação de fechamento seja concluída
      const timer = setTimeout(() => {
        setTemplateToEdit(null);
        setCurrentVariables([]);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isEditDialogOpen]);

  return {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isVariableDialogOpen,
    setIsVariableDialogOpen,
    templateToEdit,
    setTemplateToEdit,
    templateToDelete,
    setTemplateToDelete,
    currentVariables,
    setCurrentVariables,
    editingVariableIndex,
    setEditingVariableIndex,
    closeEditDialog
  };
};
