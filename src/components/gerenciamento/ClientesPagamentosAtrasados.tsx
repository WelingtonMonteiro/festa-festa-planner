
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, AlertCircle, Phone, Mail, Calendar,
  CircleDollarSign, BadgeAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Dados mockados para pagamentos atrasados
const clientesPagamentosAtrasados = [
  {
    id: "c1",
    nome: "Maria Silva",
    telefone: "(11) 98765-4321",
    email: "maria@example.com",
    valorAtrasado: 1500,
    diasAtraso: 15,
    dataVencimento: "2023-03-25"
  },
  {
    id: "c2",
    nome: "João Pereira",
    telefone: "(11) 97777-8888",
    email: "joao@example.com",
    valorAtrasado: 800,
    diasAtraso: 8,
    dataVencimento: "2023-04-02"
  },
  {
    id: "c3",
    nome: "Ana Santos",
    telefone: "(11) 96543-2109",
    email: "ana@example.com",
    valorAtrasado: 2200,
    diasAtraso: 30,
    dataVencimento: "2023-03-10"
  }
];

const ClientesPagamentosAtrasados = () => {
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();
  
  const clientesFiltrados = clientesPagamentosAtrasados.filter(
    cliente =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.telefone.includes(busca) ||
      cliente.email.toLowerCase().includes(busca.toLowerCase())
  );
  
  // Função para determinar a severidade do atraso
  const getSeveridadeBadge = (diasAtraso: number) => {
    if (diasAtraso > 20) {
      return <Badge variant="destructive">Crítico</Badge>;
    } else if (diasAtraso > 10) {
      return <Badge variant="destructive" className="bg-orange-500">Grave</Badge>;
    } else {
      return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Atenção</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle className="text-red-500 mr-2 h-5 w-5" />
          <h2 className="text-xl font-semibold">Pagamentos Atrasados</h2>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes com pagamentos atrasados..."
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
              <TableHead>Cliente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Valor Atrasado</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Dias de Atraso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesFiltrados.map((cliente) => {
              const dataVencimento = new Date(cliente.dataVencimento);
              
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
                  <TableCell className="text-red-500 font-semibold">
                    <div className="flex items-center">
                      <CircleDollarSign className="mr-1 h-4 w-4" />
                      R$ {cliente.valorAtrasado.toLocaleString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      {dataVencimento.toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <BadgeAlert className="mr-1 h-4 w-4 text-red-500" />
                      {cliente.diasAtraso} dias
                    </div>
                  </TableCell>
                  <TableCell>{getSeveridadeBadge(cliente.diasAtraso)}</TableCell>
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
                        variant="default" 
                        size="sm"
                      >
                        Notificar
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
          <AlertCircle className="h-12 w-12 text-muted-foreground/80" />
          <p className="mt-2 text-muted-foreground">
            Nenhum cliente com pagamentos atrasados encontrado
          </p>
          {busca && (
            <Button variant="link" onClick={() => setBusca("")}>
              Limpar busca
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientesPagamentosAtrasados;
