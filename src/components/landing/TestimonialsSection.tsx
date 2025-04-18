
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "Este sistema de planejamento de eventos transformou a maneira como gerencio meu negócio. Agora posso lidar com o dobro de eventos com metade do estresse.",
    author: "Sarah Johnson, Planejadora de Eventos"
  },
  {
    quote: "Os recursos de gerenciamento de clientes por si só já valem o investimento. Meus clientes adoram como os eventos deles estão organizados agora.",
    author: "Miguel Rodriguez, Coordenador de Festas"
  },
  {
    quote: "Eu costumava gastar horas em tarefas administrativas. Agora posso me concentrar no que importa - criar eventos incríveis para meus clientes.",
    author: "Ana Chen, Planejadora de Casamentos"
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Nossos Usuários Dizem</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Não acredite apenas em nossa palavra. Veja o que organizadores de eventos profissionais dizem sobre nossa plataforma.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <svg width="45" height="36" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary/20">
                    <path d="M13.5 18H9C9.33333 12 12.4 9 18.2 9V13.5C15.6 13.5 13.6667 15 13.5 18ZM31.5 18H27C27.3333 12 30.4 9 36.2 9V13.5C33.6 13.5 31.6667 15 31.5 18Z" fill="currentColor"/>
                    <path d="M13.5 18H9V27H18V18H13.5ZM31.5 18H27V27H36V18H31.5Z" fill="currentColor"/>
                  </svg>
                </div>
                <p className="mb-4 italic">{testimonial.quote}</p>
                <p className="text-sm font-medium">{testimonial.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
