import { EmptyState } from "@/components/ui/empty-state";
import { RecipeList } from "@/features/recipe/components/recipe-list";
import { useGetFavoriteRecipesQuery } from "@/features/recipe/recipe-api";
import { Text, View } from "react-native";

export default function FavoritesScreen() {
  const { data, isLoading, error } = useGetFavoriteRecipesQuery();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted">Loading favorites...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-danger">Favoriler yüklenemedi.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 pt-10">
      <Text className="mb-5 text-3xl font-bold text-text">Favorites</Text>

      {data?.items.length ? (
        <RecipeList recipes={data.items} />
      ) : (
        <EmptyState
          title="Favori tarif yok"
          description="Beğendiğin tarifleri burada görebilirsin."
          icon="heart-outline"
        />
      )}
    </View>
  );
}
