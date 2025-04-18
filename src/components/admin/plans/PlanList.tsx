
import { Plan } from "@/types/plans";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArchiveIcon, CheckCircle, Edit2Icon, EyeIcon, LayoutGrid, Table2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

export interface PlanListProps {
  plans: Plan[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onEdit: (plan: Plan) => void;
  onToggleStatus: (id: string, isActive: boolean) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onPreview: (plan: Plan) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  showArchived: boolean;
  onShowArchivedChange: (value: boolean) => void;
  onPageChange: (page: number) => void;
  billingInterval: 'monthly' | 'yearly';
  onBillingIntervalChange: (interval: 'monthly' | 'yearly') => void;
}

export function PlanList({
  plans,
  total,
  page,
  limit,
  isLoading,
  onEdit,
  onToggleStatus,
  onArchive,
  onPreview,
  statusFilter,
  onStatusFilterChange,
  showArchived,
  onShowArchivedChange,
  onPageChange,
  billingInterval,
  onBillingIntervalChange
}: PlanListProps) {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const totalPages = Math.ceil(total / limit);

  const plansArray = Array.isArray(plans) ? plans : [];
  
  const filteredPlans = plansArray.filter(plan => {
    if (!showArchived && plan.is_archived) return false;
    if (statusFilter === 'active' && !plan.is_active) return false;
    if (statusFilter === 'inactive' && plan.is_active) return false;
    return true;
  });

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (isLoading) {
    return <PlanListSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
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

        <div className="flex items-center gap-2">
          <Toggle
            pressed={viewMode === 'table'}
            onPressedChange={() => setViewMode('table')}
            aria-label="Visualização em tabela"
          >
            <Table2 className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={viewMode === 'grid'}
            onPressedChange={() => setViewMode('grid')}
            aria-label="Visualização em grid"
          >
            <LayoutGrid className="h-4 w-4" />
          </Toggle>
        </div>
      </div>

      {viewMode === 'table' ? (
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
                  <TableCell>{formatCurrency(plan.price_monthly)}</TableCell>
                  <TableCell>{formatCurrency(plan.price_yearly)}</TableCell>
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
      ) : (
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={`text-sm font-medium ${billingInterval === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Mensal
          </span>
          <Switch
            checked={billingInterval === 'yearly'}
            onCheckedChange={(checked) => onBillingIntervalChange(checked ? 'yearly' : 'monthly')}
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
      )}

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {filteredPlans.map((plan) => (
            <Card key={plan.id || plan._id} className={`border ${plan.is_popular ? 'border-primary shadow-lg' : 'shadow-md'}`}>
              <CardHeader className={`pb-8 ${plan.is_popular ? 'bg-primary/10' : ''}`}>
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
                  {(Array.isArray(plan.features) ? plan.features : plan.features.split(',')).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => onEdit(plan)}
                  disabled={plan.is_archived}
                >
                  <Edit2Icon className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => onArchive(plan.id || plan._id)}
                  disabled={plan.is_archived}
                >
                  <ArchiveIcon className="h-4 w-4 mr-2" />
                  Arquivar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(page - 1)}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {[...Array(totalPages)].map((_, idx) => (
            <PaginationItem key={idx + 1}>
              <PaginationLink 
                isActive={page === idx + 1}
                onClick={() => onPageChange(idx + 1)}
              >
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(page + 1)}
              className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
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
