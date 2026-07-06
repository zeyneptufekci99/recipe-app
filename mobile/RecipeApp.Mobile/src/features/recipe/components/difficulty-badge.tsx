import { Text, View } from "react-native";

interface DifficultyBadgeProps {
  difficulty: number;
}

const getDifficulty = (difficulty: number) => {
  switch (difficulty) {
    case 1:
      return { label: "Easy", className: "bg-green-100 text-green-700" };
    case 2:
      return { label: "Medium", className: "bg-orange-100 text-orange-700" };
    case 3:
      return { label: "Hard", className: "bg-red-100 text-red-700" };
    default:
      return { label: "Easy", className: "bg-green-100 text-green-700" };
  }
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const item = getDifficulty(difficulty);

  return (
    <View className={`rounded-full px-3 py-1 ${item.className.split(" ")[0]}`}>
      <Text className={`text-xs font-semibold ${item.className.split(" ")[1]}`}>
        {item.label}
      </Text>
    </View>
  );
}
