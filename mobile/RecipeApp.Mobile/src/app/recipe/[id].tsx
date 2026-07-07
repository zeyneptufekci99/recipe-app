import { IngredientList } from "@/features/recipe/components/ingredient-list";
import { InstructionList } from "@/features/recipe/components/instruciton-list";
import { RecipeDetailHeader } from "@/features/recipe/components/recipe-detail-header";
import {
  useGetRecipeByIdQuery,
  useToggleFavoriteMutation,
} from "@/features/recipe/recipe-api";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text } from "react-native";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useGetRecipeByIdQuery(id);
  const [toggleFavorite] = useToggleFavoriteMutation();

  if (isLoading) return <Text>Loading...</Text>;
  if (error || !data) return <Text>Recipe not found</Text>;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-10"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-3xl font-bold text-text">{data.title}</Text>
      <Text className="mt-2 text-muted">{data.category}</Text>
      <RecipeDetailHeader
        recipe={data}
        onFavoritePress={() => toggleFavorite(data.id)}
      />
      <IngredientList ingredients={data.ingredients} />

      <InstructionList steps={data.steps} />
    </ScrollView>
  );
}
