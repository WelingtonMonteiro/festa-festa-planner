
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Client, Message } from "@/types";
import { MessageSquare, Instagram, Facebook } from "lucide-react";

interface ClientConversationItemProps {
  client: Client;
  lastMessage: Message & { platform?: string };
  platform: string;
  unreadCount: number;
  isSelected: boolean;
  onClick: () => void;
}

const ClientConversationItem = ({
  client,
  lastMessage,
  platform,
  unreadCount,
  isSelected,
  onClick
}: ClientConversationItemProps) => {
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div 
      className={`p-3 hover:bg-accent/20 cursor-pointer ${
        isSelected ? 'bg-accent/30' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarFallback>
            {client.nome.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1">
              <h4 className="font-medium truncate">{client.nome}</h4>
              {getPlatformIcon(platform)}
            </div>
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
            
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientConversationItem;
