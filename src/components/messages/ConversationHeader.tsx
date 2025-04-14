
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Instagram, Facebook, Phone } from "lucide-react";

interface ConversationHeaderProps {
  clientName: string;
  platform: string;
}

const ConversationHeader = ({ clientName, platform }: ConversationHeaderProps) => {
  const getPlatformIcon = (platform: string) => {
    switch(platform.toLowerCase()) {
      case 'whatsapp':
        return <Phone className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const platformIcon = getPlatformIcon(platform);

  return (
    <div className="p-3 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="" alt={clientName} />
          <AvatarFallback>
            {clientName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="font-medium">{clientName}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {platformIcon} <span className="capitalize">{platform}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationHeader;
