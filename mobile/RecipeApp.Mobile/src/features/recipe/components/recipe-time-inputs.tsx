import { AppInput } from "@/components";
import type { RecipeFormValues } from "@/features/recipe/schemas/recipe-form-schema";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Text, View } from "react-native";

interface RecipeTimeInputsProps {
  control: Control<RecipeFormValues>;
  errors: FieldErrors<RecipeFormValues>;
}

export function RecipeTimeInputs({ control, errors }: RecipeTimeInputsProps) {
  return (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <Text className="mb-2 text-base font-semibold text-text">Prep</Text>

        <Controller
          control={control}
          name="prepTime"
          render={({ field: { value, onChange } }) => (
            <AppInput
              label="Prep"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholder="10"
              error={errors.prepTime?.message}
            />
          )}
        />

        {errors.prepTime ? (
          <Text className="mt-1 text-xs text-danger">
            {errors.prepTime.message}
          </Text>
        ) : null}
      </View>

      <View className="flex-1">
        <Text className="mb-2 text-base font-semibold text-text">Cook</Text>

        <Controller
          control={control}
          name="cookTime"
          render={({ field: { value, onChange } }) => (
            <AppInput
              label="Cook"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholder="20"
              error={errors.cookTime?.message}
            />
          )}
        />

        {errors.cookTime ? (
          <Text className="mt-1 text-xs text-danger">
            {errors.cookTime.message}
          </Text>
        ) : null}
      </View>

      <View className="flex-1">
        <Text className="mb-2 text-base font-semibold text-text">Servings</Text>

        <Controller
          control={control}
          name="servings"
          render={({ field: { value, onChange } }) => (
            <AppInput
              label="Servings"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholder="2"
              error={errors.servings?.message}
            />
          )}
        />

        {errors.servings ? (
          <Text className="mt-1 text-xs text-danger">
            {errors.servings.message}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
