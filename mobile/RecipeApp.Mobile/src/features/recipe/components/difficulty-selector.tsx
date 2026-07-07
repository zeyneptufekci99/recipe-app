import { cn } from "@/utils/cn";
import { Text, TouchableOpacity, View } from "react-native";

interface DifficultySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const difficulties = [
  { value: 1, label: "Easy" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Hard" },
];

export function DifficultySelector({
  value,
  onChange,
}: DifficultySelectorProps) {
  return (
    <View>
      <Text className="mb-3 text-base font-semibold text-text">Difficulty</Text>

      <View className="flex-row gap-2">
        {difficulties.map((item) => {
          const selected = value === item.value;

          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => onChange(item.value)}
              className={cn(
                "flex-1 rounded-xl border py-3",
                selected
                  ? "border-primary bg-primary"
                  : "border-border bg-surface",
              )}
            >
              <Text
                className={cn(
                  "text-center font-semibold",
                  selected ? "text-white" : "text-muted",
                )}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
