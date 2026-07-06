import { Text, View } from "react-native";

interface DifficultyBadgeProps {
  difficulty: number;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const difficultyMap = {
    1: {
      label: "Easy",
      container: "bg-green-100",
      text: "text-green-700",
    },
    2: {
      label: "Medium",
      container: "bg-orange-100",
      text: "text-orange-700",
    },
    3: {
      label: "Hard",
      container: "bg-red-100",
      text: "text-red-700",
    },
  } as const;

  const item =
    difficultyMap[difficulty as keyof typeof difficultyMap] ?? difficultyMap[1];

  return (
    <View className={`rounded-full px-3 py-1 ${item.container}`}>
      <Text className={`text-xs font-semibold ${item.text}`}>{item.label}</Text>
    </View>
  );
}
