import { useGetCategoriesQuery } from "@/features/category/category-api";
import { CategoryList } from "@/features/category/components/category-list";
import { RecipeList } from "@/features/recipe/components/recipe-list";
import { RecipeSearchBar } from "@/features/recipe/components/recipe-search-bar";
import { useGetRecipesQuery } from "@/features/recipe/recipe-api";
import { useState } from "react";
import { Text, View } from "react-native";
export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >();

  const { data: categories } = useGetCategoriesQuery();
  const { data, isLoading, error } = useGetRecipesQuery({
    search,
    page: 1,
    pageSize: 10,
    categoryId: selectedCategoryId,
  });

  if (isLoading) return <Text>Loading recipes...</Text>;
  if (error) return <Text>Recipe error</Text>;

  return (
    <View className="flex-1 bg-background px-4 pt-10">
      <Text className="mb-5 text-4xl font-bold text-text">RecipeApp</Text>

      <RecipeSearchBar value={search} onChangeText={setSearch} />

      <CategoryList
        categories={categories ?? []}
        selectedCategoryId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />

      <RecipeList recipes={data?.items ?? []} />
    </View>
  );
}
