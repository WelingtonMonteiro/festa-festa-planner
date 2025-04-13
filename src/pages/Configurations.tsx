
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, User, Mail, Phone, Shield, Database, Globe, ServerCrash } from "lucide-react";
import { useHandleContext } from '@/contexts';
import { useApi } from '@/contexts/apiContext';
import { toast } from 'sonner';

// Componentes de configuração
const GeneralSettings = () => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Nome da Empresa</Label>
          <Input id="company" placeholder="Nome da sua empresa" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slogan">Slogan</Label>
          <Input id="slogan" placeholder="Slogan da empresa" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="logo">Logo</Label>
          <Input id="logo" type="file" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch id="notifications" />
          <Label htmlFor="notifications">Permitir Notificações</Label>
        </div>
      </div>
      
      <Button>Salvar Configurações</Button>
    </div>
  );
};

const UserSettings = () => {
  const { users } = useHandleContext();
  
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Nome de Usuário</Label>
          <Input id="username" placeholder="Nome de usuário" defaultValue={users && users[0] ? users[0].nome || '' : ''} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Email" defaultValue={users && users[0] ? users[0].email || '' : ''} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" placeholder="Telefone" defaultValue={users && users[0] ? users[0].telefone || '' : ''} />
        </div>
      </div>
      
      <Button>Atualizar Perfil</Button>
    </div>
  );
};

const SecuritySettings = () => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Senha Atual</Label>
          <Input id="current-password" type="password" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="new-password">Nova Senha</Label>
          <Input id="new-password" type="password" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmar Senha</Label>
          <Input id="confirm-password" type="password" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch id="2fa" />
          <Label htmlFor="2fa">Ativar Autenticação de Dois Fatores</Label>
        </div>
      </div>
      
      <Button>Atualizar Segurança</Button>
    </div>
  );
};

const StorageSettings = () => {
  const { apiType, setApiType, apiUrl, setApiUrl } = useApi();
  const [tempApiUrl, setTempApiUrl] = useState(apiUrl);
  
  const handleSaveApiSettings = () => {
    setApiUrl(tempApiUrl);
    toast.success("Configurações de API salvas com sucesso!");
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Tipo de Armazenamento</Label>
        <RadioGroup defaultValue={apiType} onValueChange={(value) => setApiType(value as any)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="local" id="local" />
            <Label htmlFor="local">Local Storage</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rest" id="rest" />
            <Label htmlFor="rest">API REST</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="supabase" id="supabase" />
            <Label htmlFor="supabase">Supabase</Label>
          </div>
        </RadioGroup>
      </div>
      
      {apiType === 'rest' && (
        <div className="space-y-2">
          <Label htmlFor="api-url">URL da API</Label>
          <Input 
            id="api-url" 
            placeholder="https://api.example.com" 
            value={tempApiUrl} 
            onChange={(e) => setTempApiUrl(e.target.value)}
          />
        </div>
      )}
      
      {apiType === 'supabase' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supabase-url">URL do Supabase</Label>
            <Input id="supabase-url" placeholder="https://your-project.supabase.co" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supabase-key">Chave API do Supabase</Label>
            <Input id="supabase-key" type="password" placeholder="sua-chave-secreta" />
          </div>
        </div>
      )}
      
      <Button onClick={handleSaveApiSettings}>Salvar Configurações</Button>
    </div>
  );
};

const Configurations = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" /> Geral
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center">
            <User className="mr-2 h-4 w-4" /> Usuário
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" /> Segurança
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center">
            <Database className="mr-2 h-4 w-4" /> Armazenamento
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Gerencie as configurações gerais da sua aplicação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GeneralSettings />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Usuário</CardTitle>
              <CardDescription>
                Gerencie suas informações de perfil.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserSettings />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Gerencie suas configurações de segurança.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SecuritySettings />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Armazenamento de Dados</CardTitle>
              <CardDescription>
                Configure onde seus dados serão armazenados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StorageSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configurations;
