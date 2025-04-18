
export interface Plan {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string | string[];
  is_active: boolean;
  is_archived: boolean;
  is_popular?: boolean;
  created_at: string;
  updated_at: string;
}
