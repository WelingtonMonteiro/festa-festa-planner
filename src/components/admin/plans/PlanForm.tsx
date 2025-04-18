
import { useState } from "react";
import { Plan } from "@/types/plans";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

export interface PlanFormProps {
  plan?: Plan | null;
  onSubmit: (data: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

export function PlanForm({ plan, onSubmit, onCancel }: PlanFormProps) {
  const [name, setName] = useState(plan?.name || '');
  const [description, setDescription] = useState(plan?.description || '');
  const [priceMonthly, setPriceMonthly] = useState(plan?.price_monthly?.toString() || '');
  const [priceYearly, setPriceYearly] = useState(plan?.price_yearly?.toString() || '');
  const [features, setFeatures] = useState<string[]>(plan?.features || ['']);
  const [isActive] = useState(plan?.is_active ?? true);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const planData = {
      name,
      description,
      price_monthly: Number(priceMonthly),
      price_yearly: Number(priceYearly),
      features: features.filter(f => f.trim() !== ''),
      is_active: isActive,
      is_archived: false
    };
    
    await onSubmit(planData);
  };
  
  const addFeature = () => setFeatures([...features, '']);
  
  const removeFeature = (index: number) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };
  
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Plano</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price_monthly">Preço Mensal (R$)</Label>
          <Input
            id="price_monthly"
            type="number"
            step="0.01"
            value={priceMonthly}
            onChange={(e) => setPriceMonthly(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price_yearly">Preço Anual (R$)</Label>
          <Input
            id="price_yearly"
            type="number"
            step="0.01"
            value={priceYearly}
            onChange={(e) => setPriceYearly(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <Label>Recursos do Plano</Label>
        {features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={feature}
              onChange={(e) => updateFeature(index, e.target.value)}
              placeholder="Ex: Até 5 eventos por mês"
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={() => removeFeature(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addFeature}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Recurso
        </Button>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {plan ? 'Atualizar Plano' : 'Criar Plano'}
        </Button>
      </div>
    </form>
  );
}
