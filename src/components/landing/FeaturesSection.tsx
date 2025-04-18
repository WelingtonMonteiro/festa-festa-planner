
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Users, MessageSquare, Layout, Settings, Smartphone } from "lucide-react";

const features = [
  {
    icon: <Calendar className="h-10 w-10 text-primary" />,
    title: "Gestão de Eventos",
    description: "Agende e gerencie todos os seus eventos em um só lugar com nosso calendário intuitivo."
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Gestão de Clientes",
    description: "Acompanhe todos os seus clientes, suas preferências e histórico."
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "Mensagens",
    description: "Comunique-se com os clientes diretamente através do nosso sistema integrado de mensagens."
  },
  {
    icon: <Layout className="h-10 w-10 text-primary" />,
    title: "Temas Personalizados",
    description: "Escolha entre uma variedade de temas e kits para os seus eventos."
  },
  {
    icon: <Settings className="h-10 w-10 text-primary" />,
    title: "Relatórios e Análises",
    description: "Obtenha insights detalhados sobre o desempenho do seu negócio."
  },
  {
    icon: <Smartphone className="h-10 w-10 text-primary" />,
    title: "Acesso Mobile",
    description: "Acesse seu planejador de eventos em qualquer dispositivo, a qualquer hora, em qualquer lugar."
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tudo o que Você Precisa para Gerenciar seu Negócio
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nossa plataforma fornece todas as ferramentas necessárias para gerenciar eventos com eficiência e expandir seu negócio.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
