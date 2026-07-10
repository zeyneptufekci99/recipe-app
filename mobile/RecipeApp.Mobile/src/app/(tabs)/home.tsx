import { AppScreen } from "@/components";
import { useGetCategoriesQuery } from "@/features/category/category-api";
import { CategoryList } from "@/features/category/components/category-list";
import { useGetRecipesQuery } from "@/features/recipe/api";
import { RecipeCardSkeleton } from "@/features/recipe/components/recipe-card-skeleton";
import { RecipeList } from "@/features/recipe/components/recipe-list";
import { RecipeSearchBar } from "@/features/recipe/components/recipe-search-bar";
import { useDebounce } from "@/hooks/use-debounce";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
      <AppScreen>
        <View className="mb-5 h-9 w-40 rounded-full bg-border" />
        <View className="mb-5 h-12 rounded-2xl bg-border" />

        <View className="gap-4">
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </View>
      </AppScreen>
    );
  }
  if (error) return <Text>Recipe error</Text>;

  return (
    <AppScreen>
      <Text className="mb-5 text-4xl font-bold text-text">RecipeApp</Text>
      <TouchableOpacity
        onPress={() => router.push("/recipe/create")}
        className="mb-4 rounded-xl bg-primary px-4 py-3"
      >
        <Text className="text-center font-bold text-white">+ Yeni Tarif</Text>
      </TouchableOpacity>
      <RecipeSearchBar value={search} onChangeText={setSearch} />

      <CategoryList
        categories={categories ?? []}
        selectedCategoryId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />

      <RecipeList
        recipes={data?.items ?? []}
        refreshing={isFetching && !isLoading}
        onRefresh={refetch}
      />
    </AppScreen>
  );
}
