import { EmptyState } from "@/components/ui/empty-state";
import type { RecipeListItem } from "@/types/recipe";
import { router } from "expo-router";
import { FlatList, RefreshControl } from "react-native";
import { useToggleFavoriteMutation } from "../recipe-api";
import { RecipeCard } from "./recipe-card";

interface RecipeListProps {
  recipes: RecipeListItem[];
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function RecipeList({
  recipes,
  refreshing = false,
  onRefresh,
}: RecipeListProps) {
  const [toggleFavorite] = useToggleFavoriteMutation();

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerClassName="gap-4 pb-8"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <EmptyState
          title="Tarif bulunamadı"
          description="Aramanı veya filtrelerini değiştirerek tekrar dene."
        />
      }
      renderItem={({ item }) => (
        <RecipeCard
          recipe={item}
          onPress={() => router.push(`/recipe/${item.id}`)}
          onFavoritePress={() => toggleFavorite(item.id)}
        />
      )}
    />
  );
}
