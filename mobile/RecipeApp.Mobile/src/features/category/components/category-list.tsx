import type { Category } from "@/types/category";
import { ScrollView, View } from "react-native";
import { CategoryChip } from "./category-chip";

interface CategoryListProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelect: (id?: string) => void;
}

export function CategoryList({
  categories,
  selectedCategoryId,
  onSelect,
}: CategoryListProps) {
  return (
    <View className="mb-5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="items-center gap-2 pr-4"
      >
        <CategoryChip
          label="All"
          selected={!selectedCategoryId}
          onPress={() => onSelect(undefined)}
        />

        {categories.map((category) => (
          <CategoryChip
            key={category.id}
            label={category.name}
            selected={selectedCategoryId === category.id}
            onPress={() => onSelect(category.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
