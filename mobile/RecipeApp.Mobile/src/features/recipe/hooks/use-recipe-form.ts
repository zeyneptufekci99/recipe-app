import { useGetCategoriesQuery } from "@/features/category/category-api";
import {
  recipeFormSchema,
  type RecipeFormValues,
} from "@/features/recipe/schemas/recipe-form-schema";
import { toastService } from "@/services/toast-service";
import { uploadService } from "@/services/upload-service";
import type {
  CreateIngredientRequest,
  CreateRecipeStepRequest,
  ImportedRecipe,
  RecipeDetail,
} from "@/types/recipe";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useCreateRecipeMutation, useUpdateRecipeMutation } from "../api";

interface UseRecipeFormParams {
  recipe?: RecipeDetail;
  importedRecipe?: ImportedRecipe;
  mode?: "create" | "edit";
}

export function useRecipeForm({
  recipe,
  importedRecipe,
  mode = "create",
}: UseRecipeFormParams) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: recipe?.title ?? importedRecipe?.title ?? "",
      description: recipe?.description ?? importedRecipe?.description ?? "",
      prepTime:
        recipe?.prepTime?.toString() ??
        importedRecipe?.prepTime?.toString() ??
        "",
      cookTime:
        recipe?.cookTime?.toString() ??
        importedRecipe?.cookTime?.toString() ??
        "",
      servings:
        recipe?.servings?.toString() ??
        importedRecipe?.servings?.toString() ??
        "",
      difficulty: recipe?.difficulty ?? 1,
      categoryId: recipe?.categoryId ?? "",
    },
  });

  const [ingredients, setIngredients] = useState<CreateIngredientRequest[]>(
    recipe?.ingredients?.length
      ? recipe.ingredients.map((ingredient) => ({
          name: ingredient.name,
          amount: ingredient.amount ?? "",
        }))
      : importedRecipe?.ingredients?.length
        ? importedRecipe.ingredients
        : [{ name: "", amount: "" }],
  );

  const [steps, setSteps] = useState<CreateRecipeStepRequest[]>(
    recipe?.steps?.length
      ? recipe.steps.map((step) => ({
          stepNumber: step.stepNumber,
          description: step.description,
        }))
      : importedRecipe?.steps?.length
        ? importedRecipe.steps
        : [{ stepNumber: 1, description: "" }],
  );

  const [imageUri, setImageUri] = useState(
    recipe?.imageUrl ?? importedRecipe?.imageUrl ?? "",
  );

  const categoryId = useWatch({
    control,
    name: "categoryId",
  });
  const difficulty = useWatch({
    control,
    name: "difficulty",
  });

  const { data: categories } = useGetCategoriesQuery();
  const [createRecipe, { isLoading: isCreating }] = useCreateRecipeMutation();
  const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation();

  const isLoading = isCreating || isUpdating;

  const onSubmit = async (values: RecipeFormValues) => {
    try {
      const validIngredients = ingredients.filter((i) => i.name.trim());
      const validSteps = steps.filter((s) => s.description.trim());

      if (validIngredients.length === 0) {
        toastService.error(
          "Ingredient error",
          "En az bir malzeme eklemelisin.",
        );
        return;
      }

      if (validSteps.length === 0) {
        toastService.error("Step error", "En az bir adım eklemelisin.");
        return;
      }

      let uploadedImageUrl = "";

      if (
        imageUri &&
        !imageUri.startsWith("/uploads/") &&
        !imageUri.startsWith("http")
      ) {
        uploadedImageUrl = await uploadService.uploadImage(imageUri);
      }

      const body = {
        title: values.title,
        description: values.description,
        imageUrl: uploadedImageUrl || recipe?.imageUrl || imageUri || "",
        prepTime: Number(values.prepTime) || 0,
        cookTime: Number(values.cookTime) || 0,
        servings: Number(values.servings) || 1,
        difficulty: values.difficulty,
        categoryId: values.categoryId,
        sourceType: 1,
        sourceUrl: "",
        ingredients: validIngredients,
        steps: validSteps.map((step, index) => ({
          ...step,
          stepNumber: index + 1,
        })),
      };

      if (mode === "edit" && recipe) {
        await updateRecipe({
          id: recipe.id,
          body,
        }).unwrap();

        toastService.success(
          "Recipe updated",
          "You have successfully updated the recipe.",
        );
      } else {
        await createRecipe(body).unwrap();

        toastService.success("Recipe created", "Your recipe has been saved.");
      }

      router.back();
    } catch (error) {
      console.log("Recipe form submit error:", error);
      toastService.error("Recipe error", "Tarif kaydedilemedi.");
    }
  };

  const onInvalid = () => {
    toastService.error("Form eksik", "Lütfen zorunlu alanları kontrol et.");
  };

  return {
    control,
    errors,
    categoryId,
    difficulty,
    categories: categories ?? [],
    ingredients,
    setIngredients,
    steps,
    setSteps,
    imageUri,
    setImageUri,
    setValue,
    isLoading,
    handleFormSubmit: handleSubmit(onSubmit, onInvalid),
  };
}
