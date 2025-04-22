
import { TabsContent } from '@/components/ui/tabs';
import KitList from '@/components/kits/KitList';
import { DataPagination } from '@/components/common/DataPagination';
import { Kit } from '@/types';

interface KitsTabProps {
  kits: Kit[];
  onAddKit: () => void;
  onEditKit: (kit: Kit) => void;
  onDeleteKit: (id: string) => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  paginationLinks: any[];
  isActive?: boolean;
}

const KitsTab = ({
  kits,
  onAddKit,
  onEditKit,
  onDeleteKit,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  paginationLinks,
  isActive = true
}: KitsTabProps) => {
  return (
    <TabsContent value="kits" className={isActive ? 'block' : 'hidden'}>
      <KitList 
        kits={kits} 
        onAddKit={onAddKit}
        onEditKit={onEditKit}
        onDeleteKit={onDeleteKit}
        isLoading={isLoading}
      />
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        paginationLinks={paginationLinks}
      />
    </TabsContent>
  );
};

export default KitsTab;
