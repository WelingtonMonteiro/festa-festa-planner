
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Maria Silva",
    role: "CEO e Fundadora",
    bio: "Com mais de 15 anos de experiência em planejamento de eventos, Maria fundou a Festana para ajudar outros profissionais a escalar seus negócios.",
    photo: "/placeholder.svg"
  },
  {
    name: "João Pereira",
    role: "CTO",
    bio: "Especialista em tecnologia com paixão por criar soluções que simplificam a vida de organizadores de eventos.",
    photo: "/placeholder.svg"
  },
  {
    name: "Ana Oliveira",
    role: "Head de Sucesso do Cliente",
    bio: "Dedicada a garantir que todos os clientes da Festana maximizem o potencial da plataforma.",
    photo: "/placeholder.svg"
  }
];

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sobre a Festana</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conheça nossa história e a equipe por trás da plataforma que está transformando o mercado de eventos
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h3 className="text-2xl font-bold mb-4">Nossa História</h3>
            <p className="mb-6 text-muted-foreground">
              A Festana nasceu da paixão por eventos e da frustração com a falta de ferramentas adequadas para gerenciá-los. 
              Nossa fundadora, Maria Silva, enfrentava diariamente o desafio de coordenar múltiplos eventos enquanto 
              mantinha a qualidade e a atenção aos detalhes que seus clientes mereciam.
            </p>
            <p className="mb-6 text-muted-foreground">
              Em 2020, decidimos criar uma plataforma que pudesse resolver não apenas os nossos desafios, mas 
              os de todos os organizadores de eventos pelo Brasil. Depois de dois anos de desenvolvimento e testes 
              com profissionais reais, lançamos a Festana para o mercado.
            </p>
            <p className="text-muted-foreground">
              Hoje, estamos orgulhosos de ajudar centenas de profissionais a transformar seus negócios, 
              economizar tempo e encantar seus clientes com eventos perfeitamente organizados.
            </p>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden shadow-xl border">
            <img 
              src="/placeholder.svg" 
              alt="Equipe Festana" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
          </div>
        </div>
        
        <div id="team" className="pt-10">
          <h3 className="text-2xl font-bold mb-10 text-center">Nosso Time</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-md">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={member.photo} 
                    alt={`${member.name} - ${member.role}`} 
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
