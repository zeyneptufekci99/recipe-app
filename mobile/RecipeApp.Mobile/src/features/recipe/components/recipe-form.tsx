import { AppButton, ImagePicker } from "@/components";
import { CategorySelector } from "@/features/category/components/category-selector";
import type { ImportedRecipe, RecipeDetail } from "@/types/recipe";
import { ScrollView, Text } from "react-native";
import { useRecipeForm } from "../hooks/use-recipe-form";
import { DifficultySelector } from "./difficulty-selector";
import { IngredientEditor } from "./ingredient-editor";
import { RecipeBasicInfo } from "./recipe-basic-info";
import { RecipeTimeInputs } from "./recipe-time-inputs";
import { StepEditor } from "./step-editor";

interface RecipeFormProps {
  recipe?: RecipeDetail;
  importedRecipe?: ImportedRecipe;
  mode?: "create" | "edit";
}

export function RecipeForm({
  recipe,
  importedRecipe,
  mode = "create",
}: RecipeFormProps) {
  const {
    control,
    errors,
    categoryId,
    difficulty,
    categories,
    ingredients,
    setIngredients,
    steps,
    setSteps,
    imageUri,
    setImageUri,
    setValue,
    isLoading,
    handleFormSubmit,
  } = useRecipeForm({
    recipe,
    importedRecipe,
    mode,
  });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName="gap-5 pb-10"
    >
      <RecipeBasicInfo control={control} errors={errors} />

      <RecipeTimeInputs control={control} errors={errors} />

      <CategorySelector
        categories={categories}
        selectedCategoryId={categoryId}
        onSelect={(id) => setValue("categoryId", id ?? "")}
      />

      {errors.categoryId ? (
        <Text className="text-sm text-danger">{errors.categoryId.message}</Text>
      ) : null}

      <DifficultySelector
        value={difficulty}
        onChange={(value) => setValue("difficulty", value)}
      />

      <IngredientEditor ingredients={ingredients} onChange={setIngredients} />

      <StepEditor steps={steps} onChange={setSteps} />

      <ImagePicker imageUri={imageUri} onChange={setImageUri} />

      <AppButton
        title={isLoading ? "Kaydediliyor..." : "Tarifi Kaydet"}
        onPress={handleFormSubmit}
        disabled={isLoading}
      />
    </ScrollView>
  );
}
