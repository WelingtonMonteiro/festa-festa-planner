
import { useEffect } from 'react';
import { useDialogManager } from '@/hooks/useDialogManager';
import { useProductData } from '@/hooks/useProductData';
import { usePagination } from '@/hooks/usePagination';
import { Product } from '@/types/product';
import DeleteConfirmDialog from '@/components/kits-thems/DeleteConfirmDialog';
import ProductTabs from '@/components/products/tabs/ProductTabs';
import ProductDialog from '@/components/products/dialogs/ProductDialog';

const Products = () => {
  const {
    productDialogOpen, setProductDialogOpen,
    deleteProductDialogOpen, setDeleteProductDialogOpen,
    productToDelete, setProductToDelete,
    editingProduct, setEditingProduct,
    resetProductForm,
  } = useDialogManager();

  const {
    isLoading,
    products,
    loadData,
    handleProductSubmit,
    handleProductUpdate,
    handleProductDelete
  } = useProductData();

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
    };

    fetchData();
  }, [currentPage, limit]);

  const onProductSubmit = async (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      await handleProductUpdate(editingProduct.id, productData);
    } else {
      await handleProductSubmit(productData);
    }
    setProductDialogOpen(false);
    resetProductForm();
    loadData(currentPage, limit);
  };

  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      const success = await handleProductDelete(productToDelete);
      if (success) {
        loadData(currentPage, limit);
      }
      setDeleteProductDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleAddProduct = (type?: string) => {
    resetProductForm();
    setEditingProduct(null);
    setProductDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Produtos</h1>
        </div>
        
        <ProductTabs
          products={products}
          onAddProduct={handleAddProduct}
          onEditProduct={(product) => {
            setEditingProduct(product);
            setProductDialogOpen(true);
          }}
          onDeleteProduct={(id) => {
            setProductToDelete(id);
            setDeleteProductDialogOpen(true);
          }}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          paginationLinks={renderPaginationLinks()}
        />
      </div>

      <ProductDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        onSubmit={onProductSubmit}
        onCancel={() => {
          setProductDialogOpen(false);
          resetProductForm();
        }}
        editingProduct={editingProduct}
        availableKits={products.filter(p => p.type === 'kit')}
        isLoading={isLoading}
        type={editingProduct?.type}
      />

      <DeleteConfirmDialog 
        open={deleteProductDialogOpen}
        onOpenChange={setDeleteProductDialogOpen}
        onConfirm={confirmDeleteProduct}
        title="Excluir Produto"
        description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
      />
    </>
  );
};

export default Products;
