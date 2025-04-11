
import { useState } from 'react';
import { Calendar, Filter, Users, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFestaContext } from '@/contexts/FestaContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Relatorios = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clientes } = useFestaContext();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [clienteFilter, setClienteFilter] = useState<string>("");
  const [tipoFilter, setTipoFilter] = useState<string>("financeiro");
  
  // Parse URL search params
  const searchParams = new URLSearchParams(location.search);
  const tipoParam = searchParams.get('tipo');
  
  // Initialize active tab based on URL parameter or default to financeiro
  const [activeTab, setActiveTab] = useState(tipoParam || "financeiro");

  const tiposDeRelatorio = [
    { id: "financeiro", nome: "Financeiro" },
    { id: "eventos", nome: "Eventos" },
    { id: "clientes", nome: "Clientes" },
    { id: "kits", nome: "Kits e Temas" }
  ];

  // Função para aplicar filtros
  const aplicarFiltros = () => {
    // Construct filter parameters
    const params = new URLSearchParams();
    
    if (date) {
      params.append("data", format(date, "yyyy-MM-dd"));
    }
    
    if (clienteFilter) {
      params.append("cliente", clienteFilter);
    }
    
    params.append("tipo", activeTab);
    
    // Update URL with filters without navigating
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setTipoFilter(value);
    
    // Update URL when changing tabs
    const params = new URLSearchParams(location.search);
    params.set('tipo', value);
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Visualize e gere relatórios para o seu negócio
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
            <CardDescription>
              Selecione os filtros para personalizar seus relatórios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Filtro por Data */}
              <div>
                <label className="text-sm font-medium mb-1 block">Data</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Filtro por Cliente */}
              <div>
                <label className="text-sm font-medium mb-1 block">Cliente</label>
                <Select value={clienteFilter} onValueChange={setClienteFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id}>{cliente.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button onClick={aplicarFiltros} className="w-full">
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resultados
            </CardTitle>
            <CardDescription>
              Visualize os resultados do relatório selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                <TabsTrigger value="eventos">Eventos</TabsTrigger>
                <TabsTrigger value="clientes">Clientes</TabsTrigger>
                <TabsTrigger value="kits">Kits e Temas</TabsTrigger>
              </TabsList>
              <TabsContent value="financeiro">
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-4">Relatório Financeiro</h3>
                  <p className="text-muted-foreground">
                    {date ? `Dados financeiros para ${format(date, "dd/MM/yyyy", { locale: ptBR })}` : 'Selecione uma data para ver dados específicos'}
                  </p>
                  {/* Aqui entraria o conteúdo do relatório financeiro */}
                </div>
              </TabsContent>
              <TabsContent value="eventos">
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-4">Relatório de Eventos</h3>
                  <p className="text-muted-foreground">
                    {date ? `Eventos para ${format(date, "dd/MM/yyyy", { locale: ptBR })}` : 'Selecione uma data para ver eventos específicos'}
                  </p>
                  {/* Aqui entraria o conteúdo do relatório de eventos */}
                </div>
              </TabsContent>
              <TabsContent value="clientes">
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-4">Relatório de Clientes</h3>
                  <p className="text-muted-foreground">
                    {clienteFilter ? 'Dados do cliente selecionado' : 'Selecione um cliente para ver dados específicos'}
                  </p>
                  {/* Aqui entraria o conteúdo do relatório de clientes */}
                </div>
              </TabsContent>
              <TabsContent value="kits">
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-4">Relatório de Kits e Temas</h3>
                  <p className="text-muted-foreground">
                    Visualize dados sobre kits e temas utilizados
                  </p>
                  {/* Aqui entraria o conteúdo do relatório de kits e temas */}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Relatorios;
