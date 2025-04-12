
import { useState } from "react";
import { Leads, LeadStatus } from "@/pages/Leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, Mail, MoreVertical, PhoneCall, Plus, Trash2, UserPlus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeadKanbanProps {
  leads: Leads[];
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  getStatusColor: (status: LeadStatus) => string;
  getStatusIcon: (status: LeadStatus) => JSX.Element | null;
}

interface KanbanColumn {
  id: LeadStatus;
  title: string;
  icon: JSX.Element;
  color: string;
}

const LeadKanban = ({
  leads,
  onStatusChange,
  getStatusColor,
  getStatusIcon,
}: LeadKanbanProps) => {
  const { toast } = useToast();
  const [customColumns, setCustomColumns] = useState<KanbanColumn[]>([]);
  const [draggedLead, setDraggedLead] = useState<string | null>(null);
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [deleteColumnId, setDeleteColumnId] = useState<LeadStatus | null>(null);
  const [isDeleteColumnDialogOpen, setIsDeleteColumnDialogOpen] = useState(false);
  const [dragOverColumnId, setDragOverColumnId] = useState<LeadStatus | null>(null);

  const defaultColumns: KanbanColumn[] = [
    { id: "novo", title: "Novos", icon: <UserPlus className="h-4 w-4" />, color: "bg-blue-500" },
    { id: "contato", title: "Em Contato", icon: <PhoneCall className="h-4 w-4" />, color: "bg-yellow-500" },
    { id: "negociando", title: "Negociando", icon: <Clock className="h-4 w-4" />, color: "bg-purple-500" },
    { id: "convertido", title: "Convertidos", icon: <Check className="h-4 w-4" />, color: "bg-green-500" },
    { id: "perdido", title: "Perdidos", icon: <X className="h-4 w-4" />, color: "bg-red-500" },
  ];

  const allColumns = [...defaultColumns, ...customColumns];

  const handleDragStart = (leadId: string) => {
    setDraggedLead(leadId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: LeadStatus) => {
    e.preventDefault();
    setDragOverColumnId(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumnId(null);
  };

  const handleDrop = (newStatus: LeadStatus) => {
    if (draggedLead) {
      onStatusChange(draggedLead, newStatus);
      setDraggedLead(null);
      setDragOverColumnId(null);
    }
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    
    const customId = newColumnTitle.toLowerCase().replace(/\s+/g, "-") as LeadStatus;
    
    const newColumn: KanbanColumn = {
      id: customId,
      title: newColumnTitle,
      icon: <Plus className="h-4 w-4" />,
      color: "bg-gray-500"
    };
    
    setCustomColumns([...customColumns, newColumn]);
    setNewColumnTitle("");
    setIsAddColumnDialogOpen(false);
    
    toast({
      title: "Coluna adicionada",
      description: `A coluna "${newColumnTitle}" foi adicionada com sucesso.`,
    });
  };

  const confirmDeleteColumn = (columnId: LeadStatus) => {
    setDeleteColumnId(columnId);
    setIsDeleteColumnDialogOpen(true);
  };

  const handleDeleteColumn = () => {
    if (!deleteColumnId) return;
    
    const updatedColumns = customColumns.filter(column => column.id !== deleteColumnId);
    setCustomColumns(updatedColumns);
    setIsDeleteColumnDialogOpen(false);
    
    toast({
      title: "Coluna removida",
      description: "A coluna foi removida com sucesso.",
    });
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined) return "Não informado";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="pt-4">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddColumnDialogOpen(true)} className="flex gap-2">
          <Plus className="h-4 w-4" /> Adicionar Coluna
        </Button>
      </div>
      
      <ScrollArea className="w-full h-[calc(100vh-220px)]">
        <div className="flex gap-6 pb-4 overflow-x-auto" style={{ width: "max-content", minWidth: "100%" }}>
          {allColumns.map((column) => {
            const columnLeads = leads.filter((lead) => lead.status === column.id);
            const isCustomColumn = customColumns.some(c => c.id === column.id);
            const isOver = dragOverColumnId === column.id;
            
            return (
              <div 
                key={column.id}
                className={`min-w-[280px] h-fit ${isOver ? 'scale-105 transition-transform shadow-xl ring-2 ring-primary' : ''}`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(column.id)}
              >
                <Card className={isOver ? 'opacity-90' : ''}>
                  <CardHeader className={`${column.color} text-white rounded-t-lg flex flex-row items-center justify-between p-3`}>
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      {column.icon} {column.title}
                      <Badge className="ml-2 bg-white/20">
                        {columnLeads.length}
                      </Badge>
                    </CardTitle>
                    
                    {isCustomColumn && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-white hover:bg-white/20"
                        onClick={() => confirmDeleteColumn(column.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="flex flex-col gap-3">
                      {columnLeads.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                          Nenhum lead neste status
                        </div>
                      ) : (
                        columnLeads.map((lead) => (
                          <Card 
                            key={lead.id}
                            className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            draggable
                            onDragStart={() => handleDragStart(lead.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium">{lead.nome}</h3>
                                  <div className="text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1 mt-1">
                                      <Mail className="h-3 w-3" /> 
                                      <a href={`mailto:${lead.email}`} className="text-blue-500 hover:underline">
                                        {lead.email}
                                      </a>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                      <PhoneCall className="h-3 w-3" /> 
                                      <span>{lead.telefone}</span>
                                    </div>
                                  </div>
                                  <div className="mt-2 text-sm">
                                    <span className="font-medium">Tipo:</span> {lead.tipoFesta}
                                  </div>
                                  {lead.valorOrcamento && (
                                    <div className="mt-1 text-sm">
                                      <span className="font-medium">Orçamento:</span> {formatCurrency(lead.valorOrcamento)}
                                    </div>
                                  )}
                                  {lead.dataInteresse && (
                                    <div className="mt-1 text-sm">
                                      <span className="font-medium">Data:</span> {format(lead.dataInteresse, "dd/MM/yyyy", { locale: ptBR })}
                                    </div>
                                  )}
                                </div>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                      <span className="sr-only">Abrir menu</span>
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Editar Lead</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Alterar Status Para:</DropdownMenuItem>
                                    
                                    {allColumns
                                      .filter((col) => col.id !== lead.status)
                                      .map((col) => (
                                        <DropdownMenuItem 
                                          key={col.id}
                                          onClick={() => onStatusChange(lead.id, col.id)}
                                        >
                                          <span className="ml-6">{col.title}</span>
                                        </DropdownMenuItem>
                                      ))
                                    }
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <Dialog open={isAddColumnDialogOpen} onOpenChange={setIsAddColumnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar nova coluna</DialogTitle>
            <DialogDescription>
              Digite o nome da nova coluna para seu quadro Kanban.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Nome da coluna"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddColumnDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddColumn}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteColumnDialogOpen} onOpenChange={setIsDeleteColumnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir coluna</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta coluna? Os leads serão mantidos, mas precisarão ser movidos para outra coluna.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteColumnDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteColumn}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadKanban;
