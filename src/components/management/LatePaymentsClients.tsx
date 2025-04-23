
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, AlertCircle, Phone, Mail, Calendar,
  CircleDollarSign, BadgeAlert, MessageSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useHandleContext } from "@/contexts/handleContext.tsx";

// Usar dados do CRUD real
const ClientesPagamentosAtrasados = () => {
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();
  const { clients } = useHandleContext();

  // Clientes com pelo menos um evento com valorRestante > 0 (pagamento atrasado)
  const latePaymentsClients = useMemo(() =>
    clients.filter(client =>
      client.historico?.some(event => event.valorRestante > 0)
    ), [clients]
  );

  const clientesFiltrados = latePaymentsClients.filter(
    cliente =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.telefone.includes(busca) ||
      (cliente.email && cliente.email.toLowerCase().includes(busca.toLowerCase()))
  );

  // Calcular valor total atrasado e dias de atraso (exemplo básico)
  const getResumoAtraso = (cliente) => {
    const atrasos = cliente.historico?.filter(e => e.valorRestante > 0) || [];
    const valorAtrasado = atrasos.reduce((acc, ev) => acc + (ev.valorRestante || 0), 0);
    // Buscar data mais antiga de vencimento em atraso para calcular dias de atraso
    const hoje = new Date();
    const datasVencimento = atrasos.map(ev => new Date(ev.dataVencimento || ev.data));
    const dataVencimentoMaisAntiga = datasVencimento.length ? datasVencimento.sort((a, b) => a.getTime() - b.getTime())[0] : hoje;
    const diffDias = Math.round((hoje.getTime() - dataVencimentoMaisAntiga.getTime()) / (1000 * 60 * 60 * 24));
    return { valorAtrasado, diasAtraso: diffDias, dataVencimento: dataVencimentoMaisAntiga };
  };

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
              const resumo = getResumoAtraso(cliente);
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
                  <TableCell className="text-red-500 font-semibold">
                    <div className="flex items-center">
                      <CircleDollarSign className="mr-1 h-4 w-4" />
                      R$ {resumo.valorAtrasado.toLocaleString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      {resumo.dataVencimento?.toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <BadgeAlert className="mr-1 h-4 w-4 text-red-500" />
                      {resumo.diasAtraso} dias
                    </div>
                  </TableCell>
                  <TableCell>{getSeveridadeBadge(resumo.diasAtraso)}</TableCell>
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
                        variant="default" 
                        size="sm"
                      >
                        <MessageSquare className="mr-1 h-3 w-3" />
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
