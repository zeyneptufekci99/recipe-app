import {
  useDeleteRecipeMutation,
  useGetRecipeByIdQuery,
  useToggleFavoriteMutation,
} from "@/features/recipe/api";
import { IngredientList } from "@/features/recipe/components/ingredient-list";
import { InstructionList } from "@/features/recipe/components/instruciton-list";
import { RecipeDetailHeader } from "@/features/recipe/components/recipe-detail-header";
import { toastService } from "@/services/toast-service";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function RecipeDetailScreen() {
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useGetRecipeByIdQuery(id);
  const [toggleFavorite] = useToggleFavoriteMutation();

  if (isLoading) {
    return (
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="pb-10"
      >
        <View className="h-64 w-full bg-border" />

        <View className="gap-5 p-5">
          <View className="h-8 w-2/3 rounded-full bg-border" />

          <View className="h-4 w-1/3 rounded-full bg-border" />

          <View className="mt-4 h-24 rounded-2xl bg-border" />

          <View className="h-32 rounded-2xl bg-border" />

          <View className="h-40 rounded-2xl bg-border" />
        </View>
      </ScrollView>
    );
  }
  if (error || !data) return <Text>Recipe not found</Text>;

  const handleDelete = async () => {
    try {
      console.log("Delete started:", data.id);

      await deleteRecipe(data.id).unwrap();

      console.log("Delete success");

      router.replace("/(tabs)/home");
      toastService.success("Recipe deleted", "Recipe removed successfully.");
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
