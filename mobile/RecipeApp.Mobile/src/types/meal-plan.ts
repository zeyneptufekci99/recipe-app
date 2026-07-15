export type MealType = 1 | 2 | 3 | 4;

export interface MealPlanItem {
  id: string;
  recipeId: string;
  recipeTitle: string;
  recipeImageUrl?: string | null;
  date: string;
  mealType: MealType;

  caloriesPerServing?: number | null;
  proteinGramsPerServing?: number | null;
  carbohydrateGramsPerServing?: number | null;
  fatGramsPerServing?: number | null;
}

export interface CreateMealPlanItemRequest {
  recipeId: string;
  date: string;
  mealType: MealType;
}

export interface GenerateWeeklyMealPlanRequest {
  startDate: string;
  days: 3 | 5 | 7;
  servings: number;
  goal: string;
  budget: string;
  maxPrepTime: number;
  mealTypes: MealType[];
  excludedIngredients: string[];
  allergies: string[];
  notes: string;
}

export interface GeneratedWeeklyMealPlan {
  startDate: string;
  endDate: string;
  days: number;
  items: MealPlanItem[];
}
