
import { useState, useEffect } from 'react';
import { useHandleContext } from '@/contexts/handleContext';
import { useLocation } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const Financial = () => {
  const { events } = useHandleContext();
  const [activeTab, setActiveTab] = useState("receitas");
  const location = useLocation();
  
  // Verificar se veio de outra página com state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  
  // Filtrar events pelo status e calcular valores financeiros
  const eventosConfirmados = events.filter(e => (e.status === 'confirmado' || e.status === 'finalizado') && e.cliente);
  const eventosAgendados = events.filter(e => e.status === 'agendado' && e.cliente);
  
  const totalReceitas = eventosConfirmados.reduce((acc, evento) => acc + evento.valorTotal, 0);
  const totalPendente = eventosAgendados.reduce((acc, evento) => acc + evento.valorTotal, 0);
  const sinaisRecebidos = eventosConfirmados.reduce((acc, evento) => acc + (evento.valorSinal || 0), 0);
  const valorAReceber = eventosConfirmados.reduce((acc, evento) => acc + (evento.valorRestante || 0), 0);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
        <p className="text-muted-foreground">
          Gerencie as finanças da sua empresa de festas
        </p>
      </div>
      
      {/* Resumo Financial */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Receitas</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalReceitas)}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Pendente</CardDescription>
            <CardTitle className="text-2xl text-amber-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPendente)}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sinais Recebidos</CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sinaisRecebidos)}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>A Receber</CardDescription>
            <CardTitle className="text-2xl text-purple-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorAReceber)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      {/* Tabs para diferentes visualizações */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
          <TabsTrigger value="fluxo">Fluxo de Caixa</TabsTrigger>
        </TabsList>
        
        <TabsContent value="receitas" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Receitas de Eventos</CardTitle>
              <CardDescription>Visualize os pagamentos recebidos e pendentes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Receitas de eventos confirmados e finalizados</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Sinal</TableHead>
                    <TableHead>Restante</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventosConfirmados.length > 0 ? (
                    eventosConfirmados.map((evento) => (
                      <TableRow key={evento.id}>
                        <TableCell>
                          {format(new Date(evento.data), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>{evento.cliente?.nome || "Cliente não informado"}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(evento.valorTotal)}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(evento.valorSinal || 0)}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(evento.valorRestante || 0)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            evento.status === 'finalizado' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {evento.status === 'finalizado' ? 'Finalizado' : 'Confirmado'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Nenhum evento confirmado ou finalizado</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="despesas" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Despesas</CardTitle>
              <CardDescription>Controle de despesas da empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fluxo" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Caixa</CardTitle>
              <CardDescription>Análise de entradas e saídas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financial;
