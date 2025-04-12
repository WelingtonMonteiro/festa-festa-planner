
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

interface LoginHeaderProps {
  onLoginClick: () => void;
}

const LoginHeader = ({ onLoginClick }: LoginHeaderProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

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
          <span className="text-2xl font-bold bg-gradient-to-r from-festa-primary via-festa-secondary to-festa-accent text-transparent bg-clip-text">
            FestaPlanner
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Recursos
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Planos
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Sobre nós
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Contato
          </a>
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

      {/* Modal de Login no Header */}
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
              <label htmlFor="header-email" className="text-sm font-medium">
                Email
              </label>
              <Input 
                id="header-email"
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
                <label htmlFor="header-password" className="text-sm font-medium">
                  Senha
                </label>
                <Button type="button" variant="link" className="p-0 h-auto text-xs">
                  Esqueceu a senha?
                </Button>
              </div>
              <Input 
                id="header-password"
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
                <Button variant="link" className="p-0 h-auto">
                  Entre em contato
                </Button>
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default LoginHeader;
