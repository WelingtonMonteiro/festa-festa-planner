
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Filter, Users, Info, BarChart2, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useFestaContext } from "@/contexts/FestaContext";
import { cn } from "@/lib/utils";

interface ReportsMenuProps {
  className?: string;
}

export function ReportsMenu({ className }: ReportsMenuProps) {
  const navigate = useNavigate();
  const { clientes } = useFestaContext();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [clienteFilter, setClienteFilter] = React.useState<string>("");
  const [tipoFilter, setTipoFilter] = React.useState<string>("");

  const tiposDeRelatorio = [
    { id: "financeiro", nome: "Financeiro" },
    { id: "eventos", nome: "Eventos" },
    { id: "clientes", nome: "Clientes" },
    { id: "kits", nome: "Kits e Temas" }
  ];

  // Função para aplicar filtros e navegar para a página de relatórios
  const aplicarFiltros = () => {
    const params = new URLSearchParams();
    
    if (date) {
      params.append("data", format(date, "yyyy-MM-dd"));
    }
    
    if (clienteFilter) {
      params.append("cliente", clienteFilter);
    }
    
    if (tipoFilter) {
      params.append("tipo", tipoFilter);
    }
    
    navigate(`/estatisticas?${params.toString()}`);
  };

  // Sistema Info
  const sistemaInfo = {
    versao: "1.0.0",
    ultimaAtualizacao: "2025-04-11",
    desenvolvedor: "Festa App",
    contato: "suporte@festaapp.com"
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Menubar className="border-none bg-transparent p-0">
        {/* Relatórios Menu */}
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer data-[state=open]:bg-accent">
            <span className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Relatórios</span>
            </span>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => navigate("/estatisticas?tipo=financeiro")}>
              <FileText className="mr-2 h-4 w-4" />
              Relatório Financeiro
            </MenubarItem>
            <MenubarItem onClick={() => navigate("/estatisticas?tipo=eventos")}>
              <Calendar className="mr-2 h-4 w-4" />
              Relatório de Eventos
            </MenubarItem>
            <MenubarItem onClick={() => navigate("/estatisticas?tipo=clientes")}>
              <Users className="mr-2 h-4 w-4" />
              Relatório de Clientes
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => navigate("/estatisticas")}>
              <BarChart2 className="mr-2 h-4 w-4" />
              Todos os Relatórios
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Filtros Menu */}
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer data-[state=open]:bg-accent">
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </span>
          </MenubarTrigger>
          <MenubarContent className="min-w-[220px]">
            {/* Filtro por Data */}
            <div className="px-2 py-1.5">
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
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Filtro por Tipo */}
            <div className="px-2 py-1.5">
              <label className="text-sm font-medium mb-1 block">Tipo de Relatório</label>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposDeRelatorio.map(tipo => (
                    <SelectItem key={tipo.id} value={tipo.id}>{tipo.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Filtro por Cliente */}
            <div className="px-2 py-1.5">
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
            
            <MenubarSeparator />
            <MenubarItem className="justify-center">
              <Button onClick={aplicarFiltros} className="w-full">
                Aplicar Filtros
              </Button>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Informações do Sistema */}
        <MenubarMenu>
          <Sheet>
            <SheetTrigger asChild>
              <MenubarTrigger className="cursor-pointer">
                <span className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>Sistema</span>
                </span>
              </MenubarTrigger>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Informações do Sistema</SheetTitle>
                <SheetDescription>
                  Detalhes sobre a versão e configurações do sistema
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Versão</h4>
                  <p className="text-sm text-muted-foreground">{sistemaInfo.versao}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Última Atualização</h4>
                  <p className="text-sm text-muted-foreground">{sistemaInfo.ultimaAtualizacao}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Desenvolvedor</h4>
                  <p className="text-sm text-muted-foreground">{sistemaInfo.desenvolvedor}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Contato</h4>
                  <p className="text-sm text-muted-foreground">{sistemaInfo.contato}</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
