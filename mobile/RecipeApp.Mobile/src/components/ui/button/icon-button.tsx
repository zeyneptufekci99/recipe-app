import { cn } from "@/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;

interface IconButtonProps {
  icon: IconName;
  onPress?: () => void;
  color?: string;
  size?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
  className?: string;
  backgroundClassName?: string;
}

export function IconButton({
  icon,
  onPress,
  color = "#2B2B2B",
  size = 22,
  disabled = false,
  accessibilityLabel,
  className,
  backgroundClassName = "bg-background",
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={cn(
        "h-10 w-10 items-center justify-center rounded-full",
        backgroundClassName,
        disabled && "opacity-50",
        className,
      )}
    >
      <Ionicons name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
}
