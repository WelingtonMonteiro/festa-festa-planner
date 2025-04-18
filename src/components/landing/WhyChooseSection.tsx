
import { CheckCircle } from "lucide-react";

export const WhyChooseSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Por Que Escolher Nossa Plataforma?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Veja por que organizadores de eventos confiam em nosso sistema para gerenciar seus negócios.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ChooseItem
            title="Economia de Tempo"
            description="Economize até 15 horas por semana em tarefas administrativas e coordenação de eventos."
          />
          <ChooseItem
            title="Aumento de Receita"
            description="Em média, nossos usuários relatam um aumento de 30% na capacidade de negócios e receita."
          />
          <ChooseItem
            title="Satisfação do Cliente"
            description="Melhor organização leva a clientes mais satisfeitos e mais indicações."
          />
          <ChooseItem
            title="Solução Completa"
            description="Todas as suas ferramentas em um só lugar, em vez de lidar com vários sistemas de software."
          />
          <ChooseItem
            title="Segurança de Dados"
            description="Seus dados de negócios e de clientes são armazenados e backupeados de forma segura."
          />
          <ChooseItem
            title="Sempre Disponível"
            description="Acesse seu sistema de gerenciamento de eventos 24/7 de qualquer dispositivo, em qualquer lugar."
          />
        </div>
      </div>
    </section>
  );
};

const ChooseItem = ({ title, description }: { title: string; description: string }) => (
  <div className="flex items-start space-x-4">
    <div className="mt-1">
      <CheckCircle className="h-6 w-6 text-primary" />
    </div>
    <div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);
