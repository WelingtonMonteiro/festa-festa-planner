
import { useState } from 'react';
import { useHandleContext } from "@/contexts/handleContext.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, Facebook, Instagram, Phone, FileText, Link2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import ContractMessageSender from "@/components/contracts/ContractMessageSender";
import { toast } from "sonner";

const Messages = () => {
  const { messages: messages, clients: clients, addMessage: addMessage, markMessageAsRead: markMessageAsRead } = useHandleContext();
  const [platform, setPlatform] = useState<'whatsapp' | 'instagram' | 'facebook'>('whatsapp');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  const clientsWithMessages = clients.filter(client => 
    messages.some(m => m.clienteId === client.id)
  );
  
  // Function to get client name based on client ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.nome : 'Client';
  };
  
  // Helper function to format date
  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };

  // Format date for chat in a more compact way
  const formatMessageTime = (date: string) => {
    return format(new Date(date), "HH:mm", { locale: ptBR });
  };
  
  // Filter messages for selected client
  const filteredMessages = selectedClient 
    ? messages
        .filter(m => m.clienteId === selectedClient)
        .sort((a, b) => new Date(a.datahora).getTime() - new Date(b.datahora).getTime())
    : [];
    
  // Mark messages as read when viewed
  if (selectedClient) {
    filteredMessages
      .filter(m => !m.lida && m.remetente === 'cliente')
      .forEach(m => markMessageAsRead(m.id));
  }
  
  // Send new message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedClient) return;
    
    addMessage({
      remetente: 'empresa',
      clienteId: selectedClient,
      conteudo: newMessage,
      lida: true
    });
    
    toast.success("Message sent successfully!");
    setNewMessage('');
  };
  
  // Get platform icon
  const getPlatformIcon = (platform: 'whatsapp' | 'instagram' | 'facebook') => {
    switch(platform) {
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
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">
          Manage your conversations with clients across different platforms
        </p>
      </div>
      
      <Tabs defaultValue="whatsapp" onValueChange={(value) => setPlatform(value as any)}>
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
          
          {selectedClient && (
            <div className="flex gap-2">
              <ContractMessageSender clientId={selectedClient} />
              <Button variant="outline" size="sm" asChild>
                <Link2 className="h-4 w-4 mr-1" />
                <a href="/contracts" target="_blank">Contratos</a>
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-240px)]">
          {/* Client list - 4 columns */}
          <div className="col-span-4 bg-secondary/10 rounded-lg overflow-y-auto h-full">
            <div className="p-3 border-b">
              <h3 className="font-medium">Conversations</h3>
            </div>
            
            {clientsWithMessages.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No conversations found
              </div>
            ) : (
              <div className="divide-y">
                {clientsWithMessages.map(client => {
                  const lastMessage = [...messages]
                    .filter(m => m.clienteId === client.id)
                    .sort((a, b) => 
                      new Date(b.datahora).getTime() - new Date(a.datahora).getTime()
                    )[0];
                  
                  const unreadMessages = messages.filter(
                    m => m.clienteId === client.id && !m.lida && m.remetente === 'cliente'
                  ).length;
                  
                  return (
                    <div 
                      key={client.id}
                      className={`p-3 hover:bg-accent/20 cursor-pointer ${
                        selectedClient === client.id ? 'bg-accent/30' : ''
                      }`}
                      onClick={() => setSelectedClient(client.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {client.nome.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium truncate">{client.nome}</h4>
                            {lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(lastMessage.datahora), "dd/MM")}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex justify-between">
                            {lastMessage && (
                              <p className="text-sm text-muted-foreground truncate">
                                {lastMessage.remetente === 'empresa' ? 'You: ' : ''}
                                {lastMessage.conteudo}
                              </p>
                            )}
                            
                            {unreadMessages > 0 && (
                              <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                                {unreadMessages}
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
          
          {/* Chat - 8 columns */}
          <div className="col-span-8 bg-card border rounded-lg flex flex-col h-full">
            {!selectedClient ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a client to start a conversation
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="p-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getClientName(selectedClient).substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-medium">{getClientName(selectedClient)}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {getPlatformIcon(platform)} <span>{platform}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {filteredMessages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.remetente === 'empresa' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.remetente === 'empresa' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary/50'
                        }`}
                      >
                        <p>{message.conteudo}</p>
                        <p className={`text-xs mt-1 text-right ${
                          message.remetente === 'empresa' 
                            ? 'text-primary-foreground/80' 
                            : 'text-muted-foreground'
                        }`}>
                          {formatMessageTime(message.datahora)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Input to send message */}
                <div className="p-3 border-t">
                  <form 
                    className="flex gap-2" 
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage();
                    }}
                  >
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="resize-none min-h-[50px] flex-1"
                      rows={1}
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
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

export default Messages;
