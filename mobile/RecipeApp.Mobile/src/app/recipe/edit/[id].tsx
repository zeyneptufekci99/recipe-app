import { AppScreen, LoadingSpinner } from "@/components";
import { useGetRecipeByIdQuery } from "@/features/recipe/api";
import { RecipeForm } from "@/features/recipe/components/recipe-form";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useGetRecipeByIdQuery(id);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }
  if (error || !data) return <Text>Recipe not found</Text>;

  return (
    <AppScreen>
      <Text className="mb-6 text-3xl font-bold text-text">Tarifi Düzenle</Text>
      <RecipeForm recipe={data} mode="edit" />
    </AppScreen>
  );
}
