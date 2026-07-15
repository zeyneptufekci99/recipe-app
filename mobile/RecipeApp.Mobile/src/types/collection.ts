export interface CollectionSummary {
  id: string;
  name: string;
  description?: string | null;
  recipeCount: number;
  coverImageUrl?: string | null;
}

export interface CollectionRecipe {
  id: string;
  title: string;
  imageUrl?: string | null;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
}

export interface CollectionDetail {
  id: string;
  name: string;
  description?: string | null;
  recipes: CollectionRecipe[];
}

export interface CreateCollectionRequest {
  name: string;
  description?: string | null;
}

export interface UpdateCollectionRequest {
  name: string;
  description?: string | null;
}

export interface CollectionMembership {
  collectionId: string;
  collectionName: string;
}
