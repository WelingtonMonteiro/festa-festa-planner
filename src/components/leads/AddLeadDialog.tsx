
import { useState } from "react";
import { Leads, LeadStatus } from "@/types/leads";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLead: (lead: Omit<Leads, "id" | "dataCriacao">) => void;
}

const AddLeadDialog = ({ open, onOpenChange, onAddLead }: AddLeadDialogProps) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoFesta, setTipoFesta] = useState("");
  const [dataInteresse, setDataInteresse] = useState<Date | undefined>(undefined);
  const [valorOrcamento, setValorOrcamento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddLead({
      nome,
      email,
      telefone,
      tipoFesta,
      dataInteresse,
      status: "novo" as LeadStatus,
      valorOrcamento: valorOrcamento ? parseFloat(valorOrcamento) : undefined,
      observacoes: observacoes || undefined,
    });
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setNome("");
    setEmail("");
    setTelefone("");
    setTipoFesta("");
    setDataInteresse(undefined);
    setValorOrcamento("");
    setObservacoes("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Lead</DialogTitle>
            <DialogDescription>
              Cadastre um novo lead para acompanhar um potencial cliente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome do Cliente *</Label>
              <Input 
                id="nome" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input 
                  id="telefone" 
                  value={telefone} 
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tipoFesta">Tipo de Festa *</Label>
                <Select
                  value={tipoFesta}
                  onValueChange={setTipoFesta}
                  required
                >
                  <SelectTrigger id="tipoFesta">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aniversário Infantil">Aniversário Infantil</SelectItem>
                    <SelectItem value="Aniversário Adulto">Aniversário Adulto</SelectItem>
                    <SelectItem value="Casamento">Casamento</SelectItem>
                    <SelectItem value="Formatura">Formatura</SelectItem>
                    <SelectItem value="Corporativo">Corporativo</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="dataInteresse">Data de Interesse</Label>
                <DatePicker
                  id="dataInteresse"
                  date={dataInteresse}
                  setDate={setDataInteresse}
                  placeholder="Selecionar data"
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="valorOrcamento">Orçamento Estimado (R$)</Label>
              <Input 
                id="valorOrcamento" 
                type="number"
                value={valorOrcamento} 
                onChange={(e) => setValorOrcamento(e.target.value)}
                placeholder="0.00"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes" 
                value={observacoes} 
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Detalhes sobre o lead, preferências, etc."
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar Lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadDialog;
