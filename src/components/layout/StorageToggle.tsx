
import { Button } from "@/components/ui/button";
import { useStorage } from "@/contexts/storageContext";
import { Database, HardDrive } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const StorageToggle = () => {
  const { storageType, setStorageType, isInitialized } = useStorage();
  
  if (!isInitialized) return null;
  
  return (
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
              <HardDrive className="h-4 w-4" />
            ) : (
              <Database className="h-4 w-4" />
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
  );
};

export default StorageToggle;
