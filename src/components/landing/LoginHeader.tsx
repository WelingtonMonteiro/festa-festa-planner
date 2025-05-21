import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Phone, Info } from 'lucide-react';
import FestanaLogo from "@/components/common/FestanaLogo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { RegisterModal } from "@/components/auth/RegisterModal";
import { ForgotPasswordModal } from "@/components/auth/ForgotPasswordModal";

interface LoginHeaderProps {
  onLoginClick: () => void;
}

const LoginHeader = ({ onLoginClick }: LoginHeaderProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would validate credentials
    navigate('/dashboard');
    setLoginModalOpen(false);
  };

  return (
    <header className="w-full py-4 px-6 bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <FestanaLogo size="md" />
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Recursos</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="#features"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Gestão Simplificada
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Organize eventos, clientes e fornecedores em uma única plataforma integrada
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <a href="#features" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Calendário</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Visualize e organize seus eventos com facilidade
                        </p>
                      </a>
                    </li>
                    <li>
                      <a href="#features" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Gestão de Clientes</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Cadastre e acompanhe informações importantes
                        </p>
                      </a>
                    </li>
                    <li>
                      <a href="#features" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Mensagens</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Comunique-se diretamente com seus clientes
                        </p>
                      </a>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
                  Planos
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Sobre nós</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="#about"
                        >
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            <span className="text-sm font-medium leading-none">Nossa História</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Conheça a história da Festana e nossa missão
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="#team"
                        >
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            <span className="text-sm font-medium leading-none">Nosso Time</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Conheça os profissionais por trás da plataforma
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Contato</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="#contact"
                        >
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="text-sm font-medium leading-none">E-mail</span>
                          </div>
                          <p className="text-sm leading-snug text-muted-foreground">
                            contato@festana.com.br
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="#contact"
                        >
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span className="text-sm font-medium leading-none">Telefone</span>
                          </div>
                          <p className="text-sm leading-snug text-muted-foreground">
                            (11) 9999-8888
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost"
            onClick={() => setLoginModalOpen(true)}
            className="hidden md:flex items-center gap-2"
          >
            <span>Entrar</span>
          </Button>
          <Button 
            onClick={onLoginClick}
            className="flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden md:inline">Começar Agora</span>
            <span className="md:hidden">Entrar</span>
          </Button>
        </div>
      </div>

      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Entrar na sua conta</DialogTitle>
            <DialogDescription>
              Digite suas credenciais para acessar o sistema de planejamento de eventos
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="nome@exemplo.com"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <Button 
                  type="button" 
                  variant="link" 
                  className="p-0 h-auto text-xs"
                  onClick={() => {
                    setLoginModalOpen(false);
                    setForgotPasswordModalOpen(true);
                  }}
                >
                  Esqueceu a senha?
                </Button>
              </div>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">Entrar</Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto"
                  onClick={() => {
                    setLoginModalOpen(false);
                    setRegisterModalOpen(true);
                  }}
                >
                  Criar sua conta
                </Button>
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <RegisterModal 
        open={registerModalOpen} 
        onOpenChange={setRegisterModalOpen} 
      />

      <ForgotPasswordModal 
        open={forgotPasswordModalOpen} 
        onOpenChange={setForgotPasswordModalOpen} 
      />
    </header>
  );
};

export default LoginHeader;
