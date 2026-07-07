import type { RecipeDetail } from "@/types/recipe";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { FavoriteButton } from "./favorite-button";

interface RecipeDetailHeaderProps {
  recipe: RecipeDetail;
  onFavoritePress?: () => void;
}

export function RecipeDetailHeader({
  recipe,
  onFavoritePress,
}: RecipeDetailHeaderProps) {
  const rating = recipe.rating ?? 4.8;
  const reviewCount = recipe.reviewCount ?? 126;

  return (
    <View>
      <View className="relative">
        <Image
          source={
            recipe.imageUrl
              ? { uri: recipe.imageUrl }
              : require("../../../../assets/images/recipe-placeholder.jpg")
          }
          contentFit="cover"
          transition={300}
          className="h-72 w-full rounded-3xl"
        />

        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4 top-4 h-10 w-10 items-center justify-center rounded-full bg-white/90"
        >
          <Ionicons name="chevron-back" size={22} color="#2B2B2B" />
        </TouchableOpacity>

        <View className="absolute right-4 top-4">
          <FavoriteButton
            isFavorite={recipe.isFavorite}
            onPress={onFavoritePress}
          />
        </View>
      </View>

      <View className="mt-5">
        <Text className="text-3xl font-bold text-text">{recipe.title}</Text>
        <Text className="mt-1 text-base text-muted">{recipe.category}</Text>

        <View className="mt-3 flex-row items-center gap-1">
          <Ionicons name="star" size={16} color="#FAA307" />
          <Text className="text-sm font-semibold text-text">{rating}</Text>
          <Text className="text-sm text-muted">({reviewCount} reviews)</Text>
        </View>

        {recipe.description ? (
          <Text className="mt-4 text-base leading-6 text-muted">
            {recipe.description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
