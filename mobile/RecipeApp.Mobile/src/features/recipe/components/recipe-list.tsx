import type { RecipeListItem } from "@/types/recipe";
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
      renderItem={({ item }) => (
        <RecipeCard
          recipe={item}
          onPress={() => console.log("Recipe detail:", item.id)}
          onFavoritePress={() => toggleFavorite(item.id)}
        />
      )}
    />
  );
}
