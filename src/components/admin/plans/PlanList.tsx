
import { Plan } from "@/types/plans";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArchiveIcon, Edit2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface PlanListProps {
  plans: Plan[];
  isLoading: boolean;
  onEdit: (plan: Plan) => void;
  onToggleStatus: (id: string, isActive: boolean) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
}

export function PlanList({ plans, isLoading, onEdit, onToggleStatus, onArchive }: PlanListProps) {
  if (isLoading) {
    return <PlanListSkeleton />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Preço Mensal</TableHead>
          <TableHead>Preço Anual</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              Nenhum plano encontrado
            </TableCell>
          </TableRow>
        ) : (
          plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell>R$ {plan.price_monthly.toFixed(2)}</TableCell>
              <TableCell>R$ {plan.price_yearly.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={plan.is_active}
                    onCheckedChange={(checked) => onToggleStatus(plan.id, checked)}
                  />
                  <Badge variant={plan.is_active ? "default" : "outline"}>
                    {plan.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => onEdit(plan)}
                  >
                    <Edit2Icon className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => onArchive(plan.id)}
                  >
                    <ArchiveIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

function PlanListSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Preço Mensal</TableHead>
          <TableHead>Preço Anual</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
            <TableCell><Skeleton className="h-8 w-20" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
