
import { useState } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
}

export const usePagination = ({ initialPage = 1, initialLimit = 10 }: UsePaginationProps = {}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(initialLimit);
  const [totalItems, setTotalItems] = useState(0);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const renderPaginationLinks = () => {
    const links = [];
    const maxDisplayedPages = 5;
    
    links.push({
      type: 'first',
      page: 1,
      isActive: currentPage === 1
    });
    
    if (totalPages > maxDisplayedPages && currentPage > 3) {
      links.push({ type: 'ellipsis' });
    }
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i <= 1 || i >= totalPages) continue;
      
      links.push({
        type: 'number',
        page: i,
        isActive: currentPage === i
      });
    }
    
    if (totalPages > maxDisplayedPages && currentPage < totalPages - 2) {
      links.push({ type: 'ellipsis' });
    }
    
    if (totalPages > 1) {
      links.push({
        type: 'last',
        page: totalPages,
        isActive: currentPage === totalPages
      });
    }
    
    return links;
  };

  return {
    currentPage,
    totalPages,
    limit,
    totalItems,
    setTotalPages,
    setTotalItems,
    handlePageChange,
    renderPaginationLinks
  };
};
