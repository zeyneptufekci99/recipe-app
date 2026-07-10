import { SearchInput } from "@/components";

interface RecipeSearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
}

export function RecipeSearchBar({ value, onChangeText }: RecipeSearchBarProps) {
  return (
    <SearchInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Search recipes..."
    />
  );
}
