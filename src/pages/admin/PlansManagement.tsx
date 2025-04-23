import React, { useEffect, useState } from 'react';
import { Plan } from '@/types/plans';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlanList } from '@/components/admin/plans/PlanList';
import { PlanForm } from '@/components/admin/plans/PlanForm';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePlanService } from '@/services/entityServices/planService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

const PlansManagement = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [previewPlan, setPreviewPlan] = useState<Plan | null>(null);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const planService = usePlanService();
  
  useEffect(() => {
    loadPlans();
  }, [page]);
  
  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const response = await planService.getAll(page, limit);
      setPlans(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Error loading plans:', error);
      toast.error('Falha ao carregar planos');
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreatePlan = async (planData: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const plan: Omit<Plan, 'id'> = {
        ...planData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
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
  
  const handleUpdatePlan = async (planData: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingPlan || (!editingPlan.id && !editingPlan._id)) {
      console.error('ID do plano não disponível para atualização');
      toast.error('Falha ao identificar o plano para atualização');
      return;
    }
    
    try {
      const plan: Partial<Plan> = {
        ...planData,
        updated_at: new Date().toISOString(),
      };
      
      const planId = editingPlan.id || editingPlan._id;
      const updatedPlan = await planService.update(planId, plan);

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
    if (!id) {
      toast.error('Falha ao identificar o plano');
      return;
    }
    
    try {
      const result = await planService.togglePlanStatus(id, isActive);

      if (result) {
        toast.success(`Plano ${isActive ? 'ativado' : 'desativado'} com sucesso`);
        loadPlans();
      }
    } catch (error) {
      toast.error(`Falha ao ${isActive ? 'ativar' : 'desativar'} plano`);
    }
  };
  
  const handleArchivePlan = async (id: string) => {
    if (!id) {
      console.error('ID do plano não fornecido para arquivamento');
      toast.error('Falha ao identificar o plano');
      return;
    }
    
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
    if (!plan || (!plan.id && !plan._id)) {
      console.error('Plano inválido para edição');
      toast.error('Falha ao preparar plano para edição');
      return;
    }
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
  
  const handlePreviewPlan = (plan: Plan) => {
    setPreviewPlan(plan);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handlePlanSelection = (planName: string) => {
    toast.info(`Plano ${planName} selecionado para demonstração`);
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
                total={total}
                page={page}
                limit={limit}
                isLoading={isLoading}
                onEdit={handleEditPlan}
                onToggleStatus={handleTogglePlanStatus}
                onArchive={handleArchivePlan}
                onPreview={handlePreviewPlan}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                showArchived={showArchived}
                onShowArchivedChange={setShowArchived}
                onPageChange={setPage}
                billingInterval={billingInterval}
                onBillingIntervalChange={setBillingInterval}
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
                plan={null}
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
                plan={editingPlan}
                onSubmit={handleUpdatePlan}
                onCancel={handleCancelEdit}
              />
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={!!previewPlan} onOpenChange={() => setPreviewPlan(null)}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview do Plano</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Visualização do plano como será exibido na página inicial
            </p>
          </DialogHeader>
          
          {previewPlan && (
            <div className="bg-background mt-4">
              <section id="pricing" className="py-10">
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
                    <Card className={`border ${previewPlan.is_popular ? 'border-primary shadow-lg' : 'shadow-md'}`}>
                      <CardHeader className={`pb-8 ${previewPlan.is_popular ? 'bg-primary/10' : ''}`}>
                        <CardTitle>{previewPlan.name}</CardTitle>
                        <CardDescription className="mt-2">
                          <span className="text-3xl font-bold">
                            {formatCurrency(billingInterval === 'yearly' ? previewPlan.price_yearly : previewPlan.price_monthly)}
                          </span>
                          <span className="text-muted-foreground">/{billingInterval === 'yearly' ? 'ano' : 'mês'}</span>
                          <p className="mt-2">{previewPlan.description}</p>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ul className="space-y-3">
                          {(typeof previewPlan.features === 'string' 
                            ? previewPlan.features.split(',').map(f => f.trim())
                            : previewPlan.features
                          ).map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className={`w-full ${previewPlan.is_popular ? '' : 'bg-muted-foreground hover:bg-muted-foreground/80'}`}
                          onClick={() => handlePlanSelection(previewPlan.name)}
                        >
                          {previewPlan.is_popular ? 'Começar Agora' : 'Escolher Plano'}
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansManagement;
