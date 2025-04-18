import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { planService } from '@/services/planService';
import { Plan } from '@/types/plans';
import { Button } from '@/components/ui/button';
import { PlanList } from '@/components/admin/plans/PlanList';
import { PlanForm } from '@/components/admin/plans/PlanForm';

const PlansManagement = () => {
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Query para carregar planos
  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: planService.getPlans
  });

  // Mutation para criar planos
  const createPlanMutation = useMutation({
    mutationFn: (plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => {
      return planService.createPlan(plan);
    },
    onSuccess: () => {
      toast.success('Plano criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setIsCreating(false);
    },
    onError: (error) => {
      toast.error(`Erro ao criar plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });

  // Mutation para atualizar planos
  const updatePlanMutation = useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: Partial<Plan> }) => {
      return planService.updatePlan(id, plan);
    },
    onSuccess: () => {
      toast.success('Plano atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setEditingPlan(null);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });

  // Mutation para ativar/desativar planos
  const togglePlanStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => {
      return planService.togglePlanStatus(id, isActive);
    },
    onSuccess: (data) => {
      const statusText = data.is_active ? 'ativado' : 'desativado';
      toast.success(`Plano ${statusText} com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
    onError: (error) => {
      toast.error(`Erro ao alterar status do plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });

  // Mutation para arquivar planos
  const archivePlanMutation = useMutation({
    mutationFn: (id: string) => {
      return planService.archivePlan(id);
    },
    onSuccess: () => {
      toast.success('Plano arquivado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
    onError: (error) => {
      toast.error(`Erro ao arquivar plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });

  const handleCreatePlan = async (plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => {
    await createPlanMutation.mutateAsync(plan);
  };

  const handleUpdatePlan = async (plan: Plan) => {
    const { id, ...planData } = plan;
    await updatePlanMutation.mutateAsync({ id, plan: planData });
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    await togglePlanStatusMutation.mutateAsync({ id, isActive });
  };

  const handleArchivePlan = async (id: string) => {
    await archivePlanMutation.mutateAsync(id);
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setIsCreating(false);
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">Gerenciamento de Planos</h1>
      
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Lista de Planos</TabsTrigger>
          <TabsTrigger value="create" onClick={() => {
            setIsCreating(true);
            setEditingPlan(null);
          }}>
            Criar Plano
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planos</CardTitle>
              <CardDescription>
                Gerencie os planos de assinatura disponíveis para seus clientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isCreating || editingPlan ? (
                <div className="mb-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreating(false);
                      setEditingPlan(null);
                    }}
                  >
                    Voltar para Lista
                  </Button>
                </div>
              ) : (
                <div className="mb-4">
                  <Button 
                    onClick={() => {
                      setIsCreating(true);
                      setEditingPlan(null);
                    }}
                  >
                    Novo Plano
                  </Button>
                </div>
              )}
              
              {!isCreating && !editingPlan && (
                <PlanList 
                  plans={plans || []} 
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onToggleStatus={handleToggleStatus}
                  onArchive={handleArchivePlan}
                />
              )}
              
              {(isCreating || editingPlan) && (
                <PlanForm 
                  plan={editingPlan}
                  onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan}
                  onCancel={() => {
                    setIsCreating(false);
                    setEditingPlan(null);
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>{editingPlan ? 'Editar Plano' : 'Criar Novo Plano'}</CardTitle>
              <CardDescription>
                {editingPlan 
                  ? 'Atualize os detalhes do plano existente' 
                  : 'Preencha os detalhes do novo plano de assinatura'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanForm 
                plan={editingPlan}
                onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan}
                onCancel={() => {
                  setIsCreating(false);
                  setEditingPlan(null);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlansManagement;
