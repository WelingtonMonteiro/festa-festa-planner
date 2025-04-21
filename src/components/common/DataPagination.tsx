
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  paginationLinks: Array<{
    type: string;
    page?: number;
    isActive?: boolean;
  }>;
}

export const DataPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  paginationLinks
}: DataPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {paginationLinks.map((link, index) => (
            <PaginationItem key={`${link.type}-${index}`}>
              {link.type === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink 
                  onClick={() => link.page && onPageChange(link.page)} 
                  isActive={link.isActive}
                >
                  {link.page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
              aria-disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
