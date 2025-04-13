
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  BellRing, 
  Globe, 
  Lock, 
  Save, 
  Settings as SettingsIcon, 
  ThumbsUp, 
  UserCog,
  Palette
} from "lucide-react";
import { toast } from "sonner";
import { useHandleContext } from "@/contexts/handleContext.tsx";
import { useTheme } from "@/hooks/use-theme";

const Configurations = () => {
  const { users } = useHandleContext();
  const { theme, setTheme, setCustomPrimaryColor } = useTheme();
  
  const [notificacoes, setNotificacoes] = useState({
    email: true,
    app: true,
    novosClientes: true,
    lembretesFesta: true,
    atualizacoesSistema: false
  });
  
  const [aparencia, setAparencia] = useState({
    temaEscuro: theme === "dark",
    corPrimaria: "#9b87f5",
    mostrarBadge: true
  });
  
  const [seguranca, setSeguranca] = useState({
    autenticacaoDoisFatores: false,
    tempoExpiracaoSessao: "30"
  });
  
  useEffect(() => {
    // Load color from localStorage if available
    const savedColor = localStorage.getItem('primaryColor');
    if (savedColor) {
      setAparencia(prev => ({ ...prev, corPrimaria: savedColor }));
    }
  }, []);
  
  const handleSave = (secao: string) => {
    if (secao === "aparência") {
      // Save theme preference
      setTheme(aparencia.temaEscuro ? "dark" : "light");
      
      // Save primary color preference and apply it
      localStorage.setItem('primaryColor', aparencia.corPrimaria);
      setCustomPrimaryColor(aparencia.corPrimaria);
    }
    
    toast.success(`Configurações de ${secao} salvas com sucesso!`);
  };
  
  // Handle theme toggle
  const handleThemeToggle = (checked: boolean) => {
    setAparencia({...aparencia, temaEscuro: checked});
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências do sistema</p>
      </div>
      
      <Tabs defaultValue="conta">
        <TabsList className="mb-6 w-full max-w-3xl">
          <TabsTrigger value="conta" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            <span>Conta</span>
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <BellRing className="h-4 w-4" />
            <span>Notificações</span> 
          </TabsTrigger>
          <TabsTrigger value="aparencia" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Segurança</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Tab Conta */}
        <TabsContent value="conta">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e preferências da conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" defaultValue={users?.nome || "Usuário"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={users?.email || "usuario@example.com"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" defaultValue={users?.telefone || "(00) 00000-0000"} />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label htmlFor="empresa">Nome da Empresa</Label>
                <Input id="empresa" defaultValue="Festa Decorações" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" defaultValue="Av. Principal, 123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" defaultValue="São Paulo" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("conta")} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Salvar alterações</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Tab Notificações */}
        <TabsContent value="notificacoes">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>
                Configure como e quando deseja receber notificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Canais de Notificação</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-email" className="font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">Receba notificações por email</p>
                  </div>
                  <Switch 
                    id="notify-email" 
                    checked={notificacoes.email} 
                    onCheckedChange={(checked) => setNotificacoes({...notificacoes, email: checked})} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-app" className="font-medium">Aplicativo</Label>
                    <p className="text-sm text-muted-foreground">Receba notificações no aplicativo</p>
                  </div>
                  <Switch 
                    id="notify-app" 
                    checked={notificacoes.app} 
                    onCheckedChange={(checked) => setNotificacoes({...notificacoes, app: checked})} 
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tipos de Notificações</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-clients" className="font-medium">Novos Clientes</Label>
                    <p className="text-sm text-muted-foreground">Seja notificado quando um novo cliente for cadastrado</p>
                  </div>
                  <Switch 
                    id="notify-clients" 
                    checked={notificacoes.novosClientes} 
                    onCheckedChange={(checked) => setNotificacoes({...notificacoes, novosClientes: checked})} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-events" className="font-medium">Lembretes de Festas</Label>
                    <p className="text-sm text-muted-foreground">Receba lembretes sobre festas agendadas</p>
                  </div>
                  <Switch 
                    id="notify-events" 
                    checked={notificacoes.lembretesFesta} 
                    onCheckedChange={(checked) => setNotificacoes({...notificacoes, lembretesFesta: checked})} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-updates" className="font-medium">Atualizações do Sistema</Label>
                    <p className="text-sm text-muted-foreground">Seja informado sobre atualizações e novidades do sistema</p>
                  </div>
                  <Switch 
                    id="notify-updates" 
                    checked={notificacoes.atualizacoesSistema} 
                    onCheckedChange={(checked) => setNotificacoes({...notificacoes, atualizacoesSistema: checked})} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("notificações")} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Salvar preferências</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Tab Aparência */}
        <TabsContent value="aparencia">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência do sistema conforme sua preferência
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="font-medium">Tema Escuro</Label>
                  <p className="text-sm text-muted-foreground">Ativar modo escuro para toda a interface</p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={aparencia.temaEscuro} 
                  onCheckedChange={handleThemeToggle} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primary-color" className="font-medium">Cor Primária</Label>
                <p className="text-sm text-muted-foreground">Escolha a cor principal do sistema</p>
                <div className="flex items-center gap-4">
                  <Input 
                    id="primary-color" 
                    type="color" 
                    value={aparencia.corPrimaria} 
                    onChange={(e) => setAparencia({...aparencia, corPrimaria: e.target.value})}
                    className="w-24 h-10 cursor-pointer" 
                  />
                  <span className="text-sm font-mono">{aparencia.corPrimaria}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-badge" className="font-medium">Mostrar Badge da Empresa</Label>
                  <p className="text-sm text-muted-foreground">Exibir o selo da empresa em relatórios e documentos</p>
                </div>
                <Switch 
                  id="show-badge" 
                  checked={aparencia.mostrarBadge} 
                  onCheckedChange={(checked) => setAparencia({...aparencia, mostrarBadge: checked})} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("aparência")} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Salvar preferências</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Tab Segurança */}
        <TabsContent value="seguranca">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Configure as opções de segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="2fa" className="font-medium">Autenticação de dois fatores</Label>
                  <p className="text-sm text-muted-foreground">Aumente a segurança da sua conta exigindo uma verificação adicional</p>
                </div>
                <Switch 
                  id="2fa" 
                  checked={seguranca.autenticacaoDoisFatores} 
                  onCheckedChange={(checked) => setSeguranca({...seguranca, autenticacaoDoisFatores: checked})} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="session-expiry" className="font-medium">Tempo de expiração da sessão</Label>
                <p className="text-sm text-muted-foreground">Defina quanto tempo sua sessão permanece ativa sem atividade</p>
                <div className="flex items-center gap-2">
                  <Input 
                    id="session-expiry" 
                    type="number" 
                    value={seguranca.tempoExpiracaoSessao} 
                    onChange={(e) => setSeguranca({...seguranca, tempoExpiracaoSessao: e.target.value})}
                    className="w-20" 
                    min="5"
                    max="120"
                  />
                  <span>minutos</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label className="font-medium">Alterar Senha</Label>
                <p className="text-sm text-muted-foreground">Atualize sua senha para manter sua conta segura</p>
                <div className="space-y-2 pt-2">
                  <Input id="current-password" type="password" placeholder="Senha atual" />
                </div>
                <div className="space-y-2 pt-2">
                  <Input id="new-password" type="password" placeholder="Nova senha" />
                </div>
                <div className="space-y-2 pt-2">
                  <Input id="confirm-password" type="password" placeholder="Confirmar nova senha" />
                </div>
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => toast.success("Senha alterada com sucesso!")}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Alterar senha</span>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("segurança")} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Salvar configurações</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configurations;
