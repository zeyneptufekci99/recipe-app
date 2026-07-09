import { AppInput } from "@/components";
import type { CreateIngredientRequest } from "@/types/recipe";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface IngredientEditorProps {
  ingredients: CreateIngredientRequest[];
  onChange: (ingredients: CreateIngredientRequest[]) => void;
}

export function IngredientEditor({
  ingredients,
  onChange,
}: IngredientEditorProps) {
  const updateIngredient = (
    index: number,
    field: keyof CreateIngredientRequest,
    value: string,
  ) => {
    const updated = ingredients.map((ingredient, i) =>
      i === index
        ? {
            ...ingredient,
            [field]: value,
          }
        : ingredient,
    );

    onChange(updated);
  };

  const addIngredient = () => {
    onChange([
      ...ingredients,
      {
        name: "",
        amount: "",
      },
    ]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length === 1) return;

    onChange(ingredients.filter((_, i) => i !== index));
  };

  return (
    <View>
      <Text className="mb-3 text-base font-semibold text-text">
        Ingredients
      </Text>

      <View className="gap-3">
        {ingredients.map((ingredient, index) => (
          <View
            key={index}
            className="rounded-2xl border border-border bg-surface p-4"
          >
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-text">
                Ingredient {index + 1}
              </Text>

              <TouchableOpacity onPress={() => removeIngredient(index)}>
                <Ionicons name="trash-outline" size={20} color="#D9480F" />
              </TouchableOpacity>
            </View>

            <AppInput
              value={ingredient.name}
              onChangeText={(value) => updateIngredient(index, "name", value)}
              placeholder="Name"
              className="bg-background"
            />

            <AppInput
              value={ingredient.amount}
              onChangeText={(value) => updateIngredient(index, "amount", value)}
              placeholder="Amount"
              className="bg-background"
            />
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={addIngredient}
        className="mt-4 rounded-xl border border-primary py-3"
      >
        <Text className="text-center font-bold text-primary">
          + Add Ingredient
        </Text>
      </TouchableOpacity>
    </View>
  );
}
