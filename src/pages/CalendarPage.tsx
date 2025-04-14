import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHandleContext } from '@/contexts/handleContext.tsx';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarPlus, Clock, MapPin } from 'lucide-react';
import { DayContentProps } from 'react-day-picker';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
const CalendarPage = () => {
  const {
    clients,
    thems,
    kits,
    events,
    addEvent
  } = useHandleContext();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    clienteId: '',
    temaId: '',
    kitId: '',
    horario: '',
    local: '',
    trajeto: '',
    valorTotal: '',
    valorSinal: '',
    valorRestante: '',
    observacoes: ''
  });

  // Check if a date was passed from another page
  useEffect(() => {
    if (location.state?.selectedDate) {
      const passedDate = new Date(location.state.selectedDate);
      setDate(passedDate);
      setSelectedDay(passedDate);

      // Clear the state to prevent reapplying on refresh
      navigate(location.pathname, {
        replace: true
      });
    }

    // Check if dialog should be shown (from Eventos page)
    if (location.state?.showNovoEventoDialog) {
      setSelectedDay(new Date());
      setDialogOpen(true);

      // Clear the state to prevent reopening on refresh
      navigate(location.pathname, {
        replace: true
      });
    }
  }, [location.state, navigate, location.pathname]);

  // Encontrar events do dia selecionado
  const eventosDoDia = selectedDay ? events.filter(evento => isSameDay(new Date(evento.data), selectedDay)) : [];

  // Handler para clicar em um dia
  const handleDayClick = (day: Date | undefined) => {
    if (day) {
      setSelectedDay(day);
    }
  };

  // Handler para mudança nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Calcular valor restante automaticamente
    if (name === 'valorTotal' || name === 'valorSinal') {
      const valorTotal = name === 'valorTotal' ? parseFloat(value) || 0 : parseFloat(formData.valorTotal) || 0;
      const valorSinal = name === 'valorSinal' ? parseFloat(value) || 0 : parseFloat(formData.valorSinal) || 0;
      const valorRestante = valorTotal - valorSinal;
      setFormData(prev => ({
        ...prev,
        valorRestante: valorRestante.toString()
      }));
    }
  };

  // Handler para mudança nos selects
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });

    // Se o kit mudar, atualiza o valor total
    if (name === 'kitId') {
      const kit = kits.find(k => k.id === value);
      if (kit) {
        const valorTotal = kit.preco;
        const valorSinal = valorTotal / 2; // 50% de sinal por padrão
        const valorRestante = valorTotal - valorSinal;
        setFormData(prev => ({
          ...prev,
          valorTotal: valorTotal.toString(),
          valorSinal: valorSinal.toString(),
          valorRestante: valorRestante.toString()
        }));
      }
    }
  };

  // Handler para submeter o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) return;
    const cliente = clients.find(c => c.id === formData.clienteId);
    const tema = formData.temaId ? thems.find(t => t.id === formData.temaId) : undefined;
    const kit = kits.find(k => k.id === formData.kitId);
    if (!cliente || !kit) {
      toast({
        title: "Erro ao agendar evento",
        description: "Por favor, selecione um cliente e um kit válidos.",
        variant: "destructive"
      });
      return;
    }
    addEvent({
      cliente,
      tema,
      kit,
      data: format(selectedDay, 'yyyy-MM-dd'),
      horario: formData.horario,
      local: formData.local,
      trajeto: formData.trajeto,
      valorTotal: parseFloat(formData.valorTotal),
      valorSinal: parseFloat(formData.valorSinal),
      valorRestante: parseFloat(formData.valorRestante),
      status: 'agendado',
      observacoes: formData.observacoes
    });
    toast({
      title: "Evento agendado com sucesso",
      description: `O evento para ${cliente.nome} foi agendado para ${format(selectedDay, 'dd/MM/yyyy')}.`
    });
    setDialogOpen(false);
    resetForm();
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      clienteId: '',
      temaId: '',
      kitId: '',
      horario: '',
      local: '',
      trajeto: '',
      valorTotal: '',
      valorSinal: '',
      valorRestante: '',
      observacoes: ''
    });
  };

  // Navegação para a página de events com um evento selecionado
  const navigateToEventos = (eventoId: string) => {
    navigate('/events', {
      state: {
        eventoId
      }
    });
  };

  // Renderizar decorador do dia no calendário
  const dayWithEvents = (day: Date) => {
    const matchingEvents = events.filter(evento => isSameDay(new Date(evento.data), day));
    if (matchingEvents.length > 0) {
      return <div className="relative h-full w-full p-2">
          <div className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-festa-primary" />
        </div>;
    }
    return null;
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendário de Eventos</h1>
        <Button onClick={() => {
        setSelectedDay(new Date());
        setDialogOpen(true);
      }} className="bg-festa-primary hover:bg-festa-primary/90">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Novo Evento
        </Button>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendário */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendário de Eventos</CardTitle>
            <CardDescription>Visualize e gerencie seus eventos</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} onDayClick={handleDayClick} locale={ptBR} components={{
            DayContent: (props: DayContentProps) => <div className="relative h-9 w-9 p-0" {...props}>
                    <div className="flex h-full w-full items-center justify-center">
                      {props?.date?.getDate()}
                    </div>
                    {dayWithEvents(props?.date)}
                  </div>
          }} className="border py-0 my-0 mx-[100px] rounded-md" />
          </CardContent>
        </Card>
        
        {/* Eventos do dia selecionado */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDay ? `Eventos de ${format(selectedDay, 'dd/MM/yyyy')}` : 'Eventos'}
            </CardTitle>
            <CardDescription>
              {selectedDay ? `${eventosDoDia.length} eventos para este dia` : 'Selecione um dia para ver os events'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDay && <div className="space-y-4">
                {eventosDoDia.length > 0 ? eventosDoDia.map(evento => <div key={evento.id} className="rounded-lg border p-4 hover:bg-muted/50">
                      <div className="flex justify-between">
                        <div className="font-medium">{evento.cliente?.nome || 'Cliente não especificado'}</div>
                        <Button variant="link" size="sm" className="h-auto p-0" onClick={() => navigateToEventos(evento.id)}>
                          Gerenciar
                        </Button>
                      </div>
                      <div className="mt-1 text-sm">
                        {evento.tema?.nome ? `${evento.tema.nome} - ` : ''}{evento.kit?.nome || 'Kit não especificado'}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" /> {evento.horario}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-4 w-4" /> {evento.local}
                      </div>
                      <div className="mt-3 flex justify-between text-sm">
                        <div>Valor: R$ {evento.valorTotal?.toLocaleString('pt-BR') || '0'}</div>
                        <div>Sinal: R$ {evento.valorSinal?.toLocaleString('pt-BR') || '0'}</div>
                      </div>
                    </div>) : <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <p className="text-sm text-muted-foreground">Nenhum evento para este dia</p>
                    <Button variant="link" onClick={() => setDialogOpen(true)} className="mt-2">
                      Agendar novo evento
                    </Button>
                  </div>}
              </div>}
          </CardContent>
        </Card>
      </div>
      
      {/* Dialog para adicionar evento */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Agendar Novo Evento</DialogTitle>
            <DialogDescription>
              Preencha os dados para agendar um novo evento.
              {selectedDay && ` Data selecionada: ${format(selectedDay, 'dd/MM/yyyy')}`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select onValueChange={value => handleSelectChange('clienteId', value)} value={formData.clienteId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(cliente => <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tema">Tema (opcional)</Label>
                <Select onValueChange={value => handleSelectChange('temaId', value)} value={formData.temaId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tema" />
                  </SelectTrigger>
                  <SelectContent>
                    {thems.map(tema => <SelectItem key={tema.id} value={tema.id}>
                        {tema.nome}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kit">Kit</Label>
                <Select onValueChange={value => handleSelectChange('kitId', value)} value={formData.kitId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um kit" />
                  </SelectTrigger>
                  <SelectContent>
                    {kits.map(kit => <SelectItem key={kit.id} value={kit.id}>
                        {kit.nome} - R$ {kit.preco.toLocaleString('pt-BR')}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="horario">Horário</Label>
                <Input id="horario" name="horario" type="time" value={formData.horario} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="local">Local</Label>
                <Input id="local" name="local" value={formData.local} onChange={handleChange} placeholder="Endereço do evento" required />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="trajeto">Trajeto (opcional)</Label>
                <Input id="trajeto" name="trajeto" value={formData.trajeto} onChange={handleChange} placeholder="URL do Google Maps ou descrição do trajeto" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorTotal">Valor Total (R$)</Label>
                <Input id="valorTotal" name="valorTotal" type="number" value={formData.valorTotal} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorSinal">Valor do Sinal (R$)</Label>
                <Input id="valorSinal" name="valorSinal" type="number" value={formData.valorSinal} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorRestante">Valor Restante (R$)</Label>
                <Input id="valorRestante" name="valorRestante" type="number" value={formData.valorRestante} onChange={handleChange} disabled />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="Observações sobre o evento" />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-festa-primary hover:bg-festa-primary/90">
                Agendar Evento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>;
};
export default CalendarPage;