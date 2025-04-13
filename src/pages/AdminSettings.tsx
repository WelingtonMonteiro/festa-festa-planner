
import { useEffect, useState } from "react";
import { useStorage } from "@/contexts/storageContext";
import { Database, HardDrive } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const AdminSettings = () => {
  const { storageType } = useStorage();
  const [selectedStorage, setSelectedStorage] = useState<'localStorage' | 'supabase'>(storageType);
  
  // Atualizar o estado quando o tipo de armazenamento mudar no contexto
  useEffect(() => {
    setSelectedStorage(storageType);
  }, [storageType]);
  
  const handleStorageChange = (value: 'localStorage' | 'supabase') => {
    setSelectedStorage(value);
    localStorage.setItem('adminStoragePreference', value);
    toast.success(`Configuração de armazenamento padrão alterada para ${value === 'localStorage' ? 'Armazenamento Local' : 'Supabase'}`);
    toast.info(`As alterações terão efeito após recarregar a página`, {
      duration: 5000,
      action: {
        label: "Recarregar agora",
        onClick: () => window.location.reload(),
      },
    });
  };
  
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">Configurações de Administrador</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Armazenamento</CardTitle>
          <CardDescription>
            Define o tipo de armazenamento padrão para todo o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RadioGroup 
              value={selectedStorage} 
              onValueChange={(value) => handleStorageChange(value as 'localStorage' | 'supabase')}
              className="gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="localStorage" id="local-storage" />
                <Label htmlFor="local-storage" className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4" /> 
                  Armazenamento Local (localStorage)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="supabase" id="supabase-storage" />
                <Label htmlFor="supabase-storage" className="flex items-center gap-2">
                  <Database className="h-4 w-4" /> 
                  Supabase (Banco de dados na nuvem)
                </Label>
              </div>
            </RadioGroup>
            
            <div className="pt-4 border-t mt-4">
              <p className="text-sm text-muted-foreground">
                A configuração atual é: <span className="font-semibold">{storageType === 'localStorage' ? 'Armazenamento Local' : 'Supabase'}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Ao alterar o tipo de armazenamento padrão, todos os usuários usarão o tipo selecionado assim que recarregarem a página.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
