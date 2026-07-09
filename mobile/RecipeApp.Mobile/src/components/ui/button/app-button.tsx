import { cn } from "@/utils/cn";
import { Text, TouchableOpacity } from "react-native";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "danger" | "outline";
}

export function AppButton({
  title,
  onPress,
  disabled = false,
  variant = "primary",
}: AppButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      className={cn(
        "rounded-xl py-4",
        variant === "primary" && "bg-primary",
        variant === "danger" && "bg-red-500",
        variant === "outline" && "border border-primary bg-transparent",
        disabled && "opacity-60",
      )}
    >
      <Text
        className={cn(
          "text-center font-bold",
          variant === "outline" ? "text-primary" : "text-white",
        )}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
