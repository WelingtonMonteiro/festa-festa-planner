
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { Plan } from "@/types/plans";
import { planService } from "@/services/planService";
import { Switch } from "@/components/ui/switch";

export const PricingSection = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isYearly, setIsYearly] = useState(false);
  
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const activePlans = await planService.getActivePlans();
        setPlans(Array.isArray(activePlans) ? activePlans : []);
      } catch (error) {
        console.error("Erro ao carregar planos:", error);
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPlans();
  }, []);

  // Função para formatar os recursos do plano
  const formatFeatures = (features: string | string[]): string[] => {
    if (!features) return [];
    if (Array.isArray(features)) {
      return features;
    }
    return features.split(',').map(feature => feature.trim());
  };

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Escolha o plano ideal para seu negócio
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Preços transparentes, sem taxas ocultas. Cancele a qualquer momento.
          </p>
          
          <div className="flex items-center justify-center mt-8">
            <span className={`mr-4 ${!isYearly ? 'font-bold' : 'text-muted-foreground'}`}>
              Mensal
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`ml-4 ${isYearly ? 'font-bold' : 'text-muted-foreground'}`}>
              Anual <span className="text-green-500 text-sm">(Economize 17%)</span>
            </span>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full animate-pulse">
                <CardHeader className="h-48 bg-muted/50" />
                <CardContent className="space-y-4 p-6">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-8 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-full" />
                </CardContent>
                <CardFooter className="p-6">
                  <div className="h-10 bg-muted rounded w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              // Verifica se o ID é o id real ou o _id do MongoDB
              const planId = plan.id || plan._id || `plan-${Math.random()}`;
              
              return (
                <Card 
                  key={planId} 
                  className={`w-full ${plan.is_popular ? 'ring-2 ring-primary shadow-lg' : ''}`}
                >
                  {plan.is_popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-md rounded-tr-md">
                      Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        R$ {isYearly 
                          ? ((plan.price_yearly || 0) / 12).toFixed(2) 
                          : (plan.price_monthly || 0).toFixed(2)}
                      </span>
                      <span className="text-muted-foreground ml-2">/mês</span>
                      {isYearly && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Faturado como R$ {(plan.price_yearly || 0).toFixed(2)} anualmente
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {formatFeatures(plan.features).map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => document.dispatchEvent(new CustomEvent('openLoginModal'))}
                    >
                      {plan.is_popular ? 'Comece Agora' : 'Assinar'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-muted-foreground">Nenhum plano disponível no momento.</p>
          </div>
        )}
        
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-4">Empresas com necessidades especiais?</h3>
          <p className="text-muted-foreground mb-6">
            Oferecemos planos personalizados para empresas de maior porte com necessidades específicas.
          </p>
          <Button variant="outline" size="lg" onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Fale Conosco
          </Button>
        </div>
      </div>
    </section>
  );
};
