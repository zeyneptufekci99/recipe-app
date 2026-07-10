import { Text, TouchableOpacity } from "react-native";
import { cn } from "@/utils/cn";

interface AppLinkProps {
  title: string;
  onPress: () => void;
  className?: string;
}

export function AppLink({ title, onPress, className }: AppLinkProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Text className={cn("text-center font-semibold text-primary", className)}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}