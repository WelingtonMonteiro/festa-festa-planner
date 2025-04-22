
import { useState, useCallback } from 'react';
import { Kit, Them } from '@/types';
import { Product } from '@/types/product';

export const useDialogManager = () => {
  // Kit dialogs
  const [kitDialogOpen, setKitDialogOpen] = useState(false);
  const [deleteKitDialogOpen, setDeleteKitDialogOpen] = useState(false);
  const [kitToDelete, setKitToDelete] = useState<string | null>(null);
  const [editingKit, setEditingKit] = useState<Kit | null>(null);

  // Theme dialogs
  const [themDialogOpen, setThemDialogOpen] = useState(false);
  const [deleteThemDialogOpen, setDeleteThemDialogOpen] = useState(false);
  const [themToDelete, setThemToDelete] = useState<string | null>(null);
  const [editingThem, setEditingThem] = useState<Them | null>(null);
  
  // Product dialogs
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [deleteProductDialogOpen, setDeleteProductDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Template dialogs
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [deleteTemplateDialogOpen, setDeleteTemplateDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  
  // Variable dialogs
  const [variableDialogOpen, setVariableDialogOpen] = useState(false);
  const [deleteVariableDialogOpen, setDeleteVariableDialogOpen] = useState(false);
  const [variableToDelete, setVariableToDelete] = useState<any | null>(null);
  const [editingVariable, setEditingVariable] = useState<any | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const resetKitForm = useCallback(() => {
    setEditingKit(null);
  }, []);

  const resetThemForm = useCallback(() => {
    setEditingThem(null);
  }, []);
  
  const resetProductForm = useCallback(() => {
    setEditingProduct(null);
  }, []);

  const resetTemplateForm = useCallback(() => {
    setEditingTemplate(null);
  }, []);

  const resetVariableForm = useCallback(() => {
    setEditingVariable(null);
  }, []);

  return {
    // Kit dialog state
    kitDialogOpen,
    setKitDialogOpen,
    deleteKitDialogOpen,
    setDeleteKitDialogOpen,
    kitToDelete,
    setKitToDelete,
    editingKit,
    setEditingKit,
    resetKitForm,

    // Theme dialog state
    themDialogOpen,
    setThemDialogOpen,
    deleteThemDialogOpen,
    setDeleteThemDialogOpen,
    themToDelete,
    setThemToDelete,
    editingThem,
    setEditingThem,
    resetThemForm,
    
    // Product dialog state
    productDialogOpen,
    setProductDialogOpen,
    deleteProductDialogOpen,
    setDeleteProductDialogOpen,
    productToDelete,
    setProductToDelete,
    editingProduct,
    setEditingProduct,
    resetProductForm,

    // Template dialog state
    templateDialogOpen,
    setTemplateDialogOpen,
    deleteTemplateDialogOpen,
    setDeleteTemplateDialogOpen,
    templateToDelete,
    setTemplateToDelete,
    editingTemplate,
    setEditingTemplate,
    resetTemplateForm,
    
    // Variable dialog state
    variableDialogOpen,
    setVariableDialogOpen,
    deleteVariableDialogOpen,
    setDeleteVariableDialogOpen,
    variableToDelete,
    setVariableToDelete,
    editingVariable,
    setEditingVariable,
    selectedTemplateId,
    setSelectedTemplateId,
    resetVariableForm
  };
};
