import { shareService } from "@/services/share-service";
import type { RecipeDetail } from "@/types/recipe";
import { getImageUrl } from "@/utils/get-image-url";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { FavoriteButton } from "./favorite-button";

interface RecipeDetailHeaderProps {
  recipe: RecipeDetail;
  onFavoritePress?: () => void;
}

interface InfoItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

export function RecipeDetailHeader({
  recipe,
  onFavoritePress,
}: RecipeDetailHeaderProps) {
  const imageSource = getImageUrl(recipe.imageUrl);
  const totalTime = recipe.prepTime + recipe.cookTime;

  const handleShare = async () => {
    await shareService.shareRecipe(recipe);
  };

  return (
    <View>
      <View className="relative">
        <Image
          source={
            imageSource
              ? { uri: imageSource }
              : require("../../../../assets/images/recipe-placeholder.jpg")
          }
          contentFit="cover"
          transition={300}
          className="h-72 w-full rounded-3xl bg-border"
        />

        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Geri dön"
          className="absolute left-4 top-4 h-10 w-10 items-center justify-center rounded-full bg-white/90"
        >
          <Ionicons name="chevron-back" size={22} color="#2B2B2B" />
        </TouchableOpacity>

        <View className="absolute right-4 top-4 flex-row gap-2">
          <FavoriteButton
            isFavorite={recipe.isFavorite}
            onPress={onFavoritePress}
          />

          <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Tarifi paylaş"
            className="h-10 w-10 items-center justify-center rounded-full bg-white/90"
          >
            <Ionicons name="share-outline" size={21} color="#2B2B2B" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-5">
        <View className="self-start rounded-full bg-primary/10 px-3 py-1.5">
          <Text className="text-sm font-semibold text-primary">
            {recipe.category}
          </Text>
        </View>

        <Text className="mt-3 text-3xl font-bold leading-10 text-text">
          {recipe.title}
        </Text>

        {recipe.description ? (
          <Text className="mt-3 text-base leading-6 text-muted">
            {recipe.description}
          </Text>
        ) : null}

        <View className="mt-5 flex-row gap-3">
          <InfoItem
            icon="time-outline"
            label="Toplam süre"
            value={`${totalTime} dk`}
          />

          <InfoItem
            icon="people-outline"
            label="Porsiyon"
            value={`${recipe.servings} kişilik`}
          />

          <InfoItem
            icon="speedometer-outline"
            label="Zorluk"
            value={getDifficultyLabel(recipe.difficulty)}
          />
        </View>

        <View className="mt-3 flex-row gap-3">
          <InfoItem
            icon="hourglass-outline"
            label="Hazırlık"
            value={`${recipe.prepTime} dk`}
          />

          <InfoItem
            icon="flame-outline"
            label="Pişirme"
            value={`${recipe.cookTime} dk`}
          />
        </View>
      </View>
    </View>
  );
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <View className="flex-1 rounded-2xl border border-border bg-surface p-3">
      <Ionicons name={icon} size={19} color="#E85D04" />

      <Text className="mt-2 text-xs font-medium text-muted">{label}</Text>

      <Text className="mt-1 text-sm font-bold text-text">{value}</Text>
    </View>
  );
}

function getDifficultyLabel(difficulty: number | string) {
  if (typeof difficulty === "string") {
    return difficulty;
  }

  switch (difficulty) {
    case 1:
      return "Kolay";
    case 2:
      return "Orta";
    case 3:
      return "Zor";
    default:
      return "Belirsiz";
  }
}
