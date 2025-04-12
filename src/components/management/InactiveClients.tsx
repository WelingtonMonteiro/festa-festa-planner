
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHandleContext } from "@/contexts/handleContext.tsx";
import { toast } from "@/components/ui/use-toast";
import { 
  Search, UserMinus, Phone, Mail, AlertTriangle, 
  UserCheck, MessageSquare, X
} from "lucide-react";

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
  
  const reactiveClient = (clienteId: string) => {
    try {
      const client = clients.find(c => c.id === clienteId);
      if (client) {
        updateClients(clienteId, { ...client, ativo: true });
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
              <TableHead>Status</TableHead>
              <TableHead>Eventos Passados</TableHead>
              <TableHead>Valor Total Histórico</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => {
              const histories = client.historico || [];
              const totalEvents = histories.length;
              const totalValues = histories.reduce((total, event) => total + (event?.valorTotal || 0), 0);
              
              return (
                <TableRow key={client.id} className="opacity-70">
                  <TableCell className="font-medium">{client.nome}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm">
                        <Phone className="mr-2 h-3 w-3" />
                        {client.telefone}
                      </div>
                      {client.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="mr-2 h-3 w-3" />
                          {client.email}
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
                  <TableCell>{totalEvents}</TableCell>
                  <TableCell>R$ {totalValues.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/client/${client.id}`)}
                      >
                        Detalhes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:bg-green-50"
                        onClick={() => reactiveClient(client.id)}
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
