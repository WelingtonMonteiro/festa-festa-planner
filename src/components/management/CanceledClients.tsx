
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, XCircle, Phone, Mail, Calendar,
  AlertTriangle, SquareX, MessageSquare
} from "lucide-react";

// Dados mockados para clients que cancelaram pagamentos
const canceledClients = [
  {
    id: "c1",
    nome: "Pedro Oliveira",
    telefone: "(11) 95432-1098",
    email: "pedro@example.com",
    valorCancelado: 2500,
    dataCancelamento: "2023-04-05",
    motivo: "Problemas financeiros"
  },
  {
    id: "c2",
    nome: "Carla Santos",
    telefone: "(11) 91234-5678",
    email: "carla@example.com",
    valorCancelado: 1800,
    dataCancelamento: "2023-04-10",
    motivo: "Insatisfeito com o serviço"
  }
];

const CanceledClients = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  const filteredClients = canceledClients.filter(
    client =>
      client.nome.toLowerCase().includes(search.toLowerCase()) ||
      client.telefone.includes(search) ||
      client.email.toLowerCase().includes(search.toLowerCase())
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
              const cancellationDate = new Date(cliente.dataCancelamento);
              
              return (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm">
                        <Phone className="mr-2 h-3 w-3" />
                        {cliente.telefone}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-3 w-3" />
                        {cliente.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    R$ {cliente.valorCancelado.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      {cancellationDate.toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <AlertTriangle className="mr-1 h-4 w-4 text-yellow-500" />
                      {cliente.motivo}
                    </div>
                  </TableCell>
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
