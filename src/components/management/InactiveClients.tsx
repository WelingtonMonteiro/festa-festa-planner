import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Search, User, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useHandleContext } from "@/contexts/handleContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const InactiveClients = () => {
  const { clients, updateClients } = useHandleContext();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  const inactiveClients = clients.filter(client => client.ativo === false);
  
  const filteredClients = inactiveClients.filter(
    client =>
      client.nome.toLowerCase().includes(search.toLowerCase()) ||
      client.telefone.includes(search) ||
      (client.email && client.email.toLowerCase().includes(search.toLowerCase()))
  );
  
  const reativarCliente = (clienteId: string) => {
    try {
      const cliente = clients.find(c => c.id === clienteId);
      if (cliente) {
        updateClients(clienteId, { ...cliente, ativo: true });
        toast({
          title: "Cliente reativado",
          description: "O cliente foi reativado com sucesso.",
        });
        navigate('/client-management');
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
        <h2 className="text-xl font-semibold">Clientes Inativos</h2>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes inativos..."
            className="w-full pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      {filteredClients.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Eventos</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Último Evento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => {
              const histories = client.historico || [];
              const totalEvents = histories.length;
              const totalValues = histories.reduce((total, event) => total + (event?.valorTotal || 0), 0);
              
              const lastedEvent = histories.length > 0
                ? new Date(histories.sort((a, b) =>
                    new Date(b.data).getTime() - new Date(a.data).getTime()
                  )[0].data).toLocaleDateString('pt-BR')
                : "Nenhum";
              
              return (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.nome}</TableCell>
                  <TableCell>
                    {client.telefone}
                    {client.email && <><br/>{client.email}</>}
                  </TableCell>
                  <TableCell>{totalEvents}</TableCell>
                  <TableCell>R$ {totalValues.toLocaleString('pt-BR')}</TableCell>
                  <TableCell>{lastedEvent}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/client/${client.id}`)}
                      >
                        Detalhes
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:bg-green-50"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reativar cliente</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza de que deseja reativar este cliente?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => reativarCliente(client.id)}>
                              Reativar
                            </AlertDialogAction>
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
          <User className="h-12 w-12 text-muted-foreground/80" />
          <p className="mt-2 text-muted-foreground">Nenhum cliente inativo encontrado com esta busca</p>
          {search && (
            <Button 
              variant="link" 
              onClick={() => setSearch("")}
            >
              Limpar busca
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default InactiveClients;
