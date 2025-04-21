import { useState } from "react";
import { Edit, Trash2, MoreVertical, Calendar, CheckCheck, PhoneOutgoing } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Leads, LeadStatus } from "@/pages/Leads.tsx";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface LeadTableProps {
  leads: Leads[];
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  getStatusColor: (status: LeadStatus) => string;
  getStatusIcon: (status: LeadStatus) => JSX.Element | null;
  onDelete?: (leadId: string) => Promise<any>;
  onRefresh?: () => void;
}

const LeadTable = ({ 
  leads, 
  onStatusChange,
  getStatusColor,
  getStatusIcon,
  onDelete,
  onRefresh
}: LeadTableProps) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const confirmDelete = (leadId: string) => {
    setLeadToDelete(leadId);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (leadToDelete && onDelete) {
      await onDelete(leadToDelete);
      toast({
        title: "Leads excluído",
        description: "O lead foi removido com sucesso"
      });
      setDeleteConfirmOpen(false);
      if (onRefresh) onRefresh();
    }
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined) return "Não informado";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-muted p-3">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Nenhum lead encontrado</h3>
        <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
          Não foi possível encontrar leads correspondentes aos filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Tipo de Festa</TableHead>
                <TableHead className="hidden md:table-cell">Orçamento</TableHead>
                <TableHead className="hidden md:table-cell">Data de Interesse</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Último Contato</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="font-medium">{lead.nome}</div>
                    <div className="text-sm text-muted-foreground md:hidden">
                      {formatCurrency(lead.valorOrcamento)}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col">
                      <a href={`mailto:${lead.email}`} className="text-sm text-blue-500 hover:underline">
                        {lead.email}
                      </a>
                      <a href={`tel:${lead.telefone}`} className="text-sm">
                        {lead.telefone}
                      </a>
                    </div>
                  </TableCell>
                  
                  <TableCell>{lead.tipoFesta}</TableCell>
                  
                  <TableCell className="hidden md:table-cell">
                    {formatCurrency(lead.valorOrcamento)}
                  </TableCell>
                  
                  <TableCell className="hidden md:table-cell">
                    {lead.dataInteresse ? 
                      format(lead.dataInteresse, "dd/MM/yyyy", { locale: ptBR }) : 
                      "Não definida"
                    }
                  </TableCell>
                  
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className={`${getStatusColor(lead.status)} transition-colors cursor-pointer`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(lead.status)}
                              <span className="hidden sm:inline">{lead.status}</span>
                            </span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Status atual: {lead.status}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  
                  <TableCell className="hidden md:table-cell">
                    {lead.dataUltimoContato ? 
                      format(lead.dataUltimoContato, "dd/MM/yyyy", { locale: ptBR }) : 
                      "Não contato"
                    }
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar Lead</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => onStatusChange(lead.id, "contato")}>
                          <PhoneOutgoing className="mr-2 h-4 w-4" />
                          <span>Marcar como Contatado</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => onStatusChange(lead.id, "convertido")}>
                          <CheckCheck className="mr-2 h-4 w-4" />
                          <span>Marcar como Convertido</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem className="text-destructive" onClick={() => confirmDelete(lead.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Deletar Lead</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem>Alterar Status Para:</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(lead.id, "novo")}>
                          <span className="ml-6">Novo</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(lead.id, "negociando")}>
                          <span className="ml-6">Negociando</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(lead.id, "perdido")}>
                          <span className="ml-6">Perdido</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Você realmente deseja excluir este lead? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadTable;
