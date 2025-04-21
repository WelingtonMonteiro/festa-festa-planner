
import { useState, useMemo } from "react";
import { 
  UserPlus, 
  LayoutGrid,
  List
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import LeadFilters from "@/components/leads/LeadFilters";
import LeadTable from "@/components/leads/LeadTable";
import LeadKanban from "@/components/leads/LeadKanban";
import AddLeadDialog from "@/components/leads/AddLeadDialog";
import { useToast } from "@/hooks/use-toast";
import { useCrud } from "@/hooks/useCrud";
import { StorageType } from "@/types/crud";
import { useApi } from "@/contexts/apiContext";
import { Leads, LeadStatus } from "@/types/leads";
import { getStatusColor, getStatusIcon } from "@/components/leads/leadUtils";

const LeadPage = () => {
  const { apiUrl } = useApi();
  const crudConfig = {
    type: StorageType.ApiRest as StorageType.ApiRest,
    config: { 
      apiUrl: apiUrl || 'http://localhost:3000',
      endpoint: "leads" 
    }
  };

  const { data: leads, loading, create, update, remove, refresh } = useCrud<Leads>(crudConfig, []);
  const [filteredLeads, setFilteredLeads] = useState<Leads[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const { toast } = useToast();

  const filterLeads = (search: string, tab: string, filters: any = null) => {
    let filtered = [...leads];
    if (search) {
      filtered = filtered.filter(lead => 
        lead.nome?.toLowerCase().includes(search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(search.toLowerCase()) ||
        lead.telefone?.includes(search) ||
        lead.tipoFesta?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (tab !== "todos") {
      filtered = filtered.filter(lead => lead.status === tab);
    }
    if (filters) {
      if (filters.dataInicio && filters.dataFim) {
        filtered = filtered.filter(lead => {
          const leadDate = lead.dataCriacao ? new Date(lead.dataCriacao) : null;
          return leadDate && leadDate >= filters.dataInicio && leadDate <= filters.dataFim;
        });
      }
      if (filters.tipoFesta && filters.tipoFesta !== "todos") {
        filtered = filtered.filter(lead => lead.tipoFesta === filters.tipoFesta);
      }
      if (filters.valorMinimo !== undefined) {
        filtered = filtered.filter(lead => 
          lead.valorOrcamento !== undefined && 
          lead.valorOrcamento >= filters.valorMinimo
        );
      }
      if (filters.valorMaximo !== undefined) {
        filtered = filtered.filter(lead => 
          lead.valorOrcamento !== undefined && 
          lead.valorOrcamento <= filters.valorMaximo
        );
      }
    }
    setFilteredLeads(filtered);
  };

  useMemo(() => { filterLeads(searchTerm, activeTab); }, [leads, searchTerm, activeTab]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterLeads(value, activeTab);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    filterLeads(searchTerm, value);
  };
  
  const handleFilterApply = (filters: any) => {
    filterLeads(searchTerm, activeTab, filters);
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    await update(leadId, { status: newStatus, dataUltimoContato: new Date() });
    filterLeads(searchTerm, activeTab);
    toast({
      title: "Status atualizado",
      description: `Lead atualizado para ${newStatus}`,
    });
  };

  const handleAddLead = async (newLead: Omit<Leads, 'id' | 'dataCriacao'>) => {
    await create({
      ...newLead,
      dataCriacao: new Date(),
    });
    filterLeads(searchTerm, activeTab);
    toast({
      title: "Leads adicionado",
      description: "Novo lead foi adicionado com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Leads</h1>
        <Button 
          onClick={() => setIsAddLeadOpen(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Novo Lead
        </Button>
      </div>
      
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar leads por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="max-w-full"
                />
              </div>
              <LeadFilters onApplyFilters={handleFilterApply} />
              
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("table")}
                  className="h-9 w-9"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "kanban" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("kanban")}
                  className="h-9 w-9"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {viewMode === "table" ? (
          <Card className="overflow-hidden">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <div className="overflow-x-auto">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                  <TabsTrigger 
                    value="todos" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-6"
                  >
                    Todos <Badge className="ml-2 bg-gray-500">{leads.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="novo" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-6"
                  >
                    Novos <Badge className="ml-2 bg-blue-500">{leads.filter(l => l.status === 'novo').length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contato" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-6"
                  >
                    Em Contato <Badge className="ml-2 bg-yellow-500">{leads.filter(l => l.status === 'contato').length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="negociando" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-6"
                  >
                    Negociando <Badge className="ml-2 bg-purple-500">{leads.filter(l => l.status === 'negociando').length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="convertido" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-6"
                  >
                    Convertidos <Badge className="ml-2 bg-green-500">{leads.filter(l => l.status === 'convertido').length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="perdido" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-6"
                  >
                    Perdidos <Badge className="ml-2 bg-red-500">{leads.filter(l => l.status === 'perdido').length}</Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={activeTab} className="p-0 border-0">
                <LeadTable 
                  leads={filteredLeads} 
                  onStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  onDelete={remove}
                  onRefresh={refresh}
                />
              </TabsContent>
            </Tabs>
          </Card>
        ) : (
          <LeadKanban 
            leads={filteredLeads} 
            onStatusChange={handleStatusChange}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        )}
      </div>
      
      <AddLeadDialog 
        open={isAddLeadOpen} 
        onOpenChange={setIsAddLeadOpen}
        onAddLead={handleAddLead}
      />
    </div>
  );
};

export default LeadPage;
