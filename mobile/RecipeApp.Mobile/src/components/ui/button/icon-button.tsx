import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;

interface IconButtonProps {
  icon: IconName;
  onPress?: () => void;
  color?: string;
  backgroundClassName?: string;
}

export function IconButton({
  icon,
  onPress,
  color = "#2B2B2B",
  backgroundClassName = "bg-background",
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`h-10 w-10 items-center justify-center rounded-full ${backgroundClassName}`}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={22} color={color} />
    </TouchableOpacity>
  );
}
