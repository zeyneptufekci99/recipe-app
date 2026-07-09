import { IngredientList } from "@/features/recipe/components/ingredient-list";
import { InstructionList } from "@/features/recipe/components/instruciton-list";
import { RecipeDetailHeader } from "@/features/recipe/components/recipe-detail-header";
import {
  useDeleteRecipeMutation,
  useGetRecipeByIdQuery,
  useToggleFavoriteMutation,
} from "@/features/recipe/recipe-api";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TouchableOpacity } from "react-native";

export default function RecipeDetailScreen() {
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useGetRecipeByIdQuery(id);
  const [toggleFavorite] = useToggleFavoriteMutation();

  if (isLoading) return <Text>Loading...</Text>;
  if (error || !data) return <Text>Recipe not found</Text>;

  const handleDelete = async () => {
    try {
      console.log("Delete started:", data.id);

      await deleteRecipe(data.id).unwrap();

      console.log("Delete success");

      router.replace("/(tabs)/home");
    } catch (error) {
      console.log("Delete recipe error:", error);
    }
  };

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
      <TouchableOpacity
        onPress={() => router.push(`/recipe/edit/${data.id}`)}
        className="mt-4 rounded-xl bg-primary py-3"
      >
        <Text className="text-center font-bold text-white">Düzenle</Text>
      </TouchableOpacity>
      <IngredientList ingredients={data.ingredients} />

      <InstructionList steps={data.steps} />

      <TouchableOpacity
        onPress={handleDelete}
        disabled={isDeleting}
        className="mt-6 rounded-xl bg-red-500 py-4"
      >
        <Text className="text-center font-bold text-white">
          {isDeleting ? "Siliniyor..." : "Tarifi Sil"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
