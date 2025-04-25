
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/contexts/apiContext";
import { toast } from "sonner";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { apiUrl } = useApi();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartNow = async () => {
    if (!contactName || !contactEmail) {
      toast.error("Por favor, preencha nome e email para continuar");
      return;
    }

    setIsLoading(true);

    try {
      // Usando a rota /register diretamente que já está implementada no backend
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: contactName,
          email: contactEmail,
          password: Math.random().toString(36).slice(-8), // Senha temporária aleatória
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Cadastro realizado com sucesso! Verifique seu email para acessar sua conta.');
        setContactName('');
        setContactEmail('');
        navigate('/login');
      } else {
        throw new Error(data.error || 'Erro ao realizar cadastro');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao realizar cadastro. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-festa-primary/10 via-background to-festa-secondary/10 py-20">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Simplifique seu <span className="bg-gradient-to-r from-festa-primary via-festa-secondary to-festa-accent text-transparent bg-clip-text">Negócio de Eventos</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A plataforma completa para organizadores de eventos gerenciarem clientes, eventos, inventário e finanças em um só lugar.
          </p>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <Input
                placeholder="Seu nome"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="flex-1"
              />
              <Input
                type="email"
                placeholder="Seu email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={handleStartNow}
                disabled={isLoading}
              >
                {isLoading ? 'Cadastrando...' : 'Começar Agora'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Saiba Mais
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 relative min-h-[400px] w-full rounded-lg overflow-hidden shadow-xl border">
          <img 
            src="/placeholder.svg" 
            alt="Prévia do Dashboard" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
            <div className="p-4 text-white">
              <p className="text-sm font-medium">Visão Geral do Dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
