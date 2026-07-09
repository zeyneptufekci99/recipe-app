import { RecipeForm } from "@/features/recipe/components/recipe-form";
import { useGetRecipeByIdQuery } from "@/features/recipe/recipe-api";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useGetRecipeByIdQuery(id);

  if (isLoading) return <Text>Loading...</Text>;
  if (error || !data) return <Text>Recipe not found</Text>;

  return (
    <View className="flex-1 bg-background px-4 pt-10">
      <Text className="mb-6 text-3xl font-bold text-text">Tarifi Düzenle</Text>
      <RecipeForm recipe={data} mode="edit" />
    </View>
  );
}
