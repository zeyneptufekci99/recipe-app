import { EmptyState } from "@/components";
import type { RecipeListItem } from "@/types/recipe";
import { RelativePathString, router } from "expo-router";
import { FlatList } from "react-native";
import { useToggleFavoriteMutation } from "../recipe-api";
import { RecipeCard } from "./recipe-card";

interface RecipeListProps {
  recipes: RecipeListItem[];
}

export function RecipeList({ recipes }: RecipeListProps) {
  const [toggleFavorite] = useToggleFavoriteMutation();
  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerClassName="gap-4 pb-8"
      ListEmptyComponent={
        <EmptyState
          title="Tarif bulunamadı"
          description="Aramanı veya filtrelerini değiştirerek tekrar dene."
        />
      }
      renderItem={({ item }) => (
        <RecipeCard
          recipe={item}
          onPress={() =>
            router.push(`/recipe/${item.id}` as RelativePathString)
          }
          onFavoritePress={() => toggleFavorite(item.id)}
        />
      )}
    />
  );
}
