
import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  disabledMessage?: string;
}

const MessageComposer = ({ onSend, disabled = false, disabledMessage }: MessageComposerProps) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };
  
  return (
    <div className="p-3 border-t">
      <form 
        className="flex gap-2" 
        onSubmit={handleSubmit}
      >
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="resize-none min-h-[50px] flex-1"
          rows={1}
        />
        <Button 
          type="submit" 
          disabled={!message.trim() || disabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
      
      {disabled && disabledMessage && (
        <p className="text-xs text-red-500 mt-1">
          {disabledMessage}
        </p>
      )}
    </div>
  );
};

export default MessageComposer;
