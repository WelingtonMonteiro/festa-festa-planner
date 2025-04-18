
import { supabase } from "@/integrations/supabase/client";
import { Plan } from "@/types/plans";

export const planService = {
  async getPlans() {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Plan[];
  },
  
  async getActivePlans() {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .eq('is_archived', false)
      .order('price_monthly', { ascending: true });
      
    if (error) throw error;
    return data as Plan[];
  },
  
  async createPlan(plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('plans')
      .insert([plan])
      .select()
      .single();
      
    if (error) throw error;
    return data as Plan;
  },
  
  async updatePlan(id: string, plan: Partial<Plan>) {
    const { data, error } = await supabase
      .from('plans')
      .update(plan)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Plan;
  },
  
  async togglePlanStatus(id: string, isActive: boolean) {
    return this.updatePlan(id, { is_active: isActive });
  },
  
  async archivePlan(id: string) {
    return this.updatePlan(id, { is_archived: true });
  }
};
