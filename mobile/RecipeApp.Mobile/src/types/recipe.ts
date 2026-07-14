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
  page: number;
  pageSize: number;
  sortBy?: RecipeSort;
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
  categoryId: string;
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

export interface ImportRecipeFromUrlRequest {
  url: string;
}

export interface ImportedRecipe {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: CreateIngredientRequest[];
  steps: CreateRecipeStepRequest[];
}

export type RecipeSort =
  | "created_desc"
  | "created_asc"
  | "title_asc"
  | "title_desc"
  | "favorites_first";

export interface ProfileStatistics {
  recipeCount: number;
  favoriteCount: number;
  importedRecipeCount: number;
  manualRecipeCount: number;
  mostUsedCategory: string;
}
export interface GenerateRecipeWithAiRequest {
  prompt: string;
}
export interface TransformRecipeWithAiRequest {
  instruction: string;
}
