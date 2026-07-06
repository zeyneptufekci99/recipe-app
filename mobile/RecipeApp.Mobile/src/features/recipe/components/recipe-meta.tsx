import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { DifficultyBadge } from "./difficulty-badge";

interface RecipeMetaProps {
  totalTime: number;
  servings: number;
  difficulty: number;
}

export function RecipeMeta({
  totalTime,
  servings,
  difficulty,
}: RecipeMetaProps) {
  return (
    <View className="mt-4 flex-row items-center justify-between">
      <View className="flex-row items-center gap-1">
        <Ionicons name="time-outline" size={16} color="#7A7A7A" />
        <Text className="text-xs text-muted">{totalTime} min</Text>
      </View>

      <View className="flex-row items-center gap-1">
        <Ionicons name="people-outline" size={16} color="#7A7A7A" />
        <Text className="text-xs text-muted">{servings} servings</Text>
      </View>

      <DifficultyBadge difficulty={difficulty} />
    </View>
  );
}
