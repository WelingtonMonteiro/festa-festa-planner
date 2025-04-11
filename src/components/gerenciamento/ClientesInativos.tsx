
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFestaContext } from "@/contexts/FestaContext";
import { toast } from "@/components/ui/use-toast";
import { 
  Search, UserMinus, Phone, Mail, AlertTriangle, 
  UserCheck, MessageSquare, X
} from "lucide-react";

const ClientesInativos = () => {
  const { clientes, atualizarCliente } = useFestaContext();
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();
  
  const clientesInativos = clientes.filter(cliente => cliente.ativo === false);
  
  const clientesFiltrados = clientesInativos.filter(
    cliente =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.telefone.includes(busca) ||
      (cliente.email && cliente.email.toLowerCase().includes(busca.toLowerCase()))
  );
  
  const reativarCliente = (clienteId: string) => {
    try {
      const cliente = clientes.find(c => c.id === clienteId);
      if (cliente) {
        atualizarCliente(clienteId, { ...cliente, ativo: true });
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
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <UserMinus className="text-gray-500 mr-2 h-5 w-5" />
          <h2 className="text-xl font-semibold">Clientes Inativos</h2>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes inativos..."
            className="w-full pl-8"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>
      
      {clientesFiltrados.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Eventos Passados</TableHead>
              <TableHead>Valor Total Histórico</TableHead>
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
                <TableRow key={cliente.id} className="opacity-70">
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
                    <div className="flex items-center text-destructive">
                      <X className="mr-1 h-4 w-4" />
                      Inativo
                    </div>
                  </TableCell>
                  <TableCell>{totalEventos}</TableCell>
                  <TableCell>R$ {valorTotal.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
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
                        className="text-green-600 hover:bg-green-50"
                        onClick={() => reativarCliente(cliente.id)}
                      >
                        <UserCheck className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                      >
                        <MessageSquare className="mr-1 h-3 w-3" />
                        Contatar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <AlertTriangle className="h-12 w-12 text-muted-foreground/80" />
          <p className="mt-2 text-muted-foreground">Nenhum cliente inativo encontrado</p>
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
    </div>
  );
};

export default ClientesInativos;
