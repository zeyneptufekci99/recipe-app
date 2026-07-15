import { AppButton, AppInput } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PantryIngredientInputProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
}

export function PantryIngredientInput({
  ingredients,
  onChange,
}: PantryIngredientInputProps) {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    const trimmedValue = value.trim();

    if (!trimmedValue) return;

    const alreadyExists = ingredients.some(
      (ingredient) =>
        ingredient.toLocaleLowerCase("tr") ===
        trimmedValue.toLocaleLowerCase("tr"),
    );

    if (alreadyExists) {
      setValue("");
      return;
    }

    onChange([...ingredients, trimmedValue]);
    setValue("");
  };

  const handleRemove = (ingredient: string) => {
    onChange(ingredients.filter((current) => current !== ingredient));
  };

  return (
    <View>
      <Text className="mb-2 text-base font-semibold text-text">
        Mutfakta neler var?
      </Text>

      <Text className="mb-3 text-sm leading-5 text-muted">
        AI Şef mümkün olduğunca bu malzemeleri kullanarak tarif oluşturur.
      </Text>

      <AppInput
        value={value}
        onChangeText={setValue}
        placeholder="Örn. Tavuk, mantar veya patates"
        onSubmitEditing={handleAdd}
        returnKeyType="done"
      />

      <View className="mt-3">
        <AppButton
          title="Malzemeyi Ekle"
          variant="outline"
          onPress={handleAdd}
          disabled={!value.trim()}
        />
      </View>

      {ingredients.length > 0 ? (
        <View className="mt-4 flex-row flex-wrap gap-2">
          {ingredients.map((ingredient) => (
            <TouchableOpacity
              key={ingredient}
              onPress={() => handleRemove(ingredient)}
              activeOpacity={0.8}
              className="flex-row items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-2"
            >
              <Text className="text-sm font-medium text-primary">
                {ingredient}
              </Text>

              <Ionicons
                name="close"
                size={16}
                color="#E85D04"
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}
