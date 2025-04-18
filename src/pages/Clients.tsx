import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { useHandleContext } from "@/contexts/handleContext.tsx";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, PlusCircle, Search, User, Edit, Trash2, Check, X, Filter, BarChart2 } from "lucide-react";
import NewClientDialog from "@/components/clients/NewClientDialog.tsx";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Client } from "@/types";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Clients = () => {
  const { 
    clients, updateClients, removeClients,
    total, page, limit, loading,
    setPage, setLimit, refresh 
  } = useHandleContext();
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [dialogAberto, setDialogAberto] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [clienteParaEditar, setClienteParaEditar] = useState<{
    id: string;
    nome: string;
    telefone: string;
    email: string;
    endereco?: string;
    ativo?: boolean;
  } | null>(null);

  const clientesFiltrados = clients.filter(
    cliente =>
      (cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
       cliente.telefone.includes(busca) ||
       (cliente.email && cliente.email.toLowerCase().includes(busca.toLowerCase()))) &&
      (filtroStatus === "todos" || 
       (filtroStatus === "ativos" && cliente.ativo !== false) ||
       (filtroStatus === "inativos" && cliente.ativo === false))
  );

  const totalPages = Math.ceil(total / limit);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const abrirEdicao = (cliente: Client) => {
    console.log("Cliente para editar:", cliente);
    setClienteParaEditar({
      id: cliente.id,
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email || "",
      endereco: cliente.endereco || "",
      ativo: cliente.ativo !== false
    });
    setDialogAberto(true);
  };

  const marcarClienteComoInativo = (clienteId: string) => {
    try {
      const cliente = clients.find(c => c.id === clienteId);
      if (cliente) {
        updateClients(clienteId, { ...cliente, ativo: false });
        toast({
          title: "Cliente desativado",
          description: "O cliente foi marcado como inativo com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao desativar",
        description: "Ocorreu um erro ao desativar o cliente.",
        variant: "destructive",
      });
    }
  };

  const reativarCliente = (clienteId: string) => {
    try {
      const cliente = clients.find(c => c.id === clienteId);
      if (cliente) {
        updateClients(clienteId, { ...cliente, ativo: true });
        toast({
          title: "Cliente reativado",
          description: "O cliente foi reativado com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao reativar",
        description: "Ocorreu um erro ao reativar o cliente.",
        variant: "destructive",
      });
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogAberto(open);
    if (!open) {
      setClienteParaEditar(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate('/client-management')}
          >
            <BarChart2 className="h-4 w-4" />
            Gerenciar Clientes
          </Button>
          <Button 
            onClick={() => setDialogAberto(true)}
            className="bg-festa-primary hover:bg-festa-primary/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            className="w-full pl-8"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtro: {filtroStatus === "todos" ? "Todos" : filtroStatus === "ativos" ? "Ativos" : "Inativos"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Status do Cliente</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={filtroStatus} onValueChange={setFiltroStatus}>
              <DropdownMenuRadioItem value="todos">Todos</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="ativos">Ativos</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="inativos">Inativos</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Lista de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : clientesFiltrados.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Eventos</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesFiltrados.map((cliente) => {
                    const historico = cliente.historico || [];
                    const totalEventos = historico.length;
                    const valorTotal = historico.reduce(
                      (total, evento) => total + (evento?.valorTotal || 0), 
                      0
                    );
                    
                    return (
                      <TableRow key={cliente.id} className={cliente.ativo === false ? "opacity-60" : ""}>
                        <TableCell className="font-medium">{cliente.nome}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center text-sm">
                              <Phone className="mr-2 h-3 w-3" />
                              {cliente.telefone}
                            </div>
                            {cliente.email && (
                              <div className="flex items-center text-sm">
                                <Mail className="mr-2 h-3 w-3" />
                                {cliente.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {cliente.ativo === false ? (
                            <div className="flex items-center text-destructive">
                              <X className="mr-1 h-4 w-4" />
                              Inativo
                            </div>
                          ) : (
                            <div className="flex items-center text-green-600">
                              <Check className="mr-1 h-4 w-4" />
                              Ativo
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{totalEventos}</TableCell>
                        <TableCell>R$ {valorTotal.toLocaleString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/client/${cliente.id}`)}
                            >
                              Detalhes
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => abrirEdicao(cliente)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            {cliente.ativo !== false ? (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Desativar cliente</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Isso irá marcar o cliente {cliente.nome} como inativo. 
                                      Você poderá reativar o cliente posteriormente se necessário.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <Button 
                                      variant="destructive" 
                                      onClick={() => marcarClienteComoInativo(cliente.id)}
                                    >
                                      Desativar
                                    </Button>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:bg-green-50"
                                onClick={() => reativarCliente(cliente.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setPage(page - 1)}
                        className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {pageNumbers.map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setPage(pageNum)}
                          isActive={page === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(page + 1)}
                        className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">
                {busca ? 
                  "Nenhum cliente encontrado com esta busca" : 
                  filtroStatus !== "todos" ? 
                    `Não há clientes ${filtroStatus === "ativos" ? "ativos" : "inativos"}` :
                    "Nenhum cliente cadastrado"
                }
              </p>
              {busca && (
                <Button 
                  variant="link" 
                  onClick={() => setBusca("")}
                >
                  Limpar busca
                </Button>
              )}
              {filtroStatus !== "todos" && (
                <Button 
                  variant="link" 
                  onClick={() => setFiltroStatus("todos")}
                >
                  Mostrar todos
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <NewClientDialog
        open={dialogAberto} 
        onOpenChange={handleDialogOpenChange}
        editClient={clienteParaEditar || undefined}
      />
    </div>
  );
};

export default Clients;
