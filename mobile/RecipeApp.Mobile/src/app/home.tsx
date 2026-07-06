import { useGetCategoriesQuery } from "@/features/category/category-api";
import { useGetRecipesQuery } from "@/features/recipe/recipe-api";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const { data: categories } = useGetCategoriesQuery();
  const {
    data: recipes,
    isLoading,
    error,
  } = useGetRecipesQuery({
    page: 1,
    pageSize: 10,
  });

  if (isLoading) return <Text>Loading recipes...</Text>;
  if (error) return <Text>Recipe error</Text>;

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>RecipeApp</Text>

      <Text style={{ fontWeight: "700" }}>Categories</Text>
      {categories?.map((category) => (
        <Text key={category.id}>{category.name}</Text>
      ))}

      <Text style={{ fontWeight: "700", marginTop: 16 }}>Recipes</Text>
      {recipes?.items.map((recipe) => (
        <Text key={recipe.id}>
          {recipe.title} - {recipe.category}
        </Text>
      ))}
    </View>
  );
}
