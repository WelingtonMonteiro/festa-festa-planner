
import { format } from "date-fns";
import { Message } from "@/types";
import { MessageSquare, Facebook, Instagram } from "lucide-react";

interface MessageBubbleProps {
  message: Message & { platform?: string };
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const formatMessageTime = (date: string) => {
    return format(new Date(date), "HH:mm");
  };

  const getPlatformIcon = (platform: string = 'whatsapp') => {
    switch(platform) {
      case 'whatsapp':
        return <MessageSquare className="h-3 w-3" />;
      case 'facebook':
        return <Facebook className="h-3 w-3" />;
      case 'instagram':
        return <Instagram className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  return (
    <div
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
        <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
          message.remetente === 'empresa' 
            ? 'text-primary-foreground/80' 
            : 'text-muted-foreground'
        }`}>
          {getPlatformIcon(message.platform)}
          <span>{formatMessageTime(message.datahora)}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
