
export interface Plan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_active: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}
