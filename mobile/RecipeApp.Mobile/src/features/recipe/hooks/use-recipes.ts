import { useLazyGetRecipesQuery } from "@/features/recipe/api";
import type { RecipeListItem, RecipeSort } from "@/types/recipe";
import { useCallback, useEffect, useState } from "react";

interface UseRecipesParams {
  search?: string;
  categoryId?: string;
  sortBy?: RecipeSort;
  pageSize?: number;
}

export function useRecipes({
  search,
  categoryId,
  sortBy = "created_desc",
  pageSize = 10,
}: UseRecipesParams) {
  const [page, setPage] = useState(1);
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [getRecipes, { isFetching, isLoading, error }] =
    useLazyGetRecipesQuery();

  const fetchRecipes = useCallback(
    async (pageToFetch: number, shouldReset = false) => {
      const result = await getRecipes({
        search,
        categoryId,
        sortBy,
        page: pageToFetch,
        pageSize,
      }).unwrap();

      setRecipes((prev) =>
        shouldReset ? result.items : [...prev, ...result.items],
      );

      setHasMore(result.page < result.totalPages);
    },
    [getRecipes, search, categoryId, sortBy, pageSize],
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchRecipes(1, true);
  }, [fetchRecipes]);

  const loadMore = () => {
    if (isFetching || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchRecipes(nextPage);
  };

  const refresh = () => {
    setPage(1);
    setHasMore(true);
    fetchRecipes(1, true);
  };

  return {
    recipes,
    isLoading,
    isFetching,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
