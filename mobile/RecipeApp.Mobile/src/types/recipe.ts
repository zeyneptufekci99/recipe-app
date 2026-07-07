export interface RecipeListItem {
  id: string;
  title: string;
  imageUrl: string | null;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: number;
  isFavorite: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface GetRecipesParams {
  search?: string;
  categoryId?: string;
  difficulty?: number;
  page?: number;
  pageSize?: number;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string | null;
}

export interface RecipeStep {
  id: string;
  stepNumber: number;
  description: string;
}

export interface RecipeDetail extends RecipeListItem {
  description: string | null;
  sourceType: number;
  sourceUrl: string | null;
  ingredients: Ingredient[];
  steps: RecipeStep[];
}

export interface CreateIngredientRequest {
  name: string;
  amount?: string;
}

export interface CreateRecipeStepRequest {
  stepNumber: number;
  description: string;
}

export interface CreateRecipeRequest {
  title: string;
  description?: string;
  imageUrl?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: number;
  categoryId: string;
  sourceType: number;
  sourceUrl?: string;
  ingredients: CreateIngredientRequest[];
  steps: CreateRecipeStepRequest[];
}
