
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export const ScreenshotsCarousel = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Veja Nossa Plataforma em Ação</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Confira algumas das principais características e interfaces do nosso sistema de planejamento de eventos.
          </p>
        </div>
        
        <Carousel className="max-w-5xl mx-auto">
          <CarouselContent>
            <CarouselItem>
              <div className="p-1">
                <div className="overflow-hidden rounded-xl border shadow-lg">
                  <img src="/placeholder.svg" alt="Visualização de Calendário" className="w-full aspect-video object-cover" />
                  <div className="p-4 bg-card">
                    <h3 className="font-medium text-lg">Gerenciamento de Calendário</h3>
                    <p className="text-muted-foreground">Visualize e gerencie todos os seus eventos em uma interface intuitiva de calendário.</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-1">
                <div className="overflow-hidden rounded-xl border shadow-lg">
                  <img src="/placeholder.svg" alt="Dashboard de Clientes" className="w-full aspect-video object-cover" />
                  <div className="p-4 bg-card">
                    <h3 className="font-medium text-lg">Dashboard de Clientes</h3>
                    <p className="text-muted-foreground">Acompanhe todas as informações dos clientes, preferências e histórico.</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-1">
                <div className="overflow-hidden rounded-xl border shadow-lg">
                  <img src="/placeholder.svg" alt="Seleção de Temas" className="w-full aspect-video object-cover" />
                  <div className="p-4 bg-card">
                    <h3 className="font-medium text-lg">Seleção de Temas</h3>
                    <p className="text-muted-foreground">Navegue e selecione entre múltiplos temas e kits para festas.</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <div className="flex justify-center mt-4">
            <CarouselPrevious className="relative -left-0 top-0 translate-y-0" />
            <CarouselNext className="relative -right-0 top-0 translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};
