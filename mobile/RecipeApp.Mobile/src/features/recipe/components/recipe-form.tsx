import { AppButton } from "@/components";
import { ImagePicker } from "@/components/ui/image-picker/image-picker";
import { useGetCategoriesQuery } from "@/features/category/category-api";
import { CategorySelector } from "@/features/category/components/category-selector";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text } from "react-native";
import { useCreateRecipeMutation, useUpdateRecipeMutation } from "../api";
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
    handleSubmit,
    watch,
    reset,
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

  useEffect(() => {
    if (!recipe) return;

    reset({
      title: recipe.title,
      description: recipe.description ?? "",
      categoryId: recipe.categoryId,
      prepTime: recipe.prepTime.toString(),
      cookTime: recipe.cookTime.toString(),
      servings: recipe.servings.toString(),
      difficulty: recipe.difficulty,
    });

    setIngredients(
      recipe.ingredients.length
        ? recipe.ingredients.map((i) => ({
            name: i.name,
            amount: i.amount ?? "",
          }))
        : [{ name: "", amount: "" }],
    );

    setSteps(
      recipe.steps.length
        ? recipe.steps.map((s) => ({
            stepNumber: s.stepNumber,
            description: s.description,
          }))
        : [{ stepNumber: 1, description: "" }],
    );

    setImageUri(recipe.imageUrl ?? "");
  }, [recipe, reset]);

  const categoryId = watch("categoryId");
  const difficulty = watch("difficulty");

  const [ingredients, setIngredients] = useState<CreateIngredientRequest[]>(
    recipe?.ingredients?.length
      ? recipe.ingredients.map((i) => ({
          name: i.name,
          amount: i.amount ?? "",
        }))
      : importedRecipe?.ingredients?.length
        ? importedRecipe.ingredients
        : [{ name: "", amount: "" }],
  );

  const [steps, setSteps] = useState<CreateRecipeStepRequest[]>(
    recipe?.steps?.length
      ? recipe.steps.map((s) => ({
          stepNumber: s.stepNumber,
          description: s.description,
        }))
      : importedRecipe?.steps?.length
        ? importedRecipe.steps
        : [{ stepNumber: 1, description: "" }],
  );

  const [imageUri, setImageUri] = useState(
    recipe?.imageUrl ?? importedRecipe?.imageUrl ?? "",
  );
  const { data: categories } = useGetCategoriesQuery();
  const [createRecipe, { isLoading: isCreating }] = useCreateRecipeMutation();
  const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation();

  const isLoading = isCreating || isUpdating;
  const onSubmit = async (values: RecipeFormValues) => {
    console.log("SUBMIT VALUES:", values);
    console.log("IMAGE URI:", imageUri);
    console.log("INGREDIENTS:", ingredients);
    console.log("STEPS:", steps);
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
      console.log("Create recipe error:", error);

      toastService.error("Create recipe error", "Tarif oluşturulamadı.");
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName="gap-5 pb-10"
    >
      <RecipeBasicInfo control={control} errors={errors} />

      <RecipeTimeInputs control={control} errors={errors} />

      <CategorySelector
        categories={categories ?? []}
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
        onPress={handleSubmit(onSubmit, (formErrors) => {
          console.log("FORM ERRORS:", formErrors);
          toastService.error(
            "Form eksik",
            "Lütfen zorunlu alanları kontrol et.",
          );
        })}
        disabled={isLoading}
      />
    </ScrollView>
  );
}
