
import React from 'react';
import { Check, MessageSquare, Facebook, Instagram, Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useHandleContext } from "@/contexts/handleContext";

interface MessageTypeFilterProps {
  selectedTypes: string[];
  onSelectType: (type: string) => void;
}

const MessageTypeFilter = ({ selectedTypes, onSelectType }: MessageTypeFilterProps) => {
  const { integrations } = useHandleContext();
  const enabledIntegrations = integrations.filter(i => i.enabled);
  
  const getIntegrationIcon = (name: string) => {
    switch (name) {
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrar por tipo
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Tipos de Mensagem</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {enabledIntegrations.length > 0 ? (
              enabledIntegrations.map(integration => (
                <DropdownMenuItem 
                  key={integration.id}
                  onClick={() => onSelectType(integration.name)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {getIntegrationIcon(integration.name)}
                    <span className="capitalize">{integration.name}</span>
                  </div>
                  {selectedTypes.includes(integration.name) && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>
                Nenhuma integração habilitada
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {selectedTypes.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTypes.map(type => (
            <Badge 
              key={type}
              variant="outline" 
              className="flex items-center gap-1 capitalize cursor-pointer"
              onClick={() => onSelectType(type)}
            >
              {getIntegrationIcon(type)}
              {type}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageTypeFilter;
