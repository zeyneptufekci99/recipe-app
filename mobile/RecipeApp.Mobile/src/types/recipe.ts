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
