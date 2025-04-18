
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
import { ArchiveIcon, Edit2Icon, EyeIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface PlanListProps {
  plans: Plan[];
  isLoading: boolean;
  onEdit: (plan: Plan) => void;
  onToggleStatus: (id: string, isActive: boolean) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onPreview: (plan: Plan) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  showArchived: boolean;
  onShowArchivedChange: (value: boolean) => void;
}

export function PlanList({ 
  plans, 
  isLoading, 
  onEdit, 
  onToggleStatus, 
  onArchive,
  onPreview,
  statusFilter,
  onStatusFilterChange,
  showArchived,
  onShowArchivedChange
}: PlanListProps) {
  // Ensure plans is an array before filtering
  const plansArray = Array.isArray(plans) ? plans : [];
  
  const filteredPlans = plansArray.filter(plan => {
    if (!showArchived && plan.is_archived) return false;
    if (statusFilter === 'active' && !plan.is_active) return false;
    if (statusFilter === 'inactive' && plan.is_active) return false;
    return true;
  });

  if (isLoading) {
    return <PlanListSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-2">
          <Switch
            checked={showArchived}
            onCheckedChange={onShowArchivedChange}
          />
          <span>Mostrar arquivados</span>
        </div>
      </div>

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
          {filteredPlans.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                Nenhum plano encontrado
              </TableCell>
            </TableRow>
          ) : (
            filteredPlans.map((plan) => (
              <TableRow key={plan.id || plan._id} className={plan.is_archived ? "bg-muted/50" : ""}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>R$ {plan.price_monthly.toFixed(2)}</TableCell>
                <TableCell>R$ {plan.price_yearly.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={plan.is_active}
                      onCheckedChange={(checked) => onToggleStatus(plan.id || plan._id, checked)}
                      disabled={plan.is_archived}
                    />
                    <Badge variant={plan.is_active ? "default" : "outline"}>
                      {plan.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                    {plan.is_archived && (
                      <Badge variant="secondary">Arquivado</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => onEdit(plan)}
                      disabled={plan.is_archived}
                    >
                      <Edit2Icon className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => onArchive(plan.id || plan._id)}
                      disabled={plan.is_archived}
                    >
                      <ArchiveIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onPreview(plan)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
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

export default PlanList;
