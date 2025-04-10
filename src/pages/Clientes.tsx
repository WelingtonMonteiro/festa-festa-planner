
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { useFestaContext } from "@/contexts/FestaContext";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, PlusCircle, Search, User, Edit, Trash2 } from "lucide-react";
import NovoClienteDialog from "@/components/clientes/NovoClienteDialog";
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

const Clientes = () => {
  const { clientes, excluirCliente } = useFestaContext();
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [dialogAberto, setDialogAberto] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState<{
    id: string;
    nome: string;
    telefone: string;
    email: string;
    endereco?: string;
  } | null>(null);
  
  // Filtragem de clientes pela busca
  const clientesFiltrados = clientes.filter(
    cliente =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.telefone.includes(busca) ||
      cliente.email.toLowerCase().includes(busca.toLowerCase())
  );

  // Função para abrir o diálogo de edição
  const abrirEdicao = (cliente: typeof clienteParaEditar) => {
    setClienteParaEditar(cliente);
    setDialogAberto(true);
  };
  
  // Função para confirmar exclusão de cliente
  const confirmarExclusao = (clienteId: string) => {
    try {
      excluirCliente(clienteId);
      toast({
        title: "Cliente excluído",
        description: "O cliente foi removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o cliente. Ele pode ter eventos associados.",
        variant: "destructive",
      });
    }
  };
  
  // Limpar cliente para edição ao fechar o diálogo
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
        <Button 
          onClick={() => setDialogAberto(true)}
          className="bg-festa-primary hover:bg-festa-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>
      
      {/* Barra de busca */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes..."
          className="w-full pl-8"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
      
      {/* Tabela de clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Lista de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clientesFiltrados.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Eventos</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientesFiltrados.map((cliente) => {
                  // Add a safety check for historico property
                  const historico = cliente.historico || [];
                  const totalEventos = historico.length;
                  const valorTotal = historico.reduce(
                    (total, evento) => total + (evento?.valorTotal || 0), 
                    0
                  );
                  
                  return (
                    <TableRow key={cliente.id}>
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
                      <TableCell>{totalEventos}</TableCell>
                      <TableCell>R$ {valorTotal.toLocaleString('pt-BR')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/clientes/${cliente.id}`)}
                          >
                            Detalhes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => abrirEdicao({
                              id: cliente.id,
                              nome: cliente.nome,
                              telefone: cliente.telefone,
                              email: cliente.email || "",
                              endereco: cliente.endereco
                            })}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
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
                                <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Isso irá remover permanentemente o cliente {cliente.nome} e todos os seus dados associados.
                                  {totalEventos > 0 && (
                                    <div className="mt-2 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/30">
                                      <div className="flex items-center">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                          Este cliente possui {totalEventos} evento(s) registrado(s).
                                          A exclusão não será possível.
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => confirmarExclusao(cliente.id)}
                                  disabled={totalEventos > 0}
                                >
                                  Excluir
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">
                {busca ? "Nenhum cliente encontrado com esta busca" : "Nenhum cliente cadastrado"}
              </p>
              {busca && (
                <Button 
                  variant="link" 
                  onClick={() => setBusca("")}
                >
                  Limpar busca
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog para adicionar/editar cliente */}
      <NovoClienteDialog
        open={dialogAberto} 
        onOpenChange={handleDialogOpenChange}
        clienteParaEditar={clienteParaEditar || undefined} 
      />
    </div>
  );
};

export default Clientes;
