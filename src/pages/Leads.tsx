
import { useState } from "react";
import { 
  UserPlus, 
  Filter, 
  Check, 
  X, 
  Clock, 
  CalendarClock,
  PhoneCall,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import LeadFilters from "@/components/leads/LeadFilters";
import LeadTable from "@/components/leads/LeadTable";
import AddLeadDialog from "@/components/leads/AddLeadDialog";
import { useToast } from "@/hooks/use-toast";

// Define available lead statuses
export type LeadStatus = 'novo' | 'contato' | 'negociando' | 'convertido' | 'perdido';

// Define a lead type
export interface Leads {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipoFesta: string;
  dataInteresse?: Date;
  status: LeadStatus;
  valorOrcamento?: number;
  observacoes?: string;
  dataCriacao: Date;
  dataUltimoContato?: Date;
}

// Mock data
const mockLeads: Leads[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    email: 'maria@example.com',
    telefone: '(11) 98765-4321',
    tipoFesta: 'Aniversário Infantil',
    dataInteresse: new Date(2023, 6, 15),
    status: 'novo',
    valorOrcamento: 2500,
    observacoes: 'Interessada em pacote completo com decoração',
    dataCriacao: new Date(2023, 5, 10),
    dataUltimoContato: new Date(2023, 5, 10)
  },
  {
    id: '2',
    nome: 'João Pereira',
    email: 'joao@example.com',
    telefone: '(11) 91234-5678',
    tipoFesta: 'Casamento',
    dataInteresse: new Date(2023, 8, 22),
    status: 'contato',
    valorOrcamento: 8000,
    dataCriacao: new Date(2023, 5, 15),
    dataUltimoContato: new Date(2023, 5, 20)
  },
  {
    id: '3',
    nome: 'Ana Rodrigues',
    email: 'ana@example.com',
    telefone: '(11) 95555-9999',
    tipoFesta: 'Formatura',
    dataInteresse: new Date(2023, 11, 5),
    status: 'negociando',
    valorOrcamento: 5000,
    observacoes: 'Negociando valores e serviços',
    dataCriacao: new Date(2023, 4, 25),
    dataUltimoContato: new Date(2023, 6, 1)
  },
  {
    id: '4',
    nome: 'Paulo Oliveira',
    email: 'paulo@example.com',
    telefone: '(11) 97777-8888',
    tipoFesta: 'Aniversário Adulto',
    status: 'convertido',
    valorOrcamento: 3200,
    dataCriacao: new Date(2023, 3, 10),
    dataUltimoContato: new Date(2023, 4, 5)
  },
  {
    id: '5',
    nome: 'Carla Santos',
    email: 'carla@example.com',
    telefone: '(11) 96666-3333',
    tipoFesta: 'Corporativo',
    dataInteresse: new Date(2023, 7, 30),
    status: 'perdido',
    valorOrcamento: 10000,
    observacoes: 'Cliente escolheu outro fornecedor',
    dataCriacao: new Date(2023, 3, 5),
    dataUltimoContato: new Date(2023, 3, 20)
  }
];

// Helper function to get color for status badges
const getStatusColor = (status: LeadStatus) => {
  switch (status) {
    case 'novo':
      return "bg-blue-500 hover:bg-blue-600";
    case 'contato':
      return "bg-yellow-500 hover:bg-yellow-600";
    case 'negociando':
      return "bg-purple-500 hover:bg-purple-600";
    case 'convertido':
      return "bg-green-500 hover:bg-green-600";
    case 'perdido':
      return "bg-red-500 hover:bg-red-600";
    default:
      return "";
  }
};

// Helper function to get icon for status
const getStatusIcon = (status: LeadStatus) => {
  switch (status) {
    case 'novo':
      return <UserPlus className="h-4 w-4" />;
    case 'contato':
      return <PhoneCall className="h-4 w-4" />;
    case 'negociando':
      return <Clock className="h-4 w-4" />;
    case 'convertido':
      return <Check className="h-4 w-4" />;
    case 'perdido':
      return <X className="h-4 w-4" />;
    default:
      return null;
  }
};

const LeadPage = () => {
  const [leads, setLeads] = useState<Leads[]>(mockLeads);
  const [filteredLeads, setFilteredLeads] = useState<Leads[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("todos");
  const { toast } = useToast();

  // Filter leads based on search and active tab
  const filterLeads = (search: string, tab: string, filters: any = null) => {
    let filtered = [...leads];
    
    // Apply search term filter
    if (search) {
      filtered = filtered.filter(lead => 
        lead.nome.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.telefone.includes(search) ||
        lead.tipoFesta.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (tab !== "todos") {
      filtered = filtered.filter(lead => lead.status === tab);
    }
    
    // Apply additional filters if provided
    if (filters) {
      // Filter by date range
      if (filters.dataInicio && filters.dataFim) {
        filtered = filtered.filter(lead => {
          const leadDate = lead.dataCriacao;
          return leadDate >= filters.dataInicio && leadDate <= filters.dataFim;
        });
      }
      
      // Filter by tipo de festa
      if (filters.tipoFesta && filters.tipoFesta !== "todos") {
        filtered = filtered.filter(lead => lead.tipoFesta === filters.tipoFesta);
      }
      
      // Filter by valor range
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

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    // Update lead status in both arrays
    const updatedLeads = leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus, dataUltimoContato: new Date() } : lead
    );
    
    setLeads(updatedLeads);
    filterLeads(searchTerm, activeTab);
    
    toast({
      title: "Status atualizado",
      description: `Lead atualizado para ${newStatus}`,
    });
  };

  const handleAddLead = (newLead: Omit<Leads, 'id' | 'dataCriacao'>) => {
    const lead: Leads = {
      ...newLead,
      id: (leads.length + 1).toString(),
      dataCriacao: new Date(),
    };
    
    const updatedLeads = [...leads, lead];
    setLeads(updatedLeads);
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
            </div>
          </CardContent>
        </Card>
        
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
              />
            </TabsContent>
          </Tabs>
        </Card>
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
