
import { useState } from 'react';
import { useFestaContext } from "@/contexts/FestaContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, Facebook, Instagram, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Mensagens = () => {
  const { mensagens, clientes, adicionarMensagem, marcarMensagemComoLida } = useFestaContext();
  const [plataforma, setPlataforma] = useState<'whatsapp' | 'instagram' | 'facebook'>('whatsapp');
  const [clienteSelecionado, setClienteSelecionado] = useState<string | null>(null);
  const [novaMensagem, setNovaMensagem] = useState('');
  
  const clientesComMensagens = clientes.filter(cliente => 
    mensagens.some(m => m.clienteId === cliente.id)
  );
  
  // Função para obter nome do cliente com base no ID do cliente
  const obterNomeCliente = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente';
  };
  
  // Função auxiliar para formatar data
  const formatarData = (data: string) => {
    return format(new Date(data), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };

  // Formata data para o chat de modo mais compacto
  const formatarHoraMensagem = (data: string) => {
    return format(new Date(data), "HH:mm", { locale: ptBR });
  };
  
  // Filtrar mensagens do cliente selecionado
  const mensagensFiltradas = clienteSelecionado 
    ? mensagens
        .filter(m => m.clienteId === clienteSelecionado)
        .sort((a, b) => new Date(a.datahora).getTime() - new Date(b.datahora).getTime())
    : [];
    
  // Marcar mensagens como lidas ao visualizar
  if (clienteSelecionado) {
    mensagensFiltradas
      .filter(m => !m.lida && m.remetente === 'cliente')
      .forEach(m => marcarMensagemComoLida(m.id));
  }
  
  // Enviar nova mensagem
  const enviarMensagem = () => {
    if (!novaMensagem.trim() || !clienteSelecionado) return;
    
    adicionarMensagem({
      remetente: 'empresa',
      clienteId: clienteSelecionado,
      conteudo: novaMensagem,
      lida: true
    });
    
    toast.success("Mensagem enviada com sucesso!");
    setNovaMensagem('');
  };
  
  // Pegar o ícone da plataforma
  const getPlataformaIcon = (plataforma: 'whatsapp' | 'instagram' | 'facebook') => {
    switch(plataforma) {
      case 'whatsapp':
        return <Phone className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mensagens</h1>
        <p className="text-muted-foreground">
          Gerencie suas conversas com clientes através de diferentes plataformas
        </p>
      </div>
      
      <Tabs defaultValue="whatsapp" onValueChange={(value) => setPlataforma(value as any)}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> WhatsApp
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" /> Instagram
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" /> Facebook
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-240px)]">
          {/* Lista de clientes - 4 colunas */}
          <div className="col-span-4 bg-secondary/10 rounded-lg overflow-y-auto h-full">
            <div className="p-3 border-b">
              <h3 className="font-medium">Conversas</h3>
            </div>
            
            {clientesComMensagens.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Nenhuma conversa encontrada
              </div>
            ) : (
              <div className="divide-y">
                {clientesComMensagens.map(cliente => {
                  const ultimaMensagem = [...mensagens]
                    .filter(m => m.clienteId === cliente.id)
                    .sort((a, b) => 
                      new Date(b.datahora).getTime() - new Date(a.datahora).getTime()
                    )[0];
                  
                  const mensagensNaoLidas = mensagens.filter(
                    m => m.clienteId === cliente.id && !m.lida && m.remetente === 'cliente'
                  ).length;
                  
                  return (
                    <div 
                      key={cliente.id}
                      className={`p-3 hover:bg-accent/20 cursor-pointer ${
                        clienteSelecionado === cliente.id ? 'bg-accent/30' : ''
                      }`}
                      onClick={() => setClienteSelecionado(cliente.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {cliente.nome.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium truncate">{cliente.nome}</h4>
                            {ultimaMensagem && (
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(ultimaMensagem.datahora), "dd/MM")}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex justify-between">
                            {ultimaMensagem && (
                              <p className="text-sm text-muted-foreground truncate">
                                {ultimaMensagem.remetente === 'empresa' ? 'Você: ' : ''}
                                {ultimaMensagem.conteudo}
                              </p>
                            )}
                            
                            {mensagensNaoLidas > 0 && (
                              <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                                {mensagensNaoLidas}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Chat - 8 colunas */}
          <div className="col-span-8 bg-card border rounded-lg flex flex-col h-full">
            {!clienteSelecionado ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Selecione um cliente para iniciar uma conversa
              </div>
            ) : (
              <>
                {/* Cabeçalho do chat */}
                <div className="p-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {obterNomeCliente(clienteSelecionado).substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-medium">{obterNomeCliente(clienteSelecionado)}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {getPlataformaIcon(plataforma)} <span>{plataforma}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {mensagensFiltradas.map(mensagem => (
                    <div
                      key={mensagem.id}
                      className={`flex ${mensagem.remetente === 'empresa' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          mensagem.remetente === 'empresa' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary/50'
                        }`}
                      >
                        <p>{mensagem.conteudo}</p>
                        <p className={`text-xs mt-1 text-right ${
                          mensagem.remetente === 'empresa' 
                            ? 'text-primary-foreground/80' 
                            : 'text-muted-foreground'
                        }`}>
                          {formatarHoraMensagem(mensagem.datahora)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Input para enviar mensagem */}
                <div className="p-3 border-t">
                  <form 
                    className="flex gap-2" 
                    onSubmit={(e) => {
                      e.preventDefault();
                      enviarMensagem();
                    }}
                  >
                    <Textarea
                      value={novaMensagem}
                      onChange={(e) => setNovaMensagem(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="resize-none min-h-[50px] flex-1"
                      rows={1}
                    />
                    <Button type="submit" disabled={!novaMensagem.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Mensagens;
