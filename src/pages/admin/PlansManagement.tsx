
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plan } from '@/types/plans';
import { planService } from '@/services/planService';
import { PlanForm } from '@/components/admin/plans/PlanForm';
import { PlanList } from '@/components/admin/plans/PlanList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function PlansManagement() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: plans = [] } = useQuery({
    queryKey: ['plans'],
    queryFn: planService.getPlans
  });
  
  const createPlanMutation = useMutation({
    mutationFn: planService.createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success('Plano criado com sucesso');
      setIsFormOpen(false);
    },
    onError: () => toast.error('Erro ao criar plano')
  });
  
  const updatePlanMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Plan> }) => 
      planService.updatePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success('Plano atualizado com sucesso');
      setIsFormOpen(false);
      setSelectedPlan(null);
    },
    onError: () => toast.error('Erro ao atualizar plano')
  });
  
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) => 
      planService.togglePlanStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success('Status do plano atualizado');
    },
    onError: () => toast.error('Erro ao atualizar status do plano')
  });
  
  const archivePlanMutation = useMutation({
    mutationFn: planService.archivePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success('Plano arquivado com sucesso');
    },
    onError: () => toast.error('Erro ao arquivar plano')
  });
  
  const handleFormSubmit = async (data: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => {
    if (selectedPlan) {
      await updatePlanMutation.mutateAsync({ id: selectedPlan.id, data });
    } else {
      await createPlanMutation.mutateAsync(data);
    }
  };
  
  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsFormOpen(true);
  };
  
  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedPlan(null);
  };
  
  const activePlans = plans.filter(p => !p.is_archived);
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciamento de Planos</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>
      
      <PlanList
        plans={activePlans}
        onEdit={handleEdit}
        onToggleStatus={(id, status) => toggleStatusMutation.mutate({ id, status })}
        onArchive={(id) => archivePlanMutation.mutate(id)}
      />
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPlan ? 'Editar Plano' : 'Novo Plano'}
            </DialogTitle>
          </DialogHeader>
          <PlanForm
            initialData={selectedPlan || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
