import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useHandleContext } from '@/contexts/handleContext';
import { Package, Tag } from 'lucide-react';
import { toast } from 'sonner';
import KitList from '@/components/kits/KitList';
import KitForm from '@/components/kits/KitForm';
import ThemList from '@/components/thems/ThemList';
import ThemForm from '@/components/thems/ThemForm';
import DeleteConfirmDialog from '@/components/kits-thems/DeleteConfirmDialog';
import { Kit, Them } from '@/types';
import { useStorage } from '@/contexts/storageContext';
import { useApi } from '@/contexts/apiContext';
import { unifiedKitService, DataSource } from '@/services/unifiedKitService';
import { unifiedThemService } from '@/services/unifiedThemService';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const KitsThems = () => {
  const { addKit, addThems, updateKit, updateThems, removeKit, removeThems } = useHandleContext();
  const { storageType } = useStorage();
  const { apiType, apiUrl } = useApi();
  
  const [kitDialogOpen, setKitDialogOpen] = useState(false);
  const [themDialogOpen, setThemDialogOpen] = useState(false);
  const [deleteKitDialogOpen, setDeleteKitDialogOpen] = useState(false);
  const [deleteThemDialogOpen, setDeleteThemDialogOpen] = useState(false);
  const [kitToDelete, setKitToDelete] = useState<string | null>(null);
  const [themToDelete, setThemToDelete] = useState<string | null>(null);
  const [editingKit, setEditingKit] = useState<Kit | null>(null);
  const [editingThem, setEditingThem] = useState<Them | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [localKits, setLocalKits] = useState<Kit[]>([]);
  const [localThems, setLocalThems] = useState<Them[]>([]);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const getCurrentDataSource = (): DataSource => {
    if (apiType === 'rest' && apiUrl) {
      return 'apiRest';
    } else if (storageType === 'supabase') {
      return 'supabase';
    } else {
      return 'localStorage';
    }
  };

  const dataSource = getCurrentDataSource();
  
  const loadData = async (page = 1) => {
    setIsLoading(true);
    try {
      console.log(`Carregando dados da página ${page} com limite ${limit}...`);
      const kitResponse = await unifiedKitService.getAll(dataSource, apiUrl, page, limit);
      
      // Verificar se kitResponse é um objeto com estrutura de paginação
      if (kitResponse && 'data' in kitResponse) {
        setLocalKits(kitResponse.data);
        setTotalPages(Math.ceil(kitResponse.total / kitResponse.limit));
        setTotalItems(kitResponse.total);
        console.log(`Total de kits: ${kitResponse.total}, Página: ${kitResponse.page}/${Math.ceil(kitResponse.total / kitResponse.limit)}`);
      } else {
        // Se não for paginado, trata como array simples
        setLocalKits(Array.isArray(kitResponse) ? kitResponse : []);
        console.log(`Kits carregados sem paginação: ${Array.isArray(kitResponse) ? kitResponse.length : 0}`);
      }
      
      const themResponse = await unifiedThemService.getAll(dataSource, localKits, apiUrl, page, limit);
      
      // Verificar se themResponse é um objeto com estrutura de paginação
      if (themResponse && 'data' in themResponse) {
        setLocalThems(themResponse.data);
      } else {
        setLocalThems(Array.isArray(themResponse) ? themResponse : []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Falha ao carregar kits e temas');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log('Iniciando carregamento de dados...');
        console.log('Data source:', dataSource);
        console.log('API URL:', apiUrl);
        
        const kitResponse = await unifiedKitService.getAll(dataSource, apiUrl, currentPage, limit);
        console.log('Resposta dos kits:', kitResponse);
        
        if (kitResponse && 'data' in kitResponse) {
          setLocalKits(kitResponse.data);
          setTotalPages(Math.ceil(kitResponse.total / kitResponse.limit));
          setTotalItems(kitResponse.total);
        } else {
          setLocalKits(Array.isArray(kitResponse) ? kitResponse : []);
        }
        
        const themResponse = await unifiedThemService.getAll(dataSource, localKits, apiUrl, currentPage, limit);
        console.log('Resposta dos temas:', themResponse);
        
        if (themResponse && 'data' in themResponse) {
          setLocalThems(themResponse.data);
        } else {
          setLocalThems(Array.isArray(themResponse) ? themResponse : []);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Falha ao carregar kits e temas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, dataSource, apiUrl]);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const resetKitForm = () => {
    setEditingKit(null);
  };
  
  const resetThemForm = () => {
    setEditingThem(null);
  };
  
  const handleKitSubmit = async (kitData: Omit<Kit, 'id' | 'vezes_alugado'>) => {
    setIsLoading(true);
    
    try {
      if (editingKit) {
        const updatedKit = await unifiedKitService.update(
          editingKit.id,
          {
            ...kitData,
            vezes_alugado: editingKit.vezes_alugado || 0
          },
          dataSource,
          apiUrl
        );
        
        if (updatedKit) {
          // Recarregar dados para obter a lista atualizada
          loadData(currentPage);
          updateKit(editingKit.id, kitData);
          toast.success(`Kit atualizado com sucesso via ${dataSource}`);
        } else {
          throw new Error(`Falha ao atualizar kit via ${dataSource}`);
        }
      } else {
        const newKit = await unifiedKitService.create(kitData, dataSource, apiUrl);
        
        if (newKit) {
          // Recarregar dados para obter a lista atualizada
          loadData(currentPage);
          addKit(newKit);
          toast.success(`Kit adicionado com sucesso via ${dataSource}`);
        } else {
          throw new Error(`Falha ao adicionar kit via ${dataSource}`);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar kit:', error);
      toast.error('Falha ao salvar kit');
    } finally {
      setIsLoading(false);
      setKitDialogOpen(false);
      resetKitForm();
    }
  };
  
  const handleThemSubmit = async (themData: Omit<Them, 'id' | 'vezes_alugado'>) => {
    setIsLoading(true);
    
    try {
      if (editingThem) {
        const updatedThem = await unifiedThemService.update(
          editingThem.id,
          {
            ...themData,
            vezes_alugado: editingThem.vezes_alugado || 0
          },
          dataSource,
          localKits,
          apiUrl
        );
        
        if (updatedThem) {
          // Recarregar dados para obter a lista atualizada
          loadData(currentPage);
          updateThems(editingThem.id, themData);
          toast.success(`Tema atualizado com sucesso via ${dataSource}`);
        } else {
          throw new Error(`Falha ao atualizar tema via ${dataSource}`);
        }
      } else {
        const newThem = await unifiedThemService.create(themData, dataSource, localKits, apiUrl);
        
        if (newThem) {
          // Recarregar dados para obter a lista atualizada
          loadData(currentPage);
          addThems(newThem);
          toast.success(`Tema adicionado com sucesso via ${dataSource}`);
        } else {
          throw new Error(`Falha ao adicionar tema via ${dataSource}`);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
      toast.error('Falha ao salvar tema');
    } finally {
      setIsLoading(false);
      setThemDialogOpen(false);
      resetThemForm();
    }
  };
  
  const handleEditKit = (kit: Kit) => {
    console.log('Editing kit:', kit);
    setEditingKit(kit);
    setKitDialogOpen(true);
  };
  
  const handleEditTema = (tema: Them) => {
    console.log('Editing theme:', tema);
    setEditingThem(tema);
    setThemDialogOpen(true);
  };

  const handleDeleteKitClick = (id: string) => {
    console.log('Setting kit to delete:', id);
    setKitToDelete(id);
    setDeleteKitDialogOpen(true);
  };

  const handleDeleteThemClick = (id: string) => {
    console.log('Setting theme to delete:', id);
    setThemToDelete(id);
    setDeleteThemDialogOpen(true);
  };

  const confirmDeleteKit = async () => {
    if (kitToDelete) {
      setIsLoading(true);
      
      try {
        console.log('Confirming delete kit with ID:', kitToDelete);
        const success = await unifiedKitService.delete(kitToDelete, dataSource, apiUrl);
        
        if (success) {
          // Recarregar dados para obter a lista atualizada
          loadData(currentPage);
          removeKit(kitToDelete);
          toast.success(`Kit excluído com sucesso via ${dataSource}`);
        } else {
          throw new Error(`Falha ao excluir kit via ${dataSource}`);
        }
      } catch (error) {
        console.error('Erro ao excluir kit:', error);
        toast.error('Falha ao excluir kit');
      } finally {
        setIsLoading(false);
        setDeleteKitDialogOpen(false);
        setKitToDelete(null);
      }
    }
  };

  const confirmDeleteThem = async () => {
    if (themToDelete) {
      setIsLoading(true);
      
      try {
        console.log('Confirming delete theme with ID:', themToDelete);
        const success = await unifiedThemService.delete(themToDelete, dataSource, apiUrl);
        
        if (success) {
          // Recarregar dados para obter a lista atualizada
          loadData(currentPage);
          removeThems(themToDelete);
          toast.success(`Tema excluído com sucesso via ${dataSource}`);
        } else {
          throw new Error(`Falha ao excluir tema via ${dataSource}`);
        }
      } catch (error) {
        console.error('Erro ao excluir tema:', error);
        toast.error('Falha ao excluir tema');
      } finally {
        setIsLoading(false);
        setDeleteThemDialogOpen(false);
        setThemToDelete(null);
      }
    }
  };

  // Renderização de links de paginação
  const renderPaginationLinks = () => {
    const links = [];
    const maxDisplayedPages = 5;
    
    // Primeira página sempre visível
    links.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => handlePageChange(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Se tivermos mais de maxDisplayedPages páginas e estamos além da página 3
    if (totalPages > maxDisplayedPages && currentPage > 3) {
      links.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Páginas intermediárias
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i <= 1 || i >= totalPages) continue; // Skip 1 and totalPages as they're always shown
      
      links.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Se tivermos mais de maxDisplayedPages páginas e estamos antes da antepenúltima página
    if (totalPages > maxDisplayedPages && currentPage < totalPages - 2) {
      links.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Última página sempre visível (se tivermos mais de 1 página)
    if (totalPages > 1) {
      links.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)} 
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return links;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kits & Temas</h1>
      </div>
      
      <Tabs defaultValue="kits" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="kits" className="flex items-center">
            <Package className="mr-2 h-4 w-4" /> Kits
          </TabsTrigger>
          <TabsTrigger value="temas" className="flex items-center">
            <Tag className="mr-2 h-4 w-4" /> Temas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="kits">
          <KitList 
            kits={localKits} 
            onAddKit={() => {
              resetKitForm();
              setKitDialogOpen(true);
            }} 
            onEditKit={handleEditKit}
            onDeleteKit={handleDeleteKitClick}
            isLoading={isLoading}
          />
          
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                      aria-disabled={currentPage === 1}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {renderPaginationLinks()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} 
                      aria-disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="temas">
          <ThemList 
            themes={Array.isArray(localThems) ? localThems : []} 
            onAddThem={() => {
              resetThemForm();
              setThemDialogOpen(true);
            }}
            onEditThem={handleEditTema}
            onDeleteThem={handleDeleteThemClick}
            isLoading={isLoading}
          />
          
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                      aria-disabled={currentPage === 1}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {renderPaginationLinks()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} 
                      aria-disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={kitDialogOpen} onOpenChange={setKitDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingKit ? 'Editar Kit' : 'Adicionar Novo Kit'}</DialogTitle>
            <DialogDescription>
              Preencha os dados para {editingKit ? 'editar' : 'adicionar'} um kit.
            </DialogDescription>
          </DialogHeader>
          
          <KitForm 
            onSubmit={handleKitSubmit}
            onCancel={() => {
              setKitDialogOpen(false);
              resetKitForm();
            }}
            initialData={editingKit}
            isEditing={!!editingKit}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={themDialogOpen} onOpenChange={setThemDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingThem ? 'Editar Tema' : 'Adicionar Novo Tema'}</DialogTitle>
            <DialogDescription>
              Preencha os dados para {editingThem ? 'editar' : 'adicionar'} um tema.
            </DialogDescription>
          </DialogHeader>
          
          <ThemForm 
            onSubmit={handleThemSubmit}
            onCancel={() => {
              setThemDialogOpen(false);
              resetThemForm();
            }}
            initialData={editingThem}
            isEditing={!!editingThem}
            kits={localKits}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog 
        open={deleteKitDialogOpen}
        onOpenChange={setDeleteKitDialogOpen}
        onConfirm={confirmDeleteKit}
        title="Excluir Kit"
        description="Tem certeza que deseja excluir este kit? Esta ação não pode ser desfeita."
      />

      <DeleteConfirmDialog 
        open={deleteThemDialogOpen}
        onOpenChange={setDeleteThemDialogOpen}
        onConfirm={confirmDeleteThem}
        title="Excluir Tema"
        description="Tem certeza que deseja excluir este tema? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default KitsThems;
