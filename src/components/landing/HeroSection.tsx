
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
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
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => document.dispatchEvent(new CustomEvent('openLoginModal'))}
            >
              Começar Agora
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
