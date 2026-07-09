import { View } from "react-native";

export function RecipeCardSkeleton() {
  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-surface">
      <View className="h-48 w-full bg-border" />

      <View className="gap-3 p-4">
        <View className="h-5 w-3/4 rounded-full bg-border" />
        <View className="h-4 w-1/2 rounded-full bg-border" />

        <View className="mt-2 h-4 w-1/3 rounded-full bg-border" />

        <View className="mt-2 flex-row justify-between">
          <View className="h-4 w-16 rounded-full bg-border" />
          <View className="h-4 w-16 rounded-full bg-border" />
          <View className="h-6 w-20 rounded-full bg-border" />
        </View>
      </View>
    </View>
  );
}
