
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Instagram, Facebook, MessageCircle } from "lucide-react";

interface ConversationHeaderProps {
  clientName: string;
  platform: 'whatsapp' | 'instagram' | 'facebook';
}

const ConversationHeader = ({ clientName, platform }: ConversationHeaderProps) => {
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
    <div className="p-3 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>
            {clientName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="font-medium">{clientName}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {getPlatformIcon(platform)} <span>{platform}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationHeader;
