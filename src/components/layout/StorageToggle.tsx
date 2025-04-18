
import { Button } from "@/components/ui/button";
import { useStorage } from "@/contexts/storageContext";
import { useApi } from "@/contexts/apiContext";
import { Database, HardDrive, Server } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const StorageToggle = () => {
  const { storageType, setStorageType, isInitialized } = useStorage();
  const { apiType, apiUrl } = useApi();
  
  if (!isInitialized) return null;
  
  const currentStorageType = apiType === 'rest' ? 'apiRest' : storageType;
  
  const toggleStorage = () => {
    // Só permite alternar entre localStorage e supabase
    // Para API REST, precisa ir nas configurações de admin
    if (apiType === 'rest') {
      return; // Não permite alternar se está usando API
    }
    
    setStorageType(storageType === 'localStorage' ? 'supabase' : 'localStorage');
  };
  
  const getIcon = () => {
    switch (currentStorageType) {
      case 'localStorage':
        return <HardDrive className="h-4 w-4" />;
      case 'supabase':
        return <Database className="h-4 w-4" />;
      case 'apiRest':
        return <Server className="h-4 w-4" />;
    }
  };
  
  const getLabel = () => {
    switch (currentStorageType) {
      case 'localStorage':
        return 'Local';
      case 'supabase':
        return 'Supabase';
      case 'apiRest':
        return 'API REST';
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Badge variant={apiType === 'rest' ? 'default' : (storageType === 'supabase' ? 'default' : 'outline')} className="px-2 py-1">
        {getLabel()}
      </Badge>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleStorage}
              className="h-8 w-8"
              disabled={apiType === 'rest'}
            >
              {getIcon()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {apiType === 'rest' ? (
              <p>Usando API REST. Configure nas Configurações de Admin.</p>
            ) : (
              <p>
                {storageType === 'localStorage' 
                  ? 'Usando localStorage (Clique para usar Supabase)' 
                  : 'Usando Supabase (Clique para usar localStorage)'}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default StorageToggle;
