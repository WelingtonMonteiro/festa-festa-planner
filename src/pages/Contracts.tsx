import { useState, useEffect } from 'react';
import { useHandleContext } from '@/contexts/handleContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import ContractTemplates from '@/components/contracts/ContractTemplates';
import ContractsList from '@/components/contracts/ContractsList';

const Contracts = () => {
  const { contractsTotal, contractsPage, contractsLimit, setContractsPage, setContractsLimit, refreshContracts } = useHandleContext();
  const [activeTab, setActiveTab] = useState<string>('templates');
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  useEffect(() => {
    if (isInitialLoad) {
      console.log('Contracts: Carregando dados iniciais');
      refreshContracts();
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, refreshContracts]);  

  const totalPages = Math.max(1, Math.ceil((contractsTotal || 0) / (contractsLimit || 10)));
  
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const currentPage = contractsPage || 1;
      
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      if (startPage > 2) {
        pages.push(null);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pages.push(null);
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber !== contractsPage) {
      console.log(`Contracts: Mudando para página ${pageNumber}`);
      setContractsPage(pageNumber);
    }
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Gestão de Contratos</h1>
        <p className="text-muted-foreground">
          Crie, edite e gerencie contratos para seus clientes
        </p>
      </div>

      <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="templates">Modelos de Contrato</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <ContractTemplates 
            selectedTemplate={selectedTemplate} 
            setSelectedTemplate={setSelectedTemplate}
            isActive={activeTab === 'templates'}
          />
        </TabsContent>

        <TabsContent value="contracts">
          <ContractsList 
            selectedContract={selectedContract} 
            setSelectedContract={setSelectedContract}
            isActive={activeTab === 'contracts'}
          />
          
          {activeTab === 'contracts' && contractsTotal > 0 && totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => contractsPage > 1 && handlePageChange(contractsPage - 1)}
                      className={contractsPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {getPageNumbers().map((pageNumber, index) => (
                    <PaginationItem key={index}>
                      {pageNumber === null ? (
                        <span className="px-4">...</span>
                      ) : (
                        <PaginationLink 
                          isActive={pageNumber === contractsPage}
                          onClick={() => handlePageChange(pageNumber)}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => contractsPage < totalPages && handlePageChange(contractsPage + 1)}
                      className={contractsPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Contracts;
