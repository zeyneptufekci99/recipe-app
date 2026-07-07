import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

interface RecipeSearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
}

export function RecipeSearchBar({
  value,
  onChangeText,
}: RecipeSearchBarProps) {
  return (
    <View className="mb-5 flex-row items-center rounded-2xl border border-border bg-surface px-4 py-3">
      <Ionicons name="search-outline" size={20} color="#7A7A7A" />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search recipes..."
        placeholderTextColor="#7A7A7A"
        className="ml-3 flex-1 text-base text-text outline-none"
      />
    </View>
  );
}