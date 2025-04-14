
import { useState, useEffect } from 'react';
import { useHandleContext } from "@/contexts/handleContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Link2, Phone, Instagram, Facebook, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import WhatsAppQRCode from "@/components/messages/WhatsAppQRCode";
import { whatsappApiService } from '@/services/apiServices/whatsappApiService';
import ContractMessageSender from "@/components/contracts/ContractMessageSender";

// Componentes refatorados
import ClientConversationItem from '@/components/messages/ClientConversationItem';
import MessageBubble from '@/components/messages/MessageBubble';
import ConversationHeader from '@/components/messages/ConversationHeader';
import MessageComposer from '@/components/messages/MessageComposer';

const Messages = () => {
  const { 
    messages, 
    clients, 
    addMessage, 
    markMessageAsRead, 
    apiUrl 
  } = useHandleContext();
  
  const [platform, setPlatform] = useState<'whatsapp' | 'instagram' | 'facebook'>('whatsapp');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
  
  const clientsWithMessages = clients.filter(client => 
    messages.some(m => m.clienteId === client.id)
  );
  
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.nome : 'Client';
  };
  
  const filteredMessages = selectedClient 
    ? messages
        .filter(m => m.clienteId === selectedClient)
        .sort((a, b) => new Date(a.datahora).getTime() - new Date(b.datahora).getTime())
    : [];
    
  // Marcar mensagens como lidas quando selecionar um cliente
  useEffect(() => {
    if (selectedClient) {
      filteredMessages
        .filter(m => !m.lida && m.remetente === 'cliente')
        .forEach(m => markMessageAsRead(m.id));
    }
  }, [selectedClient, filteredMessages, markMessageAsRead]);
  
  // Verificar conexão do WhatsApp
  useEffect(() => {
    checkWhatsAppConnection();
  }, [platform, apiUrl]);
  
  const checkWhatsAppConnection = async () => {
    if (platform === 'whatsapp' && apiUrl) {
      const connected = await whatsappApiService.checkConnection(apiUrl);
      setIsWhatsAppConnected(connected);
    }
  };
  
  // Enviar mensagem
  const sendMessage = async (messageContent: string) => {
    if (!selectedClient) return;
    
    if (platform === 'whatsapp' && apiUrl) {
      const client = clients.find(c => c.id === selectedClient);
      if (client && client.telefone) {
        const phoneNumber = client.telefone.replace(/\D/g, ''); // Remove todos os caracteres que não são números
        const sent = await whatsappApiService.sendMessage(apiUrl, phoneNumber, messageContent);
        
        if (sent) {
          addMessage({
            remetente: 'empresa',
            clienteId: selectedClient,
            conteudo: messageContent,
            lida: true
          });
        }
      } else {
        toast.error("Cliente não possui número de telefone cadastrado");
      }
    } else {
      addMessage({
        remetente: 'empresa',
        clienteId: selectedClient,
        conteudo: messageContent,
        lida: true
      });
      toast.success("Mensagem enviada com sucesso!");
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
          
          <div className="flex gap-2">
            {platform === 'whatsapp' && apiUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsQRCodeModalOpen(true)}
                className="flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                {isWhatsAppConnected ? 'WhatsApp Conectado' : 'Conectar WhatsApp'}
              </Button>
            )}
            
            {selectedClient && (
              <div className="flex gap-2">
                <ContractMessageSender clientId={selectedClient} />
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contracts">
                    <Link2 className="h-4 w-4 mr-1" />
                    Contratos
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-240px)]">
          {/* Lista de conversas */}
          <div className="col-span-4 bg-secondary/10 rounded-lg overflow-y-auto h-full">
            <div className="p-3 border-b">
              <h3 className="font-medium">Conversas</h3>
            </div>
            
            {clientsWithMessages.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Nenhuma conversa encontrada
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
                    <ClientConversationItem
                      key={client.id}
                      client={client}
                      lastMessage={lastMessage}
                      unreadCount={unreadMessages}
                      isSelected={selectedClient === client.id}
                      onClick={() => setSelectedClient(client.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Área de conversa */}
          <div className="col-span-8 bg-card border rounded-lg flex flex-col h-full">
            {!selectedClient ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Selecione um cliente para iniciar uma conversa
              </div>
            ) : (
              <>
                <ConversationHeader 
                  clientName={getClientName(selectedClient)} 
                  platform={platform} 
                />
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {filteredMessages.map(message => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </div>
                
                <MessageComposer 
                  onSend={sendMessage}
                  disabled={platform === 'whatsapp' && !isWhatsAppConnected}
                  disabledMessage={platform === 'whatsapp' && !isWhatsAppConnected ? 
                    "É necessário conectar o WhatsApp para enviar mensagens." : 
                    undefined}
                />
              </>
            )}
          </div>
        </div>
      </Tabs>
      
      <WhatsAppQRCode 
        isOpen={isQRCodeModalOpen} 
        onClose={() => {
          setIsQRCodeModalOpen(false);
          checkWhatsAppConnection();
        }} 
      />
    </div>
  );
};

export default Messages;
