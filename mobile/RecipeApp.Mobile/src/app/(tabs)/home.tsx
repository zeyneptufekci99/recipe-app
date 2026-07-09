import { useGetCategoriesQuery } from "@/features/category/category-api";
import { RecipeCardSkeleton } from "@/features/recipe/components/recipe-card-skeleton";
import { useGetRecipesQuery } from "@/features/recipe/recipe-api";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";
import { View } from "react-native";
export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >();
  const debouncedSearch = useDebounce(search, 500);
  const { data: categories } = useGetCategoriesQuery();
  const { data, isLoading, isFetching, error, refetch } = useGetRecipesQuery({
    search: debouncedSearch,
    categoryId: selectedCategoryId,
    page: 1,
    pageSize: 10,
  });

  if (isLoading) {
    return (
      <View className="flex-1 bg-background px-4 pt-10">
        <View className="mb-5 h-9 w-40 rounded-full bg-border" />
        <View className="mb-5 h-12 rounded-2xl bg-border" />

        <View className="gap-4">
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </View>
      </View>
    );
  }
}
