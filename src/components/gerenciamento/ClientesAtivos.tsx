
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFestaContext } from "@/contexts/FestaContext";
import { Search, User, Edit, Phone, Mail } from "lucide-react";

const ClientesAtivos = () => {
  const { clientes } = useFestaContext();
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();
  
  const clientesAtivos = clientes.filter(cliente => cliente.ativo !== false);
  
  const clientesFiltrados = clientesAtivos.filter(
    cliente =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.telefone.includes(busca) ||
      (cliente.email && cliente.email.toLowerCase().includes(busca.toLowerCase()))
  );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Clientes Ativos</h2>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes ativos..."
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
              <TableHead>Eventos</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Último Evento</TableHead>
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
              
              const ultimoEvento = historico.length > 0 
                ? new Date(historico.sort((a, b) => 
                    new Date(b.data).getTime() - new Date(a.data).getTime()
                  )[0].data).toLocaleDateString('pt-BR')
                : "Nenhum";
              
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
                  <TableCell>{ultimoEvento}</TableCell>
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
                      >
                        <Edit className="h-3 w-3" />
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
          <User className="h-12 w-12 text-muted-foreground/80" />
          <p className="mt-2 text-muted-foreground">Nenhum cliente ativo encontrado com esta busca</p>
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

export default ClientesAtivos;
