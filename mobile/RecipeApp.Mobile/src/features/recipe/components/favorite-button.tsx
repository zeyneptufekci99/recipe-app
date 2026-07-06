import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress?: () => void;
}

export function FavoriteButton({ isFavorite, onPress }: FavoriteButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="h-10 w-10 items-center justify-center rounded-full bg-white/90"
    >
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={22}
        color={isFavorite ? "#E03131" : "#7A7A7A"}
      />
    </TouchableOpacity>
  );
}
