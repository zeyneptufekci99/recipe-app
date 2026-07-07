import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function EmptyState({
  title,
  description,
  icon = "restaurant-outline",
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-surface">
        <Ionicons name={icon} size={30} color="#E85D04" />
      </View>

      <Text className="text-center text-xl font-bold text-text">{title}</Text>

      {description ? (
        <Text className="mt-2 text-center text-sm leading-5 text-muted">
          {description}
        </Text>
      ) : null}
    </View>
  );
}
