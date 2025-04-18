
import { Plan } from "@/types/plans";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Archive, Edit, Power, PowerOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

interface PlanListProps {
  plans: Plan[];
  isLoading?: boolean;
  onEdit: (plan: Plan) => void;
  onToggleStatus: (id: string, status: boolean) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
}

export function PlanList({ plans, isLoading = false, onEdit, onToggleStatus, onArchive }: PlanListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="opacity-70">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 w-1/3" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="ml-auto flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
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
      
      {plans.length === 0 && (
        <div className="col-span-full">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <p className="text-center text-muted-foreground">
                Nenhum plano encontrado.
              </p>
              <p className="text-center text-muted-foreground">
                Crie um novo plano para começar.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
