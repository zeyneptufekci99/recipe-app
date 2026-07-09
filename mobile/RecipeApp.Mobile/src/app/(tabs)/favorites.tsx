import { EmptyState } from "@/components/ui/empty-state";
import { RecipeCardSkeleton } from "@/features/recipe/components/recipe-card-skeleton";
import { RecipeList } from "@/features/recipe/components/recipe-list";
import { useGetFavoriteRecipesQuery } from "@/features/recipe/recipe-api";
import { Text, View } from "react-native";

export default function FavoritesScreen() {
  const { data, isLoading, error } = useGetFavoriteRecipesQuery();

  if (isLoading) {
    return (
      <View className="flex-1 bg-background px-4 pt-10">
        <View className="mb-6 h-9 w-44 rounded-full bg-border" />

        <View className="gap-4">
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </View>
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
