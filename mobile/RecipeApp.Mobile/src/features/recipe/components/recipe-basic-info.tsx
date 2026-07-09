import { AppInput } from "@/components";
import type { RecipeFormValues } from "@/features/recipe/schemas/recipe-form-schema";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Text, View } from "react-native";

interface RecipeBasicInfoProps {
  control: Control<RecipeFormValues>;
  errors: FieldErrors<RecipeFormValues>;
}

export function RecipeBasicInfo({ control, errors }: RecipeBasicInfoProps) {
  return (
    <>
      <View>
        <Text className="mb-2 text-base font-semibold text-text">Title</Text>

        <Controller
          control={control}
          name="title"
          render={({ field: { value, onChange } }) => (
            <AppInput
              label="Title"
              value={value}
              onChangeText={onChange}
              placeholder="Recipe title"
              error={errors.title?.message}
            />
          )}
        />

        {errors.title ? (
          <Text className="mt-1 text-sm text-danger">
            {errors.title.message}
          </Text>
        ) : null}
      </View>

      <View>
        <Text className="mb-2 text-base font-semibold text-text">
          Description
        </Text>

        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <AppInput
              label="Description"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder="Describe your recipe..."
              className="min-h-32"
              error={errors.description?.message}
            />
          )}
        />
      </View>
    </>
  );
}
