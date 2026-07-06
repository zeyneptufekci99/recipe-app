import { Card } from "@/components/ui/card";
import type { RecipeListItem } from "@/types/recipe";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import { FavoriteButton } from "./favorite-button";
import { RecipeMeta } from "./recipe-meta";

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
  const totalTime = recipe.prepTime + recipe.cookTime;
  const rating = recipe.rating ?? 4.8;
  const reviewCount = recipe.reviewCount ?? 126;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card className="overflow-hidden p-0">
        <View className="relative">
          <Image
            source={
              recipe.imageUrl
                ? { uri: recipe.imageUrl }
                : require("../../../../assets/images/recipe-placeholder.jpg")
            }
            contentFit="cover"
            transition={300}
            className="h-48 w-full"
          />

          <View className="absolute right-3 top-3">
            <FavoriteButton
              isFavorite={recipe.isFavorite}
              onPress={onFavoritePress}
            />
          </View>
        </View>

        <View className="p-4">
          <Text className="text-xl font-bold text-text">{recipe.title}</Text>
          <Text className="mt-1 text-sm text-muted">{recipe.category}</Text>

          <View className="mt-3 flex-row items-center gap-1">
            <Ionicons name="star" size={16} color="#FAA307" />
            <Text className="text-sm font-semibold text-text">{rating}</Text>
            <Text className="text-sm text-muted">({reviewCount} reviews)</Text>
          </View>

          <RecipeMeta
            totalTime={totalTime}
            servings={recipe.servings}
            difficulty={recipe.difficulty}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
}
