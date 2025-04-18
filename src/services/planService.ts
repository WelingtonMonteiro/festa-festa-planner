
import { Plan } from "@/types/plans";
import { toast } from "sonner";

export const planService = {
  async getAll(): Promise<Plan[]> {
    try {
      const response = await fetch('/api/plans');
      if (!response.ok) {
        throw new Error(`Failed to fetch plans: ${response.status}`);
      }
      const data = await response.json();
      return data as Plan[];
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load plans.");
      return [];
    }
  },

  async getActivePlans(): Promise<Plan[]> {
    try {
      const response = await fetch('/api/plans/active');
      if (!response.ok) {
        throw new Error(`Failed to fetch active plans: ${response.status}`);
      }
      const data = await response.json();
      return data as Plan[];
    } catch (error) {
      console.error("Error fetching active plans:", error);
      toast.error("Failed to load active plans.");
      return [];
    }
  }
};
