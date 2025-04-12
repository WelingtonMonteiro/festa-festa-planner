
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Clock, Phone, Mail, Calendar,
  ClockIcon, MessageSquare, ChevronDown
} from "lucide-react";

// Dados mockados para últimos acessos
const clientsAccess = [
  {
    id: "c1",
    nome: "Maria Silva",
    telefone: "(11) 98765-4321",
    email: "maria@example.com",
    ultimoAcesso: "2023-04-11T14:30:00",
    diasSemAcesso: 0
  },
  {
    id: "c2",
    nome: "João Pereira",
    telefone: "(11) 97777-8888",
    email: "joao@example.com",
    ultimoAcesso: "2023-04-08T09:15:00",
    diasSemAcesso: 3
  },
  {
    id: "c3",
    nome: "Ana Santos",
    telefone: "(11) 96543-2109",
    email: "ana@example.com",
    ultimoAcesso: "2023-04-01T16:45:00",
    diasSemAcesso: 10
  },
  {
    id: "c4",
    nome: "Carlos Mendes",
    telefone: "(11) 92345-6789",
    email: "carlos@example.com",
    ultimoAcesso: "2023-03-15T11:20:00",
    diasSemAcesso: 27
  },
  {
    id: "c5",
    nome: "Lucia Ferreira",
    telefone: "(11) 99876-5432",
    email: "lucia@example.com",
    ultimoAcesso: "2023-02-20T10:00:00",
    diasSemAcesso: 50
  }
];

const LastedAccessClients = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  const filteredClients = clientsAccess.filter(
    client =>
      client.nome.toLowerCase().includes(search.toLowerCase()) ||
      client.telefone.includes(search) ||
      client.email.toLowerCase().includes(search.toLowerCase())
  );
  
  // Função para formatar a data e hora
  const formatDateHour = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR');
  };
  
  // Função para determinar o status de inatividade
  const getInactiveStatus = (dias: number) => {
    if (dias === 0) {
      return <Badge className="bg-green-500">Hoje</Badge>;
    } else if (dias < 7) {
      return <Badge variant="outline" className="text-green-600 border-green-600">Recente</Badge>;
    } else if (dias < 30) {
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Inativo</Badge>;
    } else {
      return <Badge variant="destructive">Muito Inativo</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Clock className="text-blue-500 mr-2 h-5 w-5" />
          <h2 className="text-xl font-semibold">Últimos Acessos</h2>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
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
              <TableHead>Último Acesso</TableHead>
              <TableHead>Dias Sem Acesso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((cliente) => (
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
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                    {formatDateHour(cliente.ultimoAcesso)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <ClockIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                    {cliente.diasSemAcesso} {cliente.diasSemAcesso === 1 ? 'dia' : 'dias'}
                  </div>
                </TableCell>
                <TableCell>{getInactiveStatus(cliente.diasSemAcesso)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/client/${cliente.id}`)}
                    >
                      Detalhes
                    </Button>
                    {cliente.diasSemAcesso > 7 && (
                      <Button 
                        variant="secondary" 
                        size="sm"
                      >
                        <MessageSquare className="mr-1 h-3 w-3" />
                        Contatar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <Clock className="h-12 w-12 text-muted-foreground/80" />
          <p className="mt-2 text-muted-foreground">
            Nenhum registro de acesso encontrado
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

export default LastedAccessClients;
