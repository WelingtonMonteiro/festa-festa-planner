
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Tag } from 'lucide-react';
import KitList from '@/components/kits/KitList';
import ThemList from '@/components/thems/ThemList';
import { DataPagination } from '@/components/common/DataPagination';
import { Kit, Them } from '@/types';

interface KitsThemsContentProps {
  localKits: Kit[];
  localThems: Them[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  renderPaginationLinks: () => any[];
  onAddKit: () => void;
  onEditKit: (kit: Kit) => void;
  onDeleteKit: (id: string) => void;
  onAddThem: () => void;
  onEditThem: (them: Them) => void;
  onDeleteThem: (id: string) => void;
}

const KitsThemsContent = ({
  localKits,
  localThems,
  isLoading,
  currentPage,
  totalPages,
  handlePageChange,
  renderPaginationLinks,
  onAddKit,
  onEditKit,
  onDeleteKit,
  onAddThem,
  onEditThem,
  onDeleteThem,
}: KitsThemsContentProps) => {
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
            onAddKit={onAddKit}
            onEditKit={onEditKit}
            onDeleteKit={onDeleteKit}
            isLoading={isLoading}
          />
          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            paginationLinks={renderPaginationLinks()}
          />
        </TabsContent>
        
        <TabsContent value="temas">
          <ThemList 
            themes={localThems}
            onAddThem={onAddThem}
            onEditThem={onEditThem}
            onDeleteThem={onDeleteThem}
            isLoading={isLoading}
          />
          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            paginationLinks={renderPaginationLinks()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KitsThemsContent;
