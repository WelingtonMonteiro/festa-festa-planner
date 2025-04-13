import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useHandleContext } from "@/contexts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Package, History, DollarSign, Trash2, Edit, AlertCircle, ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import NewClientDialog from "@/components/clients/NewClientDialog.tsx";
import MapClient from "@/components/clients/MapClient.tsx";

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, removeClients } = useHandleContext();
  const [dialogEdicaoAberto, setDialogEdicaoAberto] = useState(false);
  
  const cliente = clients.find((c) => c.id === id);
  
  if (cliente && !cliente.historico) {
    cliente.historico = [];
  }
  
  useEffect(() => {
    if (!cliente && id) {
      navigate("/clients");
    }
  }, [cliente, id, navigate]);
  
  if (!cliente) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-2 text-xl font-semibold">Cliente não encontrado</h2>
          <p className="mt-1 text-muted-foreground">O cliente solicitado não existe ou foi removido</p>
          <Button 
            variant="link" 
            onClick={() => navigate("/clients")}
            className="mt-4"
          >
            Voltar para a lista de clientes
          </Button>
        </div>
      </div>
    );
  }
  
  const historico = cliente.historico || [];
  
  const totalEventos = historico.length;
  const valorTotalGasto = historico.reduce(
    (total, evento) => total + (Number(evento?.valorTotal) || 0),
    0
  );
  
  const kitsAlugados = historico.reduce((acc, evento) => {
    if (evento?.kit) {
      const kitId = evento.kit.id;
      acc[kitId] = (acc[kitId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const temasAlugados = historico.reduce((acc, evento) => {
    if (evento?.tema) {
      const temaId = evento.tema.id;
      acc[temaId] = (acc[temaId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const statusEventos = historico.reduce((acc, evento) => {
    if (evento?.status) {
      acc[evento.status] = (acc[evento.status] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const handleExcluirCliente = () => {
    removeClients(cliente.id);
    navigate("/clients");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/clients")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{cliente.nome}</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setDialogEdicaoAberto(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso irá remover permanentemente o cliente {cliente.nome} e todos os seus dados associados.
                  {cliente.historico.length > 0 && (
                    <div className="mt-2 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/30">
                      <div className="flex items-center">
                        <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Este cliente possui {cliente.historico.length} evento(s) registrado(s).
                          A exclusão não será possível.
                        </p>
                      </div>
                    </div>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <Button 
                  variant="destructive" 
                  onClick={handleExcluirCliente}
                  disabled={cliente.historico.length > 0}
                >
                  Excluir
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total de Eventos</p>
              <p className="text-2xl font-bold">
                {totalEventos}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <CalendarDays className="h-6 w-6 text-blue-700 dark:text-blue-300" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold">
                R$ {valorTotalGasto.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <DollarSign className="h-6 w-6 text-green-700 dark:text-green-300" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Kits Alugados</p>
              <p className="text-2xl font-bold">{Object.values(kitsAlugados).reduce((a, b) => a + b, 0)}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
              <Package className="h-6 w-6 text-purple-700 dark:text-purple-300" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Locais</p>
              <p className="text-2xl font-bold">
                {new Set(cliente.historico.map(e => e.local)).size}
              </p>
            </div>
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
              <MapPin className="h-6 w-6 text-amber-700 dark:text-amber-300" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="historico">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          <TabsTrigger value="mapa">Mapa</TabsTrigger>
        </TabsList>
        
        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                Histórico de Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cliente.historico.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tema / Kit</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...cliente.historico]
                      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                      .map((evento) => (
                        <TableRow key={evento.id}>
                          <TableCell>
                            <div className="font-medium">
                              {format(new Date(evento.data), 'dd/MM/yyyy')}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {evento.horario}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>{evento.tema?.nome || "Sem tema"}</div>
                            <div className="text-sm text-muted-foreground">
                              {evento.kit?.nome}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate">{evento.local}</div>
                          </TableCell>
                          <TableCell>
                            R$ {evento.valorTotal.toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              evento.status === "finalizado" ? "bg-green-500" :
                              evento.status === "agendado" ? "bg-blue-500" :
                              evento.status === "confirmado" ? "bg-amber-500" :
                              "bg-red-500"
                            }>
                              {evento.status.charAt(0).toUpperCase() + evento.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <AlertCircle className="h-10 w-10 text-muted-foreground/70" />
                  <p className="mt-2 text-muted-foreground">
                    Este cliente ainda não possui eventos registrados
                  </p>
                  <Button 
                    variant="link" 
                    onClick={() => navigate("/calendar")}
                  >
                    Agendar um evento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="estatisticas">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Kits Alugados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(kitsAlugados).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(kitsAlugados).map(([kitId, quantidade]) => {
                      const kit = cliente.historico.find(e => e.kit?.id === kitId)?.kit;
                      if (!kit) return null;
                      
                      const valorTotal = cliente.historico
                        .filter(e => e.kit?.id === kitId)
                        .reduce((acc, evento) => acc + (Number(evento.valorTotal) || 0), 0);
                      
                      return (
                        <div key={kitId} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <div className="font-medium">{kit.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {quantidade} {Number(quantidade) > 1 ? "vezes" : "vez"}
                            </div>
                          </div>
                          <div className="text-right font-medium">
                            R$ {valorTotal.toLocaleString('pt-BR')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-muted-foreground">
                      Nenhum kit alugado por este cliente
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Temas Alugados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(temasAlugados).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(temasAlugados).map(([temaId, quantidade]) => {
                      const tema = cliente.historico.find(e => e.tema?.id === temaId)?.tema;
                      if (!tema) return null;
                      
                      const valorTotal = cliente.historico
                        .filter(e => e.tema?.id === temaId)
                        .reduce((acc, evento) => acc + (Number(evento.valorTotal) || 0), 0);
                      
                      return (
                        <div key={temaId} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <div className="font-medium">{tema.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {quantidade} {Number(quantidade) > 1 ? "vezes" : "vez"}
                            </div>
                          </div>
                          <div className="text-right font-medium">
                            R$ {valorTotal.toLocaleString('pt-BR')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-muted-foreground">
                      Nenhum tema alugado por este cliente
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="mapa">
          <Card className="min-h-[500px]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Mapa de Eventos
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
              <MapClient events={cliente.historico} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <NewClientDialog
        open={dialogEdicaoAberto}
        onOpenChange={setDialogEdicaoAberto}
        editClient={{
          id: cliente.id,
          nome: cliente.nome,
          telefone: cliente.telefone,
          email: cliente.email,
          endereco: cliente.endereco,
        }}
      />
    </div>
  );
};

export default ClientDetails;
