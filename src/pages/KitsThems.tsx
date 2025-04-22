
import { useEffect } from 'react';
import { useDialogManager } from '@/hooks/useDialogManager';
import { useKitsThemsData } from '@/hooks/useKitsThemsData';
import { usePagination } from '@/hooks/usePagination';
import { Kit, Them } from '@/types';
import { unifiedThemService } from '@/services/unifiedThemService';
import { useApi } from '@/contexts/apiContext';
import { useStorage } from '@/contexts/storageContext';
import KitsThemsContent from '@/components/kits-thems/KitsThemsContent';
import KitsThemsDialogs from '@/components/kits-thems/KitsThemsDialogs';

const KitsThems = () => {
  const {
    kitDialogOpen, setKitDialogOpen,
    themDialogOpen, setThemDialogOpen,
    deleteKitDialogOpen, setDeleteKitDialogOpen,
    deleteThemDialogOpen, setDeleteThemDialogOpen,
    kitToDelete, setKitToDelete,
    themToDelete, setThemToDelete,
    editingKit, setEditingKit,
    editingThem, setEditingThem,
    resetKitForm, resetThemForm
  } = useDialogManager();

  const { apiType, apiUrl } = useApi();
  const { storageType } = useStorage();

  const getCurrentDataSource = () => {
    if (apiType === 'rest' && apiUrl) {
      return 'apiRest';
    } else if (storageType === 'supabase') {
      return 'supabase';
    }
    return 'localStorage';
  };

  const dataSource = getCurrentDataSource();

  const {
    isLoading,
    localKits,
    localThems,
    setLocalThems,
    loadData,
    handleKitSubmit,
    handleThemSubmit,
    handleKitUpdate,
    handleThemUpdate,
    handleKitDelete,
    handleThemDelete
  } = useKitsThemsData();

  const {
    currentPage,
    totalPages,
    limit,
    setTotalPages,
    setTotalItems,
    handlePageChange,
    renderPaginationLinks
  } = usePagination();

  useEffect(() => {
    const fetchData = async () => {
      const result = await loadData(currentPage, limit);
      setTotalPages(Math.ceil(result.total / limit));
      setTotalItems(result.total);
      
      try {
        const themResponse = await unifiedThemService.getAll(dataSource, result.kits, apiUrl, currentPage, limit);
        if ('data' in themResponse) {
          setLocalThems(themResponse.data);
        } else {
          setLocalThems(Array.isArray(themResponse) ? themResponse : []);
        }
      } catch (error) {
        console.error('Error loading themes:', error);
      }
    };

    fetchData();
  }, [currentPage, limit]);

  const onKitSubmit = async (kitData: Omit<Kit, 'id' | 'vezes_alugado'>) => {
    if (editingKit) {
      await handleKitUpdate(editingKit.id, kitData);
    } else {
      await handleKitSubmit(kitData);
    }
    setKitDialogOpen(false);
    resetKitForm();
    loadData(currentPage, limit);
  };

  const onThemSubmit = async (themData: Omit<Them, 'id' | 'vezes_alugado'>) => {
    if (editingThem) {
      await handleThemUpdate(editingThem.id, themData);
    } else {
      await handleThemSubmit(themData);
    }
    setThemDialogOpen(false);
    resetThemForm();
    loadData(currentPage, limit);
  };

  const confirmDeleteKit = async () => {
    if (kitToDelete) {
      const success = await handleKitDelete(kitToDelete);
      if (success) {
        loadData(currentPage, limit);
      }
      setDeleteKitDialogOpen(false);
      setKitToDelete(null);
    }
  };

  const confirmDeleteThem = async () => {
    if (themToDelete) {
      const success = await handleThemDelete(themToDelete);
      if (success) {
        loadData(currentPage, limit);
      }
      setDeleteThemDialogOpen(false);
      setThemToDelete(null);
    }
  };

  return (
    <>
      <KitsThemsContent
        localKits={localKits}
        localThems={localThems}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        renderPaginationLinks={renderPaginationLinks}
        onAddKit={() => {
          resetKitForm();
          setKitDialogOpen(true);
        }}
        onEditKit={(kit) => {
          setEditingKit(kit);
          setKitDialogOpen(true);
        }}
        onDeleteKit={(id) => {
          setKitToDelete(id);
          setDeleteKitDialogOpen(true);
        }}
        onAddThem={() => {
          resetThemForm();
          setThemDialogOpen(true);
        }}
        onEditThem={(them) => {
          setEditingThem(them);
          setThemDialogOpen(true);
        }}
        onDeleteThem={(id) => {
          setThemToDelete(id);
          setDeleteThemDialogOpen(true);
        }}
      />

      <KitsThemsDialogs
        kitDialogOpen={kitDialogOpen}
        setKitDialogOpen={setKitDialogOpen}
        themDialogOpen={themDialogOpen}
        setThemDialogOpen={setThemDialogOpen}
        deleteKitDialogOpen={deleteKitDialogOpen}
        setDeleteKitDialogOpen={setDeleteKitDialogOpen}
        deleteThemDialogOpen={deleteThemDialogOpen}
        setDeleteThemDialogOpen={setDeleteThemDialogOpen}
        editingKit={editingKit}
        editingThem={editingThem}
        resetKitForm={resetKitForm}
        resetThemForm={resetThemForm}
        onKitSubmit={onKitSubmit}
        onThemSubmit={onThemSubmit}
        confirmDeleteKit={confirmDeleteKit}
        confirmDeleteThem={confirmDeleteThem}
        isLoading={isLoading}
        localKits={localKits}
      />
    </>
  );
};

export default KitsThems;
