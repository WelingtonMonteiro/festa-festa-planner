
import { useState } from 'react';
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

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setTemplateToEdit(null);
    setCurrentVariables([]);
  };

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

