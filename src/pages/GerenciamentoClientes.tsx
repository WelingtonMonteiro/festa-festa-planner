
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, AlertCircle, Clock, CalendarX, 
  DollarSign, CalendarCheck, Calendar 
} from "lucide-react";
import { useFestaContext } from "@/contexts/FestaContext";
import ClientesAtivos from "@/components/gerenciamento/ClientesAtivos";
import ClientesPagamentosAtrasados from "@/components/gerenciamento/ClientesPagamentosAtrasados";
import ClientesCancelados from "@/components/gerenciamento/ClientesCancelados";
import ClientesUltimosAcessos from "@/components/gerenciamento/ClientesUltimosAcessos";
import ClientesInativos from "@/components/gerenciamento/ClientesInativos";

const GerenciamentoClientes = () => {
  const [activeTab, setActiveTab] = useState("ativos");
  const { clientes } = useFestaContext();

  // Contadores para os badges
  const totalAtivos = clientes.filter(c => c.ativo !== false).length;
  const totalInativos = clientes.filter(c => c.ativo === false).length;
  
  // Estes seriam dados reais em uma aplicação completa
  const totalPagamentosAtrasados = 3;
  const totalCancelados = 2;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciamento de Clientes</h1>
      </div>
      
      <Card className="overflow-hidden">
        <Tabs 
          defaultValue="ativos" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="overflow-x-auto">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="ativos" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-6"
              >
                <Users className="mr-2 h-4 w-4" />
                Clientes Ativos <span className="ml-2 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">{totalAtivos}</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="pagamentos-atrasados" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-6"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Pagamentos Atrasados <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">{totalPagamentosAtrasados}</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="cancelados" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-6"
              >
                <CalendarX className="mr-2 h-4 w-4" />
                Cancelamentos <span className="ml-2 rounded-full bg-yellow-500 px-2 py-0.5 text-xs text-white">{totalCancelados}</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="ultimos-acessos" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-6"
              >
                <Clock className="mr-2 h-4 w-4" />
                Últimos Acessos
              </TabsTrigger>
              
              <TabsTrigger 
                value="inativos" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-6"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Clientes Inativos <span className="ml-2 rounded-full bg-gray-500 px-2 py-0.5 text-xs text-white">{totalInativos}</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="p-0">
            <TabsContent value="ativos" className="mt-0 border-0 p-4">
              <ClientesAtivos />
            </TabsContent>
            
            <TabsContent value="pagamentos-atrasados" className="mt-0 border-0 p-4">
              <ClientesPagamentosAtrasados />
            </TabsContent>
            
            <TabsContent value="cancelados" className="mt-0 border-0 p-4">
              <ClientesCancelados />
            </TabsContent>
            
            <TabsContent value="ultimos-acessos" className="mt-0 border-0 p-4">
              <ClientesUltimosAcessos />
            </TabsContent>
            
            <TabsContent value="inativos" className="mt-0 border-0 p-4">
              <ClientesInativos />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default GerenciamentoClientes;
