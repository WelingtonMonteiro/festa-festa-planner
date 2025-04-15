
import { useState, useEffect } from 'react';
import { useHandleContext } from "@/contexts/handleContext";
import { Link, useNavigate } from "react-router-dom";
import { Link2, Phone, Instagram, Facebook, MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import WhatsAppQRCode from "@/components/messages/WhatsAppQRCode";
import { whatsappApiService } from '@/services/apiServices/whatsappApiService';
import ContractMessageSender from "@/components/contracts/ContractMessageSender";
import MessageTypeFilter from "@/components/messages/MessageTypeFilter";

// Componentes refatorados
import ClientConversationItem from '@/components/messages/ClientConversationItem';
import MessageBubble from '@/components/messages/MessageBubble';
import ConversationHeader from '@/components/messages/ConversationHeader';
import MessageComposer from '@/components/messages/MessageComposer';

const Messages = () => {
  const { 
    messages = [], 
    clients = [], 
    addMessage, 
    markMessageAsRead, 
    apiUrl,
    integrations = [],
    getEnabledIntegrations
  } = useHandleContext();
  
  const navigate = useNavigate();
  const enabledIntegrations = getEnabledIntegrations ? getEnabledIntegrations() : [];
  
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
  
  const toggleMessageType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };
  
  // Filtrar clientes com base nas integrações selecionadas
  const clientsWithMessages = clients.filter(client => 
    messages.some(m => {
      const matchesClient = m.clienteId === client?.id;
      const matchesType = selectedTypes.length === 0 || 
        selectedTypes.some(type => m.platform === type);
      return matchesClient && matchesType;
    })
  );
  
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client && client.nome ? client.nome : 'Cliente';
  };
  
  const getPlatformFromMessage = (message: any) => {
    // Se a mensagem já tem plataforma definida, use-a
    if (message && message.platform) return message.platform;
    
    // Caso contrário, assumimos que é WhatsApp por padrão
    return 'whatsapp';
  };
  
  const filteredMessages = selectedClient 
    ? messages
        .filter(m => {
          const matchesClient = m.clienteId === selectedClient;
          const matchesType = selectedTypes.length === 0 || 
            selectedTypes.some(type => getPlatformFromMessage(m) === type);
          return matchesClient && matchesType;
        })
        .sort((a, b) => new Date(a.datahora).getTime() - new Date(b.datahora).getTime())
    : [];
    
  // Marcar mensagens como lidas quando selecionar um cliente
  useEffect(() => {
    if (selectedClient && markMessageAsRead) {
      filteredMessages
        .filter(m => !m.lida && m.remetente === 'cliente')
        .forEach(m => markMessageAsRead(m.id));
    }
  }, [selectedClient, filteredMessages, markMessageAsRead]);
  
  // Verificar conexão do WhatsApp
  useEffect(() => {
    const hasWhatsappIntegration = enabledIntegrations.some(i => i.name === 'whatsapp');
    if (hasWhatsappIntegration && apiUrl) {
      checkWhatsAppConnection();
    }
  }, [enabledIntegrations, apiUrl]);
  
  const checkWhatsAppConnection = async () => {
    if (apiUrl) {
      try {
        const connected = await whatsappApiService.checkConnection(apiUrl);
        setIsWhatsAppConnected(connected);
      } catch (error) {
        console.error('Failed to check WhatsApp connection:', error);
        setIsWhatsAppConnected(false);
      }
    }
  };
  
  // Enviar mensagem
  const sendMessage = async (messageContent: string) => {
    if (!selectedClient || !addMessage) return;
    
    const whatsappEnabled = enabledIntegrations.find(i => i.name === 'whatsapp');
    
    if (whatsappEnabled && apiUrl) {
      const client = clients.find(c => c.id === selectedClient);
      if (client && client.telefone) {
        try {
          const phoneNumber = client.telefone.replace(/\D/g, ''); // Remove todos os caracteres que não são números
          const sent = await whatsappApiService.sendMessage(apiUrl, phoneNumber, messageContent);
          
          if (sent) {
            addMessage({
              remetente: 'empresa',
              clienteId: selectedClient,
              conteudo: messageContent,
              lida: true,
              platform: 'whatsapp'
            });
          }
        } catch (error) {
          toast.error("Erro ao enviar mensagem");
          console.error("Error sending message:", error);
        }
      } else {
        toast.error("Cliente não possui número de telefone cadastrado");
      }
    } else {
      // Se não temos WhatsApp habilitado, usamos a primeira integração disponível
      const platform = enabledIntegrations.length > 0 ? enabledIntegrations[0].name : 'whatsapp';
      
      addMessage({
        remetente: 'empresa',
        clienteId: selectedClient,
        conteudo: messageContent,
        lida: true,
        platform
      });
      toast.success("Mensagem enviada com sucesso!");
    }
  };
  
  const navigateToConfigurations = () => {
    navigate('/configurations');
  };

  // Se não há integrações habilitadas, mostramos um alerta
  if (!enabledIntegrations || enabledIntegrations.length === 0) {
    return (
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Mensagens</h1>
          <p className="text-muted-foreground">
            Gerencie suas conversas com clientes em diferentes plataformas
          </p>
        </div>
        
        <Alert className="mb-6">
          <AlertDescription className="flex flex-col gap-4">
            <div>
              Nenhuma integração está habilitada no momento. Para utilizar o sistema de mensagens, 
              você precisa habilitar pelo menos uma integração.
            </div>
            <Button 
              variant="outline" 
              onClick={navigateToConfigurations} 
              className="w-fit flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configurar Integrações
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mensagens</h1>
        <p className="text-muted-foreground">
          Gerencie suas conversas com clientes em diferentes plataformas
        </p>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <MessageTypeFilter 
          selectedTypes={selectedTypes}
          onSelectType={toggleMessageType}
        />
        
        <div className="flex gap-2">
          {enabledIntegrations.find(i => i.name === 'whatsapp') && apiUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsQRCodeModalOpen(true)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
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
                if (!client) return null;
                
                const lastMessage = [...messages]
                  .filter(m => {
                    const matchesClient = m.clienteId === client.id;
                    const matchesType = selectedTypes.length === 0 || 
                      selectedTypes.some(type => getPlatformFromMessage(m) === type);
                    return matchesClient && matchesType;
                  })
                  .sort((a, b) => 
                    new Date(b.datahora).getTime() - new Date(a.datahora).getTime()
                  )[0];
                
                const unreadMessages = messages.filter(m => {
                  const matchesClient = m.clienteId === client.id;
                  const matchesType = selectedTypes.length === 0 || 
                    selectedTypes.some(type => getPlatformFromMessage(m) === type);
                  return matchesClient && !m.lida && m.remetente === 'cliente' && matchesType;
                }).length;
                
                if (!lastMessage) return null;
                
                return (
                  <ClientConversationItem
                    key={client.id}
                    client={client}
                    lastMessage={lastMessage}
                    platform={getPlatformFromMessage(lastMessage)}
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
              {filteredMessages.length > 0 && (
                <ConversationHeader 
                  clientName={getClientName(selectedClient)} 
                  platform={getPlatformFromMessage(filteredMessages[0])} 
                />
              )}
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {filteredMessages.map(message => (
                  <MessageBubble 
                    key={message.id} 
                    message={{...message, platform: getPlatformFromMessage(message)}} 
                  />
                ))}
              </div>
              
              <MessageComposer 
                onSend={sendMessage}
                disabled={
                  (enabledIntegrations.find(i => i.name === 'whatsapp') && !isWhatsAppConnected) ||
                  enabledIntegrations.length === 0
                }
                disabledMessage={
                  enabledIntegrations.find(i => i.name === 'whatsapp') && !isWhatsAppConnected ? 
                  "É necessário conectar o WhatsApp para enviar mensagens." : 
                  "Nenhuma integração habilitada."
                }
              />
            </>
          )}
        </div>
      </div>
      
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
