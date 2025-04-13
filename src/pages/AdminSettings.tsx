
import { useEffect, useState } from "react";
import { useStorage } from "@/contexts/storageContext";
import { useApi } from "@/contexts/apiContext";
import { Database, HardDrive, Link, Server } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AdminSettings = () => {
  // Tipo de armazenamento/acesso
  const { storageType, setStorageType } = useStorage();
  const { apiType, apiUrl, setApiType, setApiUrl } = useApi();
  
  // Estado unificado de armazenamento/acesso
  const [selectedDataSource, setSelectedDataSource] = useState<'localStorage' | 'supabase' | 'rest'>(
    apiType === 'rest' ? 'rest' : storageType
  );
  
  // Estado para URL da API
  const [apiUrlInput, setApiUrlInput] = useState<string>(apiUrl);
  
  // Atualizar estados quando os valores dos contextos mudarem
  useEffect(() => {
    if (apiType === 'rest') {
      setSelectedDataSource('rest');
    } else {
      setSelectedDataSource(storageType);
    }
    setApiUrlInput(apiUrl);
  }, [apiType, apiUrl, storageType]);
  
  // Manipuladores de eventos
  const handleDataSourceChange = (value: 'localStorage' | 'supabase' | 'rest') => {
    setSelectedDataSource(value);
    
    if (value === 'rest') {
      // Se selecionar REST API, configura API REST
      setApiType('rest');
      // Mantém o tipo de armazenamento atual para possíveis operações locais
      localStorage.setItem('adminApiPreference', 'rest');
    } else {
      // Se selecionar localStorage ou supabase, configura para acesso local
      setApiType('local');
      setStorageType(value);
      localStorage.setItem('adminStoragePreference', value);
      localStorage.setItem('adminApiPreference', 'local');
    }
    
    toast.success(`Configuração de dados alterada para ${
      value === 'localStorage' ? 'Armazenamento Local' : 
      value === 'supabase' ? 'Supabase' : 'API REST'
    }`);
    
    if (value !== 'rest') {
      toast.info(`As alterações terão efeito após recarregar a página`, {
        duration: 5000,
        action: {
          label: "Recarregar agora",
          onClick: () => window.location.reload(),
        },
      });
    }
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
      toast.success("URL da API atualizada com sucesso");
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
            {/* Seção Unificada de Configurações de Dados */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Fonte de Dados Padrão</h2>
              <div className="space-y-4">
                <RadioGroup 
                  value={selectedDataSource} 
                  onValueChange={(value) => handleDataSourceChange(value as 'localStorage' | 'supabase' | 'rest')}
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rest" id="rest-api" />
                    <Label htmlFor="rest-api" className="flex items-center gap-2">
                      <Server className="h-4 w-4" /> 
                      API REST
                    </Label>
                  </div>
                </RadioGroup>
                
                {selectedDataSource === 'rest' && (
                  <div className="mt-4 pl-6 space-y-3">
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
                    {selectedDataSource === 'localStorage' ? 'Armazenamento Local' : 
                     selectedDataSource === 'supabase' ? 'Supabase' : 'API REST'}
                  </span>
                </div>
                
                {selectedDataSource === 'rest' && apiUrl && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Link className="h-3 w-3" />
                    URL: <span className="font-mono text-xs">{apiUrl}</span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mt-4 border-t border-border pt-4">
              <p>
                Esta configuração define como o sistema armazena e acessa os dados.
              </p>
              <p className="mt-2">
                No modo <strong>Armazenamento Local</strong>, os dados são armazenados no navegador.
              </p>
              <p className="mt-2">
                No modo <strong>Supabase</strong>, os dados são armazenados no banco de dados na nuvem.
              </p>
              <p className="mt-2">
                No modo <strong>API REST</strong>, os dados são acessados via chamadas HTTP para a API configurada.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
