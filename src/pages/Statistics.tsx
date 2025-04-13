import { useState } from 'react';
import { useHandleContext } from "@/contexts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const Statistics = () => {
  const { statistics, events, thems } = useHandleContext();
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');
  
  // Preparar dados para gráficos
  const prepararDadosEventos = () => {
    return Object.entries(statistics?.eventosPorMes || {}).map(([mes, quantidade]) => ({
      mes,
      quantidade
    }));
  };
  
  const prepararDadosKitsPopulares = () => {
    return statistics?.kitsPopulares?.map(({ kit, quantidade }) => ({
      name: kit,
      value: quantidade
    })) || [];
  };
  
  const prepararDadosTemasPorAno = () => {
    return Object.entries(statistics?.temasPorAno || {}).map(([tema, quantidade]) => ({
      name: tema,
      value: quantidade
    }));
  };
  
  const prepararDadosFaturamento = () => {
    return Object.entries(statistics?.faturamentoMensal || {}).map(([mes, valor]) => ({
      mes,
      valor
    }));
  };
  
  // Calcular retorno sobre investimento (ROI) dos temas
  const calcularROITemas = () => {
    return thems?.map(tema => {
      const receitaTotal = tema.vezes_alugado * (tema.kits.reduce((sum, kit) => sum + kit.preco, 0) / tema.kits.length);
      const roi = tema.valorGasto > 0 ? ((receitaTotal / tema.valorGasto) - 1) * 100 : 0;
      
      return {
        name: tema.nome,
        vezes_alugado: tema.vezes_alugado,
        roi: parseFloat(roi.toFixed(2)),
        investimento: tema.valorGasto,
        receita: receitaTotal
      };
    }).sort((a, b) => b.roi - a.roi) || [];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Estatísticas</h1>
      </div>
      
      <Tabs defaultValue="eventos" className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="kits">Kits</TabsTrigger>
          <TabsTrigger value="temas">Temas</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>
        
        {/* Tab Eventos */}
        <TabsContent value="eventos">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Eventos por Mês</CardTitle>
                <CardDescription>Quantidade de eventos realizados em cada mês</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepararDadosEventos()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" name="Quantidade de Eventos" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-full lg:col-span-2">
              <CardHeader>
                <CardTitle>Status dos Eventos</CardTitle>
                <CardDescription>Distribuição dos status de eventos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <div className="text-2xl font-bold text-festa-primary">
                      {events.filter(e => e.status === 'agendado').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Agendados</div>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <div className="text-2xl font-bold text-festa-secondary">
                      {events.filter(e => e.status === 'confirmado').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Confirmados</div>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <div className="text-2xl font-bold text-festa-accent">
                      {events.filter(e => e.status === 'finalizado').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Finalizados</div>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <div className="text-2xl font-bold text-gray-500">
                      {events.filter(e => e.status === 'cancelado').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Cancelados</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Total de Eventos</CardTitle>
                <CardDescription>Todos os eventos registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold text-festa-primary mb-2">{events.length}</div>
                  <div className="text-sm text-muted-foreground">Total de eventos</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab Kits */}
        <TabsContent value="kits">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Kits Mais Populares</CardTitle>
                <CardDescription>Frequência de aluguel de cada kit</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statistics.kitsPopulares} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="kit" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" name="Quantidade de Aluguéis" fill="#EC4899" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Kits</CardTitle>
                <CardDescription>Porcentagem de uso de cada kit</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepararDadosKitsPopulares()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {prepararDadosKitsPopulares().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Kits</CardTitle>
                <CardDescription>Os kits mais alugados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statistics.kitsPopulares.slice(0, 5).map((kit, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-medium">
                        {index + 1}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="font-medium">{kit.kit}</div>
                        <div className="text-sm text-muted-foreground">{kit.quantidade} aluguéis</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab Temas */}
        <TabsContent value="temas">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Temas Mais Populares</CardTitle>
                <CardDescription>Frequência de aluguel de cada tema</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepararDadosTemasPorAno()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Quantidade de Aluguéis" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>ROI por Tema</CardTitle>
                <CardDescription>Retorno sobre investimento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calcularROITemas().map((tema, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{tema.name}</div>
                        <div className={tema.roi >= 0 ? "text-green-600" : "text-red-600"}>
                          {tema.roi}%
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Alugado {tema.vezes_alugado} vezes
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Investimento: R$ {tema.investimento}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Detalhe de ROI</CardTitle>
                <CardDescription>Comparativo entre investimento e receita gerada por tema</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={calcularROITemas()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="investimento" name="Investimento (R$)" fill="#EC4899" />
                    <Bar dataKey="receita" name="Receita (R$)" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab Financial */}
        <TabsContent value="financeiro">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Faturamento Mensal</CardTitle>
                <CardDescription>Receita gerada ao longo dos meses</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepararDadosFaturamento()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                    <Legend />
                    <Bar dataKey="valor" name="Faturamento (R$)" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
                <CardDescription>Valores totalizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {events
                        .reduce((total, evento) => total + evento.valorTotal, 0)
                        .toLocaleString('pt-BR')}
                    </div>
                    <div className="text-sm text-muted-foreground">Faturamento Total</div>
                  </div>
                  
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      R$ {events
                        .reduce((total, evento) => total + evento.valorRestante, 0)
                        .toLocaleString('pt-BR')}
                    </div>
                    <div className="text-sm text-muted-foreground">À Receber</div>
                  </div>
                  
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <div className="text-2xl font-bold text-festa-primary">
                      R$ {events
                        .filter(e => e.status === 'finalizado')
                        .reduce((total, evento) => total + evento.valorTotal, 0)
                        .toLocaleString('pt-BR')}
                    </div>
                    <div className="text-sm text-muted-foreground">Receita Realizada</div>
                  </div>
                  
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <div className="text-2xl font-bold text-festa-secondary">
                      R$ {thems
                        .reduce((total, tema) => total + tema.valorGasto, 0)
                        .toLocaleString('pt-BR')}
                    </div>
                    <div className="text-sm text-muted-foreground">Investimento em Temas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ticket Médio</CardTitle>
                <CardDescription>Valor médio por evento e outras métricas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <div className="text-sm text-muted-foreground mb-1">Ticket Médio</div>
                    <div className="text-2xl font-bold">
                      R$ {events.length > 0
                        ? (events.reduce((total, evento) => total + evento.valorTotal, 0) / events.length).toFixed(2)
                        : '0.00'}
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-muted p-4">
                    <div className="text-sm text-muted-foreground mb-1">Percentual Médio de Sinal</div>
                    <div className="text-2xl font-bold">
                      {events.length > 0
                        ? (events.reduce((total, evento) =>
                            total + (evento.valorSinal / evento.valorTotal * 100), 0) / events.length).toFixed(0)
                        : '0'}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
