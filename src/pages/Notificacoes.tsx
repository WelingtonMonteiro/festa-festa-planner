
import { useState, useEffect } from 'react';
import { useFestaContext } from '@/contexts/FestaContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Notificacao = {
  id: string;
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  tipo: 'evento' | 'mensagem' | 'sistema';
  eventoId?: string;
  mensagemId?: string;
};

const Notificacoes = () => {
  const { eventos, mensagens } = useFestaContext();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [filtro, setFiltro] = useState<'todas' | 'lidas' | 'nao-lidas'>('todas');
  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState<Notificacao | null>(null);
  const [modalAberta, setModalAberta] = useState(false);
  
  // Gerar notificações com base nos eventos e mensagens
  useEffect(() => {
    const novasNotificacoes: Notificacao[] = [];
    
    // Verificar eventos próximos (nos próximos 3 dias)
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    
    const eventosProximos = eventos.filter(evento => {
      const dataEvento = new Date(evento.data);
      return dataEvento >= today && dataEvento <= threeDaysLater && evento.status !== 'cancelado';
    });
    
    eventosProximos.forEach(evento => {
      novasNotificacoes.push({
        id: `evento-${evento.id}`,
        titulo: 'Evento Próximo',
        mensagem: `${evento.cliente.nome} - ${format(new Date(evento.data), 'dd/MM/yyyy')}`,
        data: new Date().toISOString(),
        lida: false,
        tipo: 'evento',
        eventoId: evento.id
      });
    });
    
    // Adicionar mensagens não lidas
    const mensagensNaoLidas = mensagens.filter(m => !m.lida && m.remetente === 'cliente');
    mensagensNaoLidas.forEach(mensagem => {
      novasNotificacoes.push({
        id: `mensagem-${mensagem.id}`,
        titulo: 'Mensagem Não Lida',
        mensagem: mensagem.conteudo,
        data: mensagem.datahora,
        lida: false,
        tipo: 'mensagem',
        mensagemId: mensagem.id
      });
    });
    
    // Recuperar notificações do localStorage se existirem
    const notificacoesArmazenadas = localStorage.getItem('notificacoes');
    const notificacoesExistentes = notificacoesArmazenadas ? JSON.parse(notificacoesArmazenadas) : [];
    
    // Combinar notificações existentes com as novas
    const todasNotificacoes = [...notificacoesExistentes, ...novasNotificacoes];
    
    // Remover duplicatas (baseado no ID)
    const notificacoesUnicas = Array.from(
      new Map(todasNotificacoes.map(item => [item.id, item])).values()
    );
    
    // Ordenar por data (mais recentes primeiro)
    notificacoesUnicas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    
    setNotificacoes(notificacoesUnicas);
    localStorage.setItem('notificacoes', JSON.stringify(notificacoesUnicas));
  }, [eventos, mensagens]);
  
  const notificacoesFiltradas = notificacoes.filter(notificacao => {
    if (filtro === 'todas') return true;
    if (filtro === 'lidas') return notificacao.lida;
    if (filtro === 'nao-lidas') return !notificacao.lida;
    return true;
  });
  
  const marcarComoLida = (id: string) => {
    const atualizadas = notificacoes.map(n => 
      n.id === id ? { ...n, lida: true } : n
    );
    setNotificacoes(atualizadas);
    localStorage.setItem('notificacoes', JSON.stringify(atualizadas));
  };
  
  const abrirDetalhes = (notificacao: Notificacao) => {
    marcarComoLida(notificacao.id);
    setNotificacaoSelecionada(notificacao);
    setModalAberta(true);
  };
  
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Notificações</h1>
        <p className="text-muted-foreground">
          Gerencie todas as suas notificações em um só lugar
        </p>
      </div>
      
      <Tabs defaultValue="todas" onValueChange={(value) => setFiltro(value as any)}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="nao-lidas">Não lidas</TabsTrigger>
            <TabsTrigger value="lidas">Lidas</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="todas" className="mt-0">
          {renderNotificacoes(notificacoesFiltradas, abrirDetalhes)}
        </TabsContent>
        
        <TabsContent value="nao-lidas" className="mt-0">
          {renderNotificacoes(notificacoesFiltradas, abrirDetalhes)}
        </TabsContent>
        
        <TabsContent value="lidas" className="mt-0">
          {renderNotificacoes(notificacoesFiltradas, abrirDetalhes)}
        </TabsContent>
      </Tabs>
      
      {/* Modal de detalhes da notificação - modificado para mostrar o conteúdo completo */}
      <Dialog open={modalAberta} onOpenChange={setModalAberta}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{notificacaoSelecionada?.titulo}</DialogTitle>
            <DialogDescription>
              {notificacaoSelecionada && format(new Date(notificacaoSelecionada.data), 
                "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
              }
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 pt-0">
            <p className="text-base">{notificacaoSelecionada?.mensagem}</p>
            
            {notificacaoSelecionada?.tipo === 'evento' && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Esta notificação está relacionada a um evento próximo.
                </p>
                <Button 
                  className="mt-2"
                  onClick={() => {
                    setModalAberta(false);
                    window.location.href = `/eventos?id=${notificacaoSelecionada.eventoId}`;
                  }}
                >
                  Ver Evento
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Função auxiliar para renderizar a lista de notificações
const renderNotificacoes = (
  notificacoes: Notificacao[], 
  abrirDetalhes: (notificacao: Notificacao) => void
) => {
  if (notificacoes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma notificação encontrada</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {notificacoes.map(notificacao => (
        <div 
          key={notificacao.id} 
          className={`p-4 rounded-lg border cursor-pointer transition-colors
            ${notificacao.lida 
              ? 'bg-background hover:bg-accent/50' 
              : 'bg-accent/20 hover:bg-accent/30 font-medium'
            }`}
          onClick={() => abrirDetalhes(notificacao)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{notificacao.titulo}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notificacao.mensagem}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs text-muted-foreground">
                {format(new Date(notificacao.data), 'dd/MM/yyyy')}
              </span>
              {!notificacao.lida && (
                <Badge variant="secondary" className="bg-festa-secondary text-white">Nova</Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notificacoes;
