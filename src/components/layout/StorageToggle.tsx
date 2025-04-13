
import { Button } from "@/components/ui/button";
import { useStorage } from "@/contexts/storageContext";
import { Database, HardDrive } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const StorageToggle = () => {
  const { storageType, setStorageType, isInitialized } = useStorage();
  
  if (!isInitialized) return null;
  
  return (
    <div className="flex items-center gap-2">
      <Badge variant={storageType === 'supabase' ? 'default' : 'outline'} className="px-2 py-1">
        {storageType === 'localStorage' ? 'Local' : 'Supabase'}
      </Badge>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setStorageType(storageType === 'localStorage' ? 'supabase' : 'localStorage')}
              className="h-8 w-8"
            >
              {storageType === 'localStorage' ? (
                <Database className="h-4 w-4" />
              ) : (
                <HardDrive className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {storageType === 'localStorage' 
                ? 'Usando localStorage (Clique para usar Supabase)' 
                : 'Usando Supabase (Clique para usar localStorage)'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default StorageToggle;
