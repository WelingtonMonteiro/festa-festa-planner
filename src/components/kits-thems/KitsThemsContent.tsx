
import { Tabs } from '@/components/ui/tabs';
import { Kit, Them } from '@/types';
import TabsHeader from './tabs/TabsHeader';
import KitsTab from './tabs/KitsTab';
import ThemsTab from './tabs/ThemsTab';

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
        <TabsHeader />
        
        <KitsTab 
          kits={localKits}
          onAddKit={onAddKit}
          onEditKit={onEditKit}
          onDeleteKit={onDeleteKit}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          paginationLinks={renderPaginationLinks()}
        />
        
        <ThemsTab 
          themes={localThems}
          onAddThem={onAddThem}
          onEditThem={onEditThem}
          onDeleteThem={onDeleteThem}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          paginationLinks={renderPaginationLinks()}
        />
      </Tabs>
    </div>
  );
};

export default KitsThemsContent;
