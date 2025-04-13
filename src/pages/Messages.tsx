import { useEffect, useState } from "react";
import { useHandleContext } from "@/contexts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, CheckCheck, User, Bot } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Messages = () => {
  const { clients, messages, addMessage, markMessageAsRead } = useHandleContext();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  
  // Ordenar mensagens por data e hora
  const sortedMessages = [...messages].sort((a, b) => new Date(a.datahora).getTime() - new Date(b.datahora).getTime());
  
  // Filtrar mensagens do cliente selecionado
  const clientMessages = selectedClient
    ? sortedMessages.filter(msg => msg.clienteId === selectedClient)
    : [];
  
  // Encontrar o cliente selecionado
  const client = clients.find(c => c.id === selectedClient);
  
  // Marcar mensagens como lidas ao selecionar o cliente
  useEffect(() => {
    if (selectedClient) {
      messages
        .filter(msg => msg.clienteId === selectedClient && !msg.lida)
        .forEach(msg => markMessageAsRead(msg.id));
    }
  }, [selectedClient, messages, markMessageAsRead]);
  
  // Handler para enviar mensagem
  const handleSendMessage = () => {
    if (selectedClient && newMessage.trim() !== "") {
      addMessage({
        remetente: 'empresa',
        clienteId: selectedClient,
        conteudo: newMessage,
        lida: false
      });
      setNewMessage("");
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-4">Mensagens</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista de Clientes */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>Selecione um cliente para ver as mensagens</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[450px] w-full">
              <div className="space-y-2 p-4">
                {clients.map(client => (
                  <Button
                    key={client.id}
                    variant="ghost"
                    className={`w-full justify-start ${selectedClient === client.id ? 'bg-muted hover:bg-muted' : ''}`}
                    onClick={() => setSelectedClient(client.id)}
                  >
                    <Avatar className="mr-2 h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${client.nome}`} />
                      <AvatarFallback>{client.nome.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {client.nome}
                    {messages.filter(msg => msg.clienteId === client.id && !msg.lida).length > 0 && (
                      <Badge className="ml-auto">{messages.filter(msg => msg.clienteId === client.id && !msg.lida).length}</Badge>
                    )}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Área de Mensagens */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{client ? `Mensagens com ${client.nome}` : 'Selecione um cliente'}</CardTitle>
            <CardDescription>Visualize e responda as mensagens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedClient ? (
              <div className="flex flex-col h-[400px] justify-between">
                <ScrollArea className="h-[330px] w-full">
                  <div className="space-y-2">
                    {clientMessages.length > 0 ? (
                      clientMessages.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex items-start ${msg.remetente === 'empresa' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.remetente !== 'empresa' && (
                            <Avatar className="mr-2 h-6 w-6">
                              <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${client?.nome}`} />
                              <AvatarFallback>{client?.nome.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex flex-col">
                            <div
                              className={`rounded-lg p-2 text-sm ${msg.remetente === 'empresa'
                                ? 'bg-festa-primary text-white'
                                : 'bg-muted'
                                }`}
                            >
                              {msg.conteudo}
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(msg.datahora), { addSuffix: true, locale: ptBR })}
                              {msg.lida && msg.remetente === 'empresa' && (
                                <CheckCheck className="ml-1 inline-block h-3 w-3" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <p className="text-sm text-muted-foreground">Nenhuma mensagem encontrada</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage}><Send className="h-4 w-4" /></Button>
                </div>
              </div>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <User className="h-10 w-10 text-muted-foreground/70" />
                <p className="text-sm text-muted-foreground">Selecione um cliente para ver as mensagens</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
