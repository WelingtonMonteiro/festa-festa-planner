
import { useEffect, useState } from "react";
import { useStorage } from "@/contexts/storageContext";
import { useApi } from "@/contexts/apiContext";
import { Database, HardDrive, Link, Server } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminSettings = () => {
  // Configurações de armazenamento
  const { storageType } = useStorage();
  const [selectedStorage, setSelectedStorage] = useState<'localStorage' | 'supabase'>(storageType);
  
  // Configurações de API
  const { apiType, apiUrl, setApiType, setApiUrl } = useApi();
  const [selectedApiType, setSelectedApiType] = useState<'local' | 'rest'>(apiType);
  const [apiUrlInput, setApiUrlInput] = useState<string>(apiUrl);
  
  // Atualizar estados quando os valores dos contextos mudarem
  useEffect(() => {
    setSelectedStorage(storageType);
  }, [storageType]);
  
  useEffect(() => {
    setSelectedApiType(apiType);
    setApiUrlInput(apiUrl);
  }, [apiType, apiUrl]);
  
  // Manipuladores de eventos
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
  
  const handleApiTypeChange = (value: 'local' | 'rest') => {
    setSelectedApiType(value);
    setApiType(value);
  };
  
  const handleApiUrlSave = () => {
    if (!apiUrlInput.trim()) {
      toast.error("A URL da API não pode estar vazia");
      return;
    }
    
    try {
      // Validação básica de URL
      new URL(apiUrlInput);
      setApiUrl(apiUrlInput);
    } catch (e) {
      toast.error("URL inválida. Por favor, forneça uma URL completa (ex: https://api.exemplo.com)");
    }
  };
  
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">Configurações de Administrador</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Sistema</CardTitle>
          <CardDescription>
            Configure as preferências de armazenamento e acesso à API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Seção de Configurações de Armazenamento */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Armazenamento Padrão</h2>
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
                
                <div className="text-sm text-muted-foreground">
                  A configuração atual é: <span className="font-semibold">{storageType === 'localStorage' ? 'Armazenamento Local' : 'Supabase'}</span>
                </div>
              </div>
            </div>
            
            {/* Separador */}
            <div className="border-t border-border" />
            
            {/* Seção de Configurações de API */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Acesso à API</h2>
              <div className="space-y-4">
                <RadioGroup 
                  value={selectedApiType} 
                  onValueChange={(value) => handleApiTypeChange(value as 'local' | 'rest')}
                  className="gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="local" id="local-api" />
                    <Label htmlFor="local-api" className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4" /> 
                      Acesso Local (localStorage/Supabase)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rest" id="rest-api" />
                    <Label htmlFor="rest-api" className="flex items-center gap-2">
                      <Server className="h-4 w-4" /> 
                      API REST
                    </Label>
                  </div>
                </RadioGroup>
                
                {selectedApiType === 'rest' && (
                  <div className="mt-4 space-y-3">
                    <Label htmlFor="api-url">URL da API</Label>
                    <div className="flex space-x-2">
                      <Input 
                        id="api-url" 
                        placeholder="https://api.exemplo.com" 
                        value={apiUrlInput}
                        onChange={(e) => setApiUrlInput(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleApiUrlSave} type="button">
                        Salvar
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Insira a URL base da API REST que será usada para chamadas.
                    </p>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground">
                  A configuração atual é: <span className="font-semibold">
                    {apiType === 'local' ? 'Acesso Local' : 'API REST'}
                  </span>
                </div>
                {apiType === 'rest' && apiUrl && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Link className="h-3 w-3" />
                    URL: <span className="font-mono text-xs">{apiUrl}</span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mt-4 border-t border-border pt-4">
              <p>
                Estas configurações definem como o sistema armazena e acessa os dados.
              </p>
              <p className="mt-2">
                No modo de acesso local, os dados são acessados diretamente via localStorage ou Supabase. 
                No modo API REST, os dados são acessados via chamadas HTTP para a API configurada.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
