
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarDays, ClipboardCheck, Clock, DollarSign, PartyPopper, Tag, Users } from "lucide-react";
import { useHandleContext } from "@/contexts/handleContext.tsx";
import { format, isSameDay } from 'date-fns';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const { clients, thems, events, statistics } = useHandleContext();
  const navigate = useNavigate();
  
  // Estatísticas e cálculos
  const eventosHoje = events.filter(evento =>
    isSameDay(new Date(evento.data), new Date()) && evento.status !== 'cancelado'
  );
  
  const eventosFuturos = events.filter(evento =>
    new Date(evento.data) > new Date() && evento.status !== 'cancelado'
  );
  
  const faturamentoTotal = events
    .filter(e => e.status === 'finalizado')
    .reduce((total, evento) => total + evento.valorTotal, 0);
  
  const temasMaisPopulares = thems
    .sort((a, b) => b.vezes_alugado - a.vezes_alugado)
    .slice(0, 3);
  
  // Calcular próximos events
  const proximosEventos = eventosFuturos
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 3);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => navigate('/calendar')}
            className="bg-festa-primary hover:bg-festa-primary/90"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Agendar Evento
          </Button>
          <Button 
            onClick={() => navigate('/clients/management')}
            variant="outline"
          >
            <Users className="mr-2 h-4 w-4" />
            Gerenciar Clientes
          </Button>
        </div>
      </div>
      
      {/* Resumo estatístico */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div className="space-y-1">
              <CardDescription>Eventos Hoje</CardDescription>
              <CardTitle>{eventosHoje.length}</CardTitle>
            </div>
            <div className="rounded-full bg-festa-primary/20 p-2">
              <CalendarDays className="h-6 w-6 text-festa-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div className="space-y-1">
              <CardDescription>Total de Clientes</CardDescription>
              <CardTitle>{clients.length}</CardTitle>
            </div>
            <div className="rounded-full bg-festa-secondary/20 p-2">
              <Users className="h-6 w-6 text-festa-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div className="space-y-1">
              <CardDescription>Eventos Agendados</CardDescription>
              <CardTitle>{eventosFuturos.length}</CardTitle>
            </div>
            <div className="rounded-full bg-festa-accent/20 p-2">
              <ClipboardCheck className="h-6 w-6 text-festa-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div className="space-y-1">
              <CardDescription>Faturamento Total</CardDescription>
              <CardTitle>R$ {faturamentoTotal.toLocaleString('pt-BR')}</CardTitle>
            </div>
            <div className="rounded-full bg-green-200 p-2">
              <DollarSign className="h-6 w-6 text-green-700" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Seções principais */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Próximos events */}
        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" /> 
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {proximosEventos.length > 0 ? (
              <div className="space-y-4">
                {proximosEventos.map(evento => (
                  <div key={evento.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1">
                      <div className="font-medium">{evento.cliente?.nome || 'Cliente não definido'}</div>
                      <div className="text-sm text-muted-foreground">
                        {evento.tema?.nome || 'Sem tema'} - {evento.kit?.nome || 'Kit não definido'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {format(new Date(evento.data), 'dd/MM/yyyy')}
                      </div>
                      <div className="text-sm text-muted-foreground">{evento.horario}</div>
                    </div>
                  </div>
                ))}
                {eventosFuturos.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate('/calendar')}
                  >
                    Ver todos os eventos
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhum evento agendado
                </p>
                <Button variant="link" onClick={() => navigate('/calendar')}>
                  Agendar um evento
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Temas mais populares */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="mr-2 h-5 w-5" />
              Temas Mais Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            {temasMaisPopulares.length > 0 ? (
              <div className="space-y-4">
                {temasMaisPopulares.map(tema => (
                  <div key={tema.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{tema.nome}</span>
                      <span className="text-sm text-muted-foreground">
                        {tema.vezes_alugado} {tema.vezes_alugado === 1 ? 'vez' : 'vezes'}
                      </span>
                    </div>
                    <Progress value={tema.vezes_alugado * 10} className="h-2" />
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/kits-temas')}
                >
                  Gerenciar temas
                </Button>
              </div>
            ) : (
              <div className="flex h-24 flex-col items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">
                  Nenhum tema registrado
                </p>
                <Button variant="link" onClick={() => navigate('/kits-temas')}>
                  Adicionar temas
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Eventos de hoje */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PartyPopper className="mr-2 h-5 w-5" />
              Eventos de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventosHoje.length > 0 ? (
              <div className="space-y-4">
                {eventosHoje.map(evento => (
                  <div key={evento.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1">
                      <div className="font-medium">{evento.cliente?.nome || 'Cliente não definido'}</div>
                      <div className="text-sm text-muted-foreground">
                        {evento.tema?.nome || 'Sem tema'} - {evento.kit?.nome || 'Kit não definido'}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {evento.horario}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-24 flex-col items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">
                  Nenhum evento para hoje
                </p>
                <Button variant="link" onClick={() => navigate('/calendar')}>
                  Ver calendário
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
