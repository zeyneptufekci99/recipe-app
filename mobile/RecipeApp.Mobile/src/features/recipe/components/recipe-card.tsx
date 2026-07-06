import { Card, IconButton } from "@/components";
import type { RecipeListItem } from "@/types/recipe";
import { Text, TouchableOpacity, View } from "react-native";

interface RecipeCardProps {
  recipe: RecipeListItem;
  onPress?: () => void;
  onFavoritePress?: () => void;
}

export function RecipeCard({
  recipe,
  onPress,
  onFavoritePress,
}: RecipeCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card>
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-lg font-bold text-text">{recipe.title}</Text>
            <Text className="mt-1 text-sm text-muted">{recipe.category}</Text>
          </View>

          <IconButton
            icon={recipe.isFavorite ? "heart" : "heart-outline"}
            color={recipe.isFavorite ? "#E03131" : "#7A7A7A"}
            onPress={onFavoritePress}
          />
        </View>

        <View className="mt-4 flex-row gap-4">
          <Text className="text-sm text-muted">
            ⏱ {recipe.prepTime + recipe.cookTime} dk
          </Text>
          <Text className="text-sm text-muted">👥 {recipe.servings}</Text>
          <Text className="text-sm text-muted">⭐ {recipe.difficulty}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
