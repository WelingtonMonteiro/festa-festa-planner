
import { Plan } from "@/types/plans";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Archive, Edit, Power, PowerOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

interface PlanListProps {
  plans: Plan[];
  onEdit: (plan: Plan) => void;
  onToggleStatus: (id: string, status: boolean) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
}

export function PlanList({ plans, onEdit, onToggleStatus, onArchive }: PlanListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map(plan => (
        <Card key={plan.id} className={plan.is_active ? '' : 'opacity-60'}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </div>
              <Badge variant={plan.is_active ? "default" : "secondary"}>
                {plan.is_active ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-lg font-bold">{formatCurrency(plan.price_monthly)}</p>
                <p className="text-sm text-muted-foreground">por mês</p>
              </div>
              <div>
                <p className="text-lg font-bold">{formatCurrency(plan.price_yearly)}</p>
                <p className="text-sm text-muted-foreground">por ano</p>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-sm">{feature}</li>
                ))}
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onToggleStatus(plan.id, !plan.is_active)}
            >
              {plan.is_active ? (
                <PowerOff className="h-4 w-4" />
              ) : (
                <Power className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onEdit(plan)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onArchive(plan.id)}
            >
              <Archive className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
