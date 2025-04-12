
import { useState } from 'react';
import { useHandleContext } from '@/contexts/handleContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ContractTemplates from '@/components/contracts/ContractTemplates';
import ContractsList from '@/components/contracts/ContractsList';
import ContractEditor from '@/components/contracts/ContractEditor';

const Contracts = () => {
  const { contracts, contractTemplates } = useHandleContext();
  const [activeTab, setActiveTab] = useState<string>('templates');
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

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
        </TabsContent>
      </Tabs>

      {/* Editor dialog will be rendered by the components */}
    </div>
  );
};

export default Contracts;
