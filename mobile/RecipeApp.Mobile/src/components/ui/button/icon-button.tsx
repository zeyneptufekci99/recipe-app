import { Text, TouchableOpacity } from "react-native";

interface IconButtonProps {
  icon: string;
  onPress?: () => void;
}

export function IconButton({ icon, onPress }: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-full bg-background"
    >
      <Text className="text-xl">{icon}</Text>
    </TouchableOpacity>
  );
}
