import { cn } from "@/utils/cn";
import { Text, TouchableOpacity } from "react-native";

interface CategoryChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function CategoryChip({ label, selected, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={cn(
        "h-11 items-center justify-center rounded-full border px-4",
        selected ? "border-primary bg-primary" : "border-border bg-surface",
      )}
    >
      <Text
        className={cn(
          "text-sm font-semibold",
          selected ? "text-white" : "text-muted",
        )}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
