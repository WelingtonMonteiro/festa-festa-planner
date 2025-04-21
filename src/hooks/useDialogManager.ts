
import { useState } from 'react';
import { Kit, Them } from '@/types';

export const useDialogManager = () => {
  const [kitDialogOpen, setKitDialogOpen] = useState(false);
  const [themDialogOpen, setThemDialogOpen] = useState(false);
  const [deleteKitDialogOpen, setDeleteKitDialogOpen] = useState(false);
  const [deleteThemDialogOpen, setDeleteThemDialogOpen] = useState(false);
  const [kitToDelete, setKitToDelete] = useState<string | null>(null);
  const [themToDelete, setThemToDelete] = useState<string | null>(null);
  const [editingKit, setEditingKit] = useState<Kit | null>(null);
  const [editingThem, setEditingThem] = useState<Them | null>(null);

  const resetKitForm = () => setEditingKit(null);
  const resetThemForm = () => setEditingThem(null);

  return {
    kitDialogOpen,
    setKitDialogOpen,
    themDialogOpen,
    setThemDialogOpen,
    deleteKitDialogOpen,
    setDeleteKitDialogOpen,
    deleteThemDialogOpen,
    setDeleteThemDialogOpen,
    kitToDelete,
    setKitToDelete,
    themToDelete,
    setThemToDelete,
    editingKit,
    setEditingKit,
    editingThem,
    setEditingThem,
    resetKitForm,
    resetThemForm
  };
};
