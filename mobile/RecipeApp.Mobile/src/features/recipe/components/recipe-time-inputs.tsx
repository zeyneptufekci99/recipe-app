import { Text, TextInput, View } from "react-native";

interface RecipeTimeInputsProps {
  prepTime: string;
  cookTime: string;
  servings: string;
  onPrepTimeChange: (value: string) => void;
  onCookTimeChange: (value: string) => void;
  onServingsChange: (value: string) => void;
}

export function RecipeTimeInputs({
  prepTime,
  cookTime,
  servings,
  onPrepTimeChange,
  onCookTimeChange,
  onServingsChange,
}: RecipeTimeInputsProps) {
  return (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <Text className="mb-2 text-base font-semibold text-text">Prep</Text>

        <TextInput
          value={prepTime}
          onChangeText={onPrepTimeChange}
          keyboardType="numeric"
          placeholder="10"
          className="rounded-xl border border-border bg-surface px-4 py-4 text-text"
        />
      </View>

      <View className="flex-1">
        <Text className="mb-2 text-base font-semibold text-text">Cook</Text>

        <TextInput
          value={cookTime}
          onChangeText={onCookTimeChange}
          keyboardType="numeric"
          placeholder="20"
          className="rounded-xl border border-border bg-surface px-4 py-4 text-text"
        />
      </View>

      <View className="flex-1">
        <Text className="mb-2 text-base font-semibold text-text">Servings</Text>

        <TextInput
          value={servings}
          onChangeText={onServingsChange}
          keyboardType="numeric"
          placeholder="2"
          className="rounded-xl border border-border bg-surface px-4 py-4 text-text"
        />
      </View>
    </View>
  );
}
