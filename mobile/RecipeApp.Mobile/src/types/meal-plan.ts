export type MealType = 1 | 2 | 3 | 4;

export interface MealPlanItem {
  id: string;
  recipeId: string;
  recipeTitle: string;
  recipeImageUrl?: string | null;
  date: string;
  mealType: MealType;
}

export interface CreateMealPlanItemRequest {
  recipeId: string;
  date: string;
  mealType: MealType;
}
