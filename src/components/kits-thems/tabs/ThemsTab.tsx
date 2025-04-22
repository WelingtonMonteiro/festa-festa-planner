
import { TabsContent } from '@/components/ui/tabs';
import ThemList from '@/components/thems/ThemList';
import { DataPagination } from '@/components/common/DataPagination';
import { Them } from '@/types';

interface ThemsTabProps {
  themes: Them[];
  onAddThem: () => void;
  onEditThem: (them: Them) => void;
  onDeleteThem: (id: string) => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  paginationLinks: any[];
}

const ThemsTab = ({
  themes,
  onAddThem,
  onEditThem,
  onDeleteThem,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  paginationLinks
}: ThemsTabProps) => {
  return (
    <TabsContent value="temas">
      <ThemList 
        themes={themes}
        onAddThem={onAddThem}
        onEditThem={onEditThem}
        onDeleteThem={onDeleteThem}
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

export default ThemsTab;
