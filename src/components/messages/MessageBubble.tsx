
import { format } from "date-fns";
import { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const formatMessageTime = (date: string) => {
    return format(new Date(date), "HH:mm");
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
        <p className={`text-xs mt-1 text-right ${
          message.remetente === 'empresa' 
            ? 'text-primary-foreground/80' 
            : 'text-muted-foreground'
        }`}>
          {formatMessageTime(message.datahora)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
