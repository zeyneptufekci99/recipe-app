import type { Category } from "@/types/category";
import { Text, View } from "react-native";
import { CategoryList } from "./category-list";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelect: (id?: string) => void;
}

export function CategorySelector({
  categories,
  selectedCategoryId,
  onSelect,
}: CategorySelectorProps) {
  return (
    <View>
      <Text className="mb-2 text-base font-semibold text-text">Category</Text>

      <CategoryList
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelect={onSelect}
      />
    </View>
  );
}
