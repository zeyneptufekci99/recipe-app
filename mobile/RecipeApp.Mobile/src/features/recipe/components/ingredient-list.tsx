import { AppSection } from "@/components";
import type { Ingredient } from "@/types/recipe";
import { Text, View } from "react-native";

interface IngredientListProps {
  ingredients: Ingredient[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <AppSection title="Ingredients">
      <View className="gap-2">
        {ingredients.map((ingredient) => (
          <View
            key={ingredient.id}
            className="flex-row items-center justify-between rounded-xl bg-surface px-4 py-3"
          >
            <Text className="text-base font-medium text-text">
              {ingredient.name}
            </Text>

            {ingredient.amount ? (
              <Text className="text-sm text-muted">{ingredient.amount}</Text>
            ) : null}
          </View>
        ))}
      </View>
    </AppSection>
  );
}
