
import React, { useEffect, useState } from 'react';
import { Plan } from '@/types/plans';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PlanList from '@/components/admin/plans/PlanList';
import PlanForm from '@/components/admin/plans/PlanForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { usePlanService } from '@/services/entityServices/planService';

const PlansManagement = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const planService = usePlanService();
  
  useEffect(() => {
    loadPlans();
  }, []);
  
  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const plans = await planService.getAll();
      setPlans(plans);
    } catch (error) {
      console.error('Error loading plans:', error);
      toast.error('Falha ao carregar planos');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreatePlan = async (plan: Omit<Plan, 'id'>) => {
    try {
      const newPlan = await planService.create(plan);
      if (newPlan) {
        toast.success('Plano criado com sucesso');
        setIsCreating(false);
        loadPlans();
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error('Falha ao criar plano');
    }
  };
  
  const handleUpdatePlan = async (plan: Omit<Plan, 'id'>) => {
    if (!editingPlan) return;
    
    try {
      const updatedPlan = await planService.update(editingPlan.id, plan);
      if (updatedPlan) {
        toast.success('Plano atualizado com sucesso');
        setEditingPlan(null);
        loadPlans();
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Falha ao atualizar plano');
    }
  };
  
  const handleTogglePlanStatus = async (id: string, isActive: boolean) => {
    try {
      const result = await planService.togglePlanStatus(id, isActive);
      if (result) {
        toast.success(`Plano ${isActive ? 'ativado' : 'desativado'} com sucesso`);
        loadPlans();
      }
    } catch (error) {
      console.error('Error toggling plan status:', error);
      toast.error(`Falha ao ${isActive ? 'ativar' : 'desativar'} plano`);
    }
  };
  
  const handleArchivePlan = async (id: string) => {
    try {
      const result = await planService.archivePlan(id);
      if (result) {
        toast.success('Plano arquivado com sucesso');
        loadPlans();
      }
    } catch (error) {
      console.error('Error archiving plan:', error);
      toast.error('Falha ao arquivar plano');
    }
  };
  
  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setIsCreating(false);
  };
  
  const handleCancelEdit = () => {
    setEditingPlan(null);
    setIsCreating(false);
  };
  
  const handleStartCreating = () => {
    setIsCreating(true);
    setEditingPlan(null);
  };
  
  // Plano padrão para novo
  const defaultPlan: Omit<Plan, 'id'> = {
    name: '',
    description: '',
    price_monthly: 0,
    price_yearly: 0,
    features: [],
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Planos</h1>
        {!isCreating && !editingPlan && (
          <Button onClick={handleStartCreating}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Plano
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {!isCreating && !editingPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Planos Disponíveis</CardTitle>
              <CardDescription>
                Gerencie os planos de assinatura disponíveis para os clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanList 
                plans={plans} 
                isLoading={isLoading}
                onEdit={handleEditPlan}
                onToggleStatus={handleTogglePlanStatus}
                onArchive={handleArchivePlan}
              />
            </CardContent>
          </Card>
        )}
        
        {isCreating && (
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Plano</CardTitle>
              <CardDescription>
                Preencha os detalhes para criar um novo plano
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanForm 
                defaultValues={defaultPlan}
                onSubmit={handleCreatePlan}
                onCancel={handleCancelEdit}
              />
            </CardContent>
          </Card>
        )}
        
        {editingPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Editar Plano</CardTitle>
              <CardDescription>
                Atualize as informações do plano selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanForm 
                defaultValues={editingPlan}
                onSubmit={handleUpdatePlan}
                onCancel={handleCancelEdit}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlansManagement;
