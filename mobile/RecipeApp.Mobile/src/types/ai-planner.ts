import type { MealType } from "@/types/meal-plan";

export type MealPlanGoal =
  | "lose_weight"
  | "gain_muscle"
  | "healthy"
  | "gain_weight"
  | "mediterranean"
  | "vegetarian"
  | "vegan";

export type MealPlanBudget = "low" | "medium" | "high";

export type MealPlanDays = 3 | 5 | 7;

export interface AiPlannerFormValues {
  goal: MealPlanGoal;
  servings: number;
  days: MealPlanDays;
  mealTypes: MealType[];
  maxPrepTime: number;
  budget: MealPlanBudget;
  excludedIngredients: string[];
  allergies: string[];
  notes: string;
}
