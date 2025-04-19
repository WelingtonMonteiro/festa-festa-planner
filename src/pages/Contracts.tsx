
import { useState, useEffect } from 'react';
import { useHandleContext } from '@/contexts/handleContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import ContractTemplates from '@/components/contracts/ContractTemplates';
import ContractsList from '@/components/contracts/ContractsList';
import ContractEditor from '@/components/contracts/ContractEditor';

const Contracts = () => {
  const { contracts, contractTemplates, total, page, limit, setPage, setLimit, refresh } = useHandleContext();
  const [activeTab, setActiveTab] = useState<string>('templates');
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    // Carregamos dados quando o componente montar
    refresh();
  }, []);  // Empty dependency array ensures this only runs once on mount

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
          />
        </TabsContent>

        <TabsContent value="contracts">
          <ContractsList 
            selectedContract={selectedContract} 
            setSelectedContract={setSelectedContract}
          />
          
          {activeTab === 'contracts' && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(total / limit)}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Contracts;
