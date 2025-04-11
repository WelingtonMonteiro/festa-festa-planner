
import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DatePicker } from "@/components/ui/date-picker";

interface LeadFiltersProps {
  onApplyFilters: (filters: any) => void;
}

const LeadFilters = ({ onApplyFilters }: LeadFiltersProps) => {
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);
  const [tipoFesta, setTipoFesta] = useState<string>("todos");
  const [valorMinimo, setValorMinimo] = useState<string>("");
  const [valorMaximo, setValorMaximo] = useState<string>("");

  const handleApplyFilters = () => {
    onApplyFilters({
      dataInicio,
      dataFim,
      tipoFesta,
      valorMinimo: valorMinimo ? parseFloat(valorMinimo) : undefined,
      valorMaximo: valorMaximo ? parseFloat(valorMaximo) : undefined
    });
  };

  const clearFilters = () => {
    setDataInicio(undefined);
    setDataFim(undefined);
    setTipoFesta("todos");
    setValorMinimo("");
    setValorMaximo("");
    
    onApplyFilters({});
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros Avançados
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Filtrar Leads</h4>
            <p className="text-sm text-muted-foreground">
              Refine sua lista de leads com filtros avançados
            </p>
          </div>
          
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="dataInicio">Data Início</Label>
                <DatePicker
                  id="dataInicio"
                  date={dataInicio}
                  setDate={setDataInicio}
                  placeholder="Selecionar data"
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dataFim">Data Fim</Label>
                <DatePicker
                  id="dataFim"
                  date={dataFim}
                  setDate={setDataFim}
                  placeholder="Selecionar data"
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="tipoFesta">Tipo de Festa</Label>
              <Select
                value={tipoFesta}
                onValueChange={setTipoFesta}
              >
                <SelectTrigger id="tipoFesta">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="Aniversário Infantil">Aniversário Infantil</SelectItem>
                  <SelectItem value="Aniversário Adulto">Aniversário Adulto</SelectItem>
                  <SelectItem value="Casamento">Casamento</SelectItem>
                  <SelectItem value="Formatura">Formatura</SelectItem>
                  <SelectItem value="Corporativo">Corporativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="valorMinimo">Valor Mínimo</Label>
                <Input
                  id="valorMinimo"
                  placeholder="R$"
                  type="number"
                  value={valorMinimo}
                  onChange={(e) => setValorMinimo(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="valorMaximo">Valor Máximo</Label>
                <Input
                  id="valorMaximo"
                  placeholder="R$"
                  type="number" 
                  value={valorMaximo}
                  onChange={(e) => setValorMaximo(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="ghost" onClick={clearFilters}>Limpar</Button>
            <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LeadFilters;
