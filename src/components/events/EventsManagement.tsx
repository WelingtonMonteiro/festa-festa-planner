import { useState } from 'react';
import { useHandleContext } from "@/contexts";
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar, CheckCircle2, Clock, XCircle, AlertTriangle, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const EventsManagement = () => {
  const { events, updateEvent } = useHandleContext();
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredEventos = filteredStatus 
    ? events.filter(e => e.status === filteredStatus && e.cliente)
    : events.filter(e => e.cliente);

  const statusOptions = [
    { value: 'inicial', label: 'Inicial', icon: <Clock className="h-4 w-4 text-slate-500" /> },
    { value: 'agendado', label: 'Agendado', icon: <Clock className="h-4 w-4 text-amber-500" /> },
    { value: 'confirmado', label: 'Confirmado', icon: <CheckCircle2 className="h-4 w-4 text-blue-500" /> },
    { value: 'cancelado', label: 'Cancelado', icon: <XCircle className="h-4 w-4 text-red-500" /> },
    { value: 'adiado', label: 'Adiado', icon: <AlertTriangle className="h-4 w-4 text-orange-500" /> },
    { value: 'finalizado', label: 'Finalizado', icon: <CheckCheck className="h-4 w-4 text-green-500" /> }
  ];

  const handleStatusChange = (eventoId: string, newStatus: string) => {
    updateEvent(eventoId, { status: newStatus as any });
    toast({
      title: "Status atualizado",
      description: `O status do evento foi alterado para ${newStatus}`,
    });
  };

  const navigateToCalendar = (date: string) => {
    const eventDate = new Date(date);
    navigate('/calendar', { state: { selectedDate: eventDate } });
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    
    const colors: Record<string, string> = {
      'inicial': 'bg-slate-100 text-slate-800',
      'agendado': 'bg-amber-100 text-amber-800',
      'confirmado': 'bg-blue-100 text-blue-800',
      'cancelado': 'bg-red-100 text-red-800',
      'adiado': 'bg-orange-100 text-orange-800',
      'finalizado': 'bg-green-100 text-green-800'
    };
    
    return (
      <div className="flex items-center gap-1">
        {statusOption?.icon}
        <span className={`px-2 py-1 rounded-full text-xs ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
          {statusOption?.label || status}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Gerenciamento de Eventos</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtrar por status:</span>
          <Select 
            onValueChange={(value) => setFilteredStatus(value === 'todos' ? null : value)} 
            defaultValue="todos"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableCaption>Lista de todos os eventos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Kit/Tema</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEventos.length > 0 ? (
            filteredEventos.map((evento) => (
              <TableRow key={evento.id}>
                <TableCell>
                  <Button 
                    variant="link" 
                    className="flex items-center gap-1 p-0 h-auto" 
                    onClick={() => navigateToCalendar(evento.data)}
                  >
                    <Calendar className="h-4 w-4" />
                    {format(new Date(evento.data), 'dd/MM/yyyy')}
                  </Button>
                </TableCell>
                <TableCell>{evento.cliente?.nome || "Cliente não informado"}</TableCell>
                <TableCell>
                  {evento.tema?.nome 
                    ? `${evento.tema.nome} - ${evento.kit?.nome}` 
                    : evento.kit?.nome || 'Kit não especificado'}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                    .format(evento.valorTotal)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(evento.status)}
                </TableCell>
                <TableCell>
                  <Select 
                    onValueChange={(value) => handleStatusChange(evento.id, value)}
                    defaultValue={evento.status}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Alterar status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {option.icon}
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Nenhum evento encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventsManagement;
