import { Ionicons } from "@expo/vector-icons";
import { TextInput, TextInputProps, View } from "react-native";
import { cn } from "@/utils/cn";

interface SearchInputProps extends TextInputProps {
  containerClassName?: string;
}

export function SearchInput({
  className,
  containerClassName,
  ...props
}: SearchInputProps) {
  return (
    <View
      className={cn(
        "flex-row items-center rounded-2xl border border-border bg-surface px-4 py-3",
        containerClassName,
      )}
    >
      <Ionicons name="search-outline" size={20} color="#7A7A7A" />

      <TextInput
        {...props}
        placeholderTextColor="#7A7A7A"
        className={cn("ml-3 flex-1 text-base text-text", className)}
      />
    </View>
  );
}