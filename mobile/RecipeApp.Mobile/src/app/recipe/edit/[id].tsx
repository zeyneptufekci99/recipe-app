import { AppScreen, LoadingSpinner, PageHeader } from "@/components";
import { useGetRecipeByIdQuery } from "@/features/recipe/api";
import { RecipeForm } from "@/features/recipe/components/recipe-form";
import type { ImportedRecipe, RecipeDetail } from "@/types/recipe";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function EditRecipeScreen() {
  const { id, transformedRecipe } = useLocalSearchParams<{
    id: string;
    transformedRecipe?: string;
  }>();

  const { data, isLoading, error } = useGetRecipeByIdQuery(id);

  let parsedTransformedRecipe: ImportedRecipe | undefined;

  if (transformedRecipe) {
    try {
      parsedTransformedRecipe = JSON.parse(transformedRecipe);
    } catch (parseError) {
      console.log("Transformed recipe parse error:", parseError);
    }
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !data) {
    return (
      <AppScreen>
        <PageHeader title="Tarifi Düzenle" />

        <Text className="text-center text-danger">Tarif yüklenemedi.</Text>
      </AppScreen>
    );
  }

  const recipeForForm: RecipeDetail = parsedTransformedRecipe
    ? {
        ...data,
        title: parsedTransformedRecipe.title,
        description: parsedTransformedRecipe.description ?? null,
        imageUrl: parsedTransformedRecipe.imageUrl || data.imageUrl,
        prepTime: parsedTransformedRecipe.prepTime,
        cookTime: parsedTransformedRecipe.cookTime,
        servings: parsedTransformedRecipe.servings,
        ingredients: parsedTransformedRecipe.ingredients.map(
          (ingredient, index) => ({
            id: `ai-ingredient-${index}`,
            name: ingredient.name,
            amount: ingredient.amount ?? "",
          }),
        ),
        steps: parsedTransformedRecipe.steps.map((step, index) => ({
          id: `ai-step-${index}`,
          stepNumber: step.stepNumber,
          description: step.description,
        })),
      }
    : data;

  return (
    <AppScreen>
      <PageHeader
        title={
          parsedTransformedRecipe
            ? "AI Düzenlemesini Kontrol Et"
            : "Tarifi Düzenle"
        }
      />

      <RecipeForm recipe={recipeForForm} mode="edit" />
    </AppScreen>
  );
}
