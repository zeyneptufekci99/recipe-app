import { useLazyGetRecipesQuery } from "@/features/recipe/api";
import type { RecipeListItem, RecipeSort } from "@/types/recipe";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const requestVersionRef = useRef(0);

  const [getRecipes, { isFetching, isLoading, error }] =
    useLazyGetRecipesQuery();

  const fetchRecipes = useCallback(
    async (
      pageToFetch: number,
      shouldReset: boolean,
      requestVersion: number,
    ) => {
      try {
        const result = await getRecipes({
          search,
          categoryId,
          sortBy,
          page: pageToFetch,
          pageSize,
        }).unwrap();

        // Arama, kategori veya sıralama bu istek tamamlanmadan değiştiyse
        // eski cevabı listeye uygulama.
        if (requestVersion !== requestVersionRef.current) {
          return;
        }

        setRecipes((currentRecipes) => {
          if (shouldReset) {
            return result.items;
          }

          const recipeMap = new Map(
            currentRecipes.map((recipe) => [recipe.id, recipe]),
          );

          result.items.forEach((recipe) => {
            recipeMap.set(recipe.id, recipe);
          });

          return Array.from(recipeMap.values());
        });

        const canLoadMore = result.page < result.totalPages;

        pageRef.current = pageToFetch;
        hasMoreRef.current = canLoadMore;
        setHasMore(canLoadMore);
      } catch (fetchError) {
        console.log("Fetch recipes error:", fetchError);
      }
    },
    [categoryId, getRecipes, pageSize, search, sortBy],
  );

  useEffect(() => {
    const requestVersion = requestVersionRef.current + 1;

    requestVersionRef.current = requestVersion;
    pageRef.current = 1;
    hasMoreRef.current = true;

    // Query parametreleri değiştiğinde uzak API ile senkronizasyon sağlanıyor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchRecipes(1, true, requestVersion);
  }, [fetchRecipes]);

  const loadMore = useCallback(() => {
    if (isFetching || !hasMoreRef.current) {
      return;
    }

    const nextPage = pageRef.current + 1;

    void fetchRecipes(nextPage, false, requestVersionRef.current);
  }, [fetchRecipes, isFetching]);

  const refresh = useCallback(() => {
    const requestVersion = requestVersionRef.current + 1;

    requestVersionRef.current = requestVersion;
    pageRef.current = 1;
    hasMoreRef.current = true;

    void fetchRecipes(1, true, requestVersion);
  }, [fetchRecipes]);

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
