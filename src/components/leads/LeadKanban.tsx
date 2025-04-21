import { useState } from "react";
import { Leads, LeadStatus } from "@/types/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, Mail, MoreVertical, PhoneCall, Plus, Trash2, UserPlus, X, Edit2 } from "lucide-react";
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
import * as icons from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

// Common background colors for columns
const columnColors = [
  { name: "Azul", value: "bg-blue-500" },
  { name: "Verde", value: "bg-green-500" },
  { name: "Vermelho", value: "bg-red-500" },
  { name: "Amarelo", value: "bg-yellow-500" },
  { name: "Roxo", value: "bg-purple-500" },
  { name: "Cinza", value: "bg-gray-500" },
  { name: "Rosa", value: "bg-pink-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Laranja", value: "bg-orange-500" },
  { name: "Turquesa", value: "bg-teal-500" },
];

// Available icons
type IconName = keyof typeof icons;

const iconList: IconName[] = [
  "UserPlus", "PhoneCall", "Clock", "Check", "X", 
  "Mail", "Calendar", "Star", "Flag", "Bell",
  "Heart", "ThumbsUp", "ThumbsDown", "Tag", "MessageSquare",
  "DollarSign", "Target", "Award", "Gift", "Rocket",
  "Zap", "Settings", "FileText", "Clipboard", "Users",
  "Calendar", "Hash", "Bookmark", "Briefcase", "Archive",
];

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
  const [isEditColumnDialogOpen, setIsEditColumnDialogOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-gray-500");
  const [selectedIcon, setSelectedIcon] = useState<IconName>("Plus");
  const [deleteColumnId, setDeleteColumnId] = useState<LeadStatus | null>(null);
  const [isDeleteColumnDialogOpen, setIsDeleteColumnDialogOpen] = useState(false);
  const [dragOverColumnId, setDragOverColumnId] = useState<LeadStatus | null>(null);
  const [editingColumn, setEditingColumn] = useState<KanbanColumn | null>(null);
  const [showIconSelector, setShowIconSelector] = useState(false);

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

  const renderIcon = (iconName: IconName) => {
    const IconComponent = icons[iconName] as React.ComponentType<{className?: string}>;
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <Plus className="h-4 w-4" />;
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    
    const customId = newColumnTitle.toLowerCase().replace(/\s+/g, "-") as LeadStatus;
    
    const newColumn: KanbanColumn = {
      id: customId,
      title: newColumnTitle,
      icon: renderIcon(selectedIcon),
      color: selectedColor
    };
    
    setCustomColumns([...customColumns, newColumn]);
    setNewColumnTitle("");
    setSelectedColor("bg-gray-500");
    setSelectedIcon("Plus");
    setIsAddColumnDialogOpen(false);
    
    toast({
      title: "Coluna adicionada",
      description: `A coluna "${newColumnTitle}" foi adicionada com sucesso.`,
    });
  };

  const handleEditColumn = () => {
    if (!editingColumn || !newColumnTitle.trim()) return;
    
    const updatedColumns = customColumns.map(column => {
      if (column.id === editingColumn.id) {
        return {
          ...column,
          title: newColumnTitle,
          icon: renderIcon(selectedIcon),
          color: selectedColor
        };
      }
      return column;
    });
    
    setCustomColumns(updatedColumns);
    setEditingColumn(null);
    setNewColumnTitle("");
    setSelectedColor("bg-gray-500");
    setSelectedIcon("Plus");
    setIsEditColumnDialogOpen(false);
    
    toast({
      title: "Coluna atualizada",
      description: `A coluna foi atualizada com sucesso.`,
    });
  };

  const openEditColumnDialog = (column: KanbanColumn) => {
    const isDefaultColumn = defaultColumns.some(c => c.id === column.id);
    
    // Allow editing of custom columns
    if (!isDefaultColumn) {
      setEditingColumn(column);
      setNewColumnTitle(column.title);
      
      // Find the color from the column
      const foundColor = columnColors.find(c => c.value === column.color);
      setSelectedColor(foundColor?.value || "bg-gray-500");
      
      // Try to determine the icon
      const iconName = Object.keys(icons).find(
        key => column.icon.type === (icons as any)[key]
      ) as IconName;
      setSelectedIcon(iconName || "Plus");
      
      setIsEditColumnDialogOpen(true);
    } else {
      toast({
        title: "Ação não permitida",
        description: "As colunas padrão não podem ser editadas.",
        variant: "destructive",
      });
    }
  };

  const confirmDeleteColumn = (columnId: LeadStatus) => {
    const isDefaultColumn = defaultColumns.some(c => c.id === columnId);
    
    if (!isDefaultColumn) {
      setDeleteColumnId(columnId);
      setIsDeleteColumnDialogOpen(true);
    } else {
      toast({
        title: "Ação não permitida",
        description: "As colunas padrão não podem ser excluídas.",
        variant: "destructive",
      });
    }
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
                className={`min-w-[280px] ${isOver ? 'scale-105 transition-transform shadow-xl ring-2 ring-primary' : ''}`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(column.id)}
              >
                <ContextMenu>
                  <ContextMenuTrigger>
                    <Card className={`${isOver ? 'opacity-90' : ''} h-full min-h-[calc(100vh-280px)]`}>
                      <CardHeader className={`${column.color} text-white rounded-t-lg flex flex-row items-center justify-between p-3`}>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                          {column.icon} {column.title}
                          <Badge className="ml-2 bg-white/20">
                            {columnLeads.length}
                          </Badge>
                        </CardTitle>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-white hover:bg-white/20"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => openEditColumnDialog(column)}
                              disabled={!isCustomColumn}
                            >
                              <Edit2 className="h-4 w-4 mr-2" /> Editar Coluna
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => confirmDeleteColumn(column.id)} 
                              disabled={!isCustomColumn}
                              className="text-red-500 focus:text-red-500"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Excluir Coluna
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardContent className="p-3 overflow-y-auto max-h-[calc(100vh-340px)]">
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
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => openEditColumnDialog(column)} disabled={!isCustomColumn}>
                      <Edit2 className="h-4 w-4 mr-2" /> Editar Coluna
                    </ContextMenuItem>
                    <ContextMenuItem 
                      onClick={() => confirmDeleteColumn(column.id)} 
                      disabled={!isCustomColumn}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Excluir Coluna
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Dialog for adding a new column */}
      <Dialog open={isAddColumnDialogOpen} onOpenChange={setIsAddColumnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar nova coluna</DialogTitle>
            <DialogDescription>
              Personalize a nova coluna para seu quadro Kanban.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="column-title">Nome da coluna</Label>
              <Input
                id="column-title"
                placeholder="Nome da coluna"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Selecionar cor</Label>
              <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="grid grid-cols-5 gap-2">
                {columnColors.map((color) => (
                  <div key={color.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={color.value} id={color.value} className="peer sr-only" />
                    <Label
                      htmlFor={color.value}
                      className={`${color.value} h-8 w-8 rounded-md cursor-pointer ring-offset-2 ring-1 ring-gray-200 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary`}
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Selecionar ícone</Label>
              <Popover open={showIconSelector} onOpenChange={setShowIconSelector}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowIconSelector(true)}
                  >
                    {renderIcon(selectedIcon)}
                    <span className="ml-2">{selectedIcon}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto p-2">
                    {iconList.map((iconName) => (
                      <Button
                        key={iconName}
                        variant="ghost"
                        size="sm"
                        className={`flex flex-col items-center justify-center p-2 h-auto ${
                          selectedIcon === iconName ? "bg-secondary" : ""
                        }`}
                        onClick={() => {
                          setSelectedIcon(iconName);
                          setShowIconSelector(false);
                        }}
                      >
                        {renderIcon(iconName)}
                        <span className="mt-1 text-xs">{iconName}</span>
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddColumnDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddColumn}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing a column */}
      <Dialog open={isEditColumnDialogOpen} onOpenChange={setIsEditColumnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar coluna</DialogTitle>
            <DialogDescription>
              Personalize as propriedades da coluna.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-column-title">Nome da coluna</Label>
              <Input
                id="edit-column-title"
                placeholder="Nome da coluna"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Selecionar cor</Label>
              <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="grid grid-cols-5 gap-2">
                {columnColors.map((color) => (
                  <div key={color.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={color.value} id={`edit-${color.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`edit-${color.value}`}
                      className={`${color.value} h-8 w-8 rounded-md cursor-pointer ring-offset-2 ring-1 ring-gray-200 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary`}
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Selecionar ícone</Label>
              <Popover open={showIconSelector} onOpenChange={setShowIconSelector}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowIconSelector(true)}
                  >
                    {renderIcon(selectedIcon)}
                    <span className="ml-2">{selectedIcon}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto p-2">
                    {iconList.map((iconName) => (
                      <Button
                        key={iconName}
                        variant="ghost"
                        size="sm"
                        className={`flex flex-col items-center justify-center p-2 h-auto ${
                          selectedIcon === iconName ? "bg-secondary" : ""
                        }`}
                        onClick={() => {
                          setSelectedIcon(iconName);
                          setShowIconSelector(false);
                        }}
                      >
                        {renderIcon(iconName)}
                        <span className="mt-1 text-xs">{iconName}</span>
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditColumnDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditColumn}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for deleting a column */}
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
