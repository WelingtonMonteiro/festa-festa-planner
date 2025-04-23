
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHandleContext } from "@/contexts/handleContext.tsx";
import { 
  Search, XCircle, Phone, Mail, Calendar,
  AlertTriangle, SquareX, MessageSquare
} from "lucide-react";

// Utilize dados do CRUD real
const CanceledClients = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { clients } = useHandleContext();

  // Filtro: clientes com histórico com evento cancelado
  const canceledClients = useMemo(() => 
    clients.filter(client =>
      client.historico?.some(event => event.status === 'cancelado')
    ), [clients]
  );

  const filteredClients = canceledClients.filter(
    client =>
      client.nome.toLowerCase().includes(search.toLowerCase()) ||
      client.telefone.includes(search) ||
      (client.email && client.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <XCircle className="text-yellow-500 mr-2 h-5 w-5" />
          <h2 className="text-xl font-semibold">Cancelamentos</h2>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes com cancelamentos..."
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
              <TableHead>Cliente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Valor Cancelado</TableHead>
              <TableHead>Data do Cancelamento</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((cliente) => {
              // Último evento cancelado
              const lastCanceled = cliente.historico
                ?.filter(ev => ev.status === 'cancelado')
                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];

              const cancellationDate = lastCanceled ? new Date(lastCanceled.data) : null;
              const motivo = lastCanceled?.observacoes || "Não informado";
              const valorCancelado = lastCanceled?.valorTotal || 0;

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
                  <TableCell className="font-semibold">
                    R$ {valorCancelado.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {cancellationDate && (
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        {cancellationDate.toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <AlertTriangle className="mr-1 h-4 w-4 text-yellow-500" />
                      {motivo}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/clients/${cliente.id}`)}
                      >
                        Detalhes
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
          <SquareX className="h-12 w-12 text-muted-foreground/80" />
          <p className="mt-2 text-muted-foreground">
            Nenhum cliente com cancelamentos encontrado
          </p>
          {search && (
            <Button variant="link" onClick={() => setSearch("")}>
              Limpar busca
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CanceledClients;
