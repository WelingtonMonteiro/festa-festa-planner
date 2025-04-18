
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { planService } from "@/services/planService";
import { formatCurrency } from "@/utils/format";
import { CheckCircle } from "lucide-react";

export const PricingSection = ({ onPlanSelect }: { onPlanSelect: (planName: string) => void }) => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const { data: plans = [] } = useQuery({
    queryKey: ['active-plans'],
    queryFn: planService.getActivePlans
  });

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos Simples e Transparentes</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Escolha o plano que melhor se adapta ao tamanho do seu negócio e necessidades
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${billingInterval === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Mensal
            </span>
            <Switch
              checked={billingInterval === 'yearly'}
              onCheckedChange={(checked) => setBillingInterval(checked ? 'yearly' : 'monthly')}
              className="data-[state=checked]:bg-primary"
            />
            <span className="inline-flex items-center gap-1">
              <span className={`text-sm font-medium ${billingInterval === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Anual
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                17% OFF
              </span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={plan.id} className={`border ${index === 1 ? 'border-primary shadow-lg' : 'shadow-md'}`}>
              <CardHeader className={`pb-8 ${index === 1 ? 'bg-primary/10' : ''}`}>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription className="mt-2">
                  <span className="text-3xl font-bold">
                    {formatCurrency(billingInterval === 'yearly' ? plan.price_yearly : plan.price_monthly)}
                  </span>
                  <span className="text-muted-foreground">/{billingInterval === 'yearly' ? 'ano' : 'mês'}</span>
                  <p className="mt-2">{plan.description}</p>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${index === 1 ? '' : 'bg-muted-foreground hover:bg-muted-foreground/80'}`}
                  onClick={() => onPlanSelect(plan.name)}
                >
                  {index === 1 ? 'Começar Agora' : 'Escolher Plano'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
