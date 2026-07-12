import { Text, TouchableOpacity } from "react-native";

interface PromptChipProps {
  title: string;
  onPress: () => void;
}

export function PromptChip({ title, onPress }: PromptChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="rounded-full border border-border bg-surface px-4 py-2"
    >
      <Text className="font-medium text-text">{title}</Text>
    </TouchableOpacity>
  );
}
