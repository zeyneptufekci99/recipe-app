export interface ShoppingListSummary {
  id: string;
  name: string;
  itemCount: number;
  completedItemCount: number;
}

export interface ShoppingListItem {
  id: string;
  recipeId?: string | null;
  name: string;
  amount?: string | null;
  isCompleted: boolean;
}

export interface ShoppingListDetail {
  id: string;
  name: string;
  items: ShoppingListItem[];
}

export interface CreateShoppingListRequest {
  name: string;
}
