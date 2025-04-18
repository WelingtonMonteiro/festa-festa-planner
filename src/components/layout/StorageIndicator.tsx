
import React from 'react';
import { useStorage } from '@/contexts/storageContext';
import { useApi } from '@/contexts/apiContext';
import { Database, HardDrive, Server } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

export const StorageIndicator = () => {
  const { storageType } = useStorage();
  const { apiType, apiUrl } = useApi();

  const currentStorageType = apiType === 'rest' ? 'apiRest' : storageType;
  
  const getIcon = () => {
    switch (currentStorageType) {
      case 'localStorage':
        return <HardDrive className="h-4 w-4 mr-1" />;
      case 'supabase':
        return <Database className="h-4 w-4 mr-1" />;
      case 'apiRest':
        return <Server className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (currentStorageType) {
      case 'localStorage':
        return 'Local Storage';
      case 'supabase':
        return 'Supabase';
      case 'apiRest':
        return 'API REST';
      default:
        return 'Desconhecido';
    }
  };

  const getDetails = () => {
    const base = `Modo de dados: ${getLabel()}`;
    if (currentStorageType === 'apiRest' && apiUrl) {
      return `${base}\nURL: ${apiUrl}`;
    }
    return base;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="flex items-center">
            {getIcon()}
            <span className="text-xs">{getLabel()}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="whitespace-pre-line">
            {getDetails()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StorageIndicator;
