import { AppButton, AppScreen } from "@/components";
import { useGetCategoriesQuery } from "@/features/category/category-api";
import { CategoryList } from "@/features/category/components/category-list";
import { RecipeCardSkeleton } from "@/features/recipe/components/recipe-card-skeleton";
import { RecipeList } from "@/features/recipe/components/recipe-list";
import { RecipeSearchBar } from "@/features/recipe/components/recipe-search-bar";
import { SortSelector } from "@/features/recipe/components/sort-selector";
import { useRecipes } from "@/features/recipe/hooks/use-recipes";
import { useDebounce } from "@/hooks/use-debounce";
import { RecipeSort } from "@/types/recipe";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
export default function HomeScreen() {
  const [sortBy, setSortBy] = useState<RecipeSort>("created_desc");
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >();
  const debouncedSearch = useDebounce(search, 500);
  const { data: categories } = useGetCategoriesQuery();
  const { recipes, isLoading, isFetching, error, loadMore, refresh } =
    useRecipes({
      search: debouncedSearch,
      categoryId: selectedCategoryId,
      sortBy,
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
      <View className="mb-5 flex-row gap-3">
        <View className="flex-1">
          <RecipeSearchBar value={search} onChangeText={setSearch} />
        </View>

        <SortSelector value={sortBy} onChange={setSortBy} />
      </View>
      <AppButton
        title="Import Recipe from URL"
        variant="outline"
        onPress={() => router.push("/import-recipe")}
      />
      <AppButton
        title="AI ile Tarif Oluştur"
        variant="outline"
        onPress={() => router.push("/generate-recipe")}
      />
      <CategoryList
        categories={categories ?? []}
        selectedCategoryId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />

      <RecipeList
        recipes={recipes}
        refreshing={isFetching && !isLoading}
        onRefresh={refresh}
        onEndReached={loadMore}
      />
    </AppScreen>
  );
}
