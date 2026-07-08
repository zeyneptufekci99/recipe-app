import { ImagePicker } from "@/components/ui/image-picker";
import { useGetCategoriesQuery } from "@/features/category/category-api";
import { CategorySelector } from "@/features/category/components/category-selector";
import {
  recipeFormSchema,
  type RecipeFormValues,
} from "@/features/recipe/schemas/recipe-form-schema";
import { uploadService } from "@/services/upload-service";
import type {
  CreateIngredientRequest,
  CreateRecipeStepRequest,
} from "@/types/recipe";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TouchableOpacity } from "react-native";
import { useCreateRecipeMutation } from "../recipe-api";
import { DifficultySelector } from "./difficulty-selector";
import { IngredientEditor } from "./ingredient-editor";
import { RecipeBasicInfo } from "./recipe-basic-info";
import { RecipeTimeInputs } from "./recipe-time-inputs";
import { StepEditor } from "./step-editor";

export function RecipeForm() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      prepTime: "",
      cookTime: "",
      servings: "",
      difficulty: 1,
    },
  });

  const categoryId = watch("categoryId");
  const difficulty = watch("difficulty");

  const [ingredients, setIngredients] = useState<CreateIngredientRequest[]>([
    { name: "", amount: "" },
  ]);

  const [steps, setSteps] = useState<CreateRecipeStepRequest[]>([
    { stepNumber: 1, description: "" },
  ]);

  const [imageUri, setImageUri] = useState("");

  const { data: categories } = useGetCategoriesQuery();
  const [createRecipe, { isLoading }] = useCreateRecipeMutation();

  const onSubmit = async (values: RecipeFormValues) => {
    try {
      let uploadedImageUrl = "";

      if (imageUri) {
        uploadedImageUrl = await uploadService.uploadImage(imageUri);
      }

      await createRecipe({
        title: values.title,
        description: values.description,
        imageUrl: uploadedImageUrl,
        prepTime: Number(values.prepTime) || 0,
        cookTime: Number(values.cookTime) || 0,
        servings: Number(values.servings) || 1,
        difficulty: values.difficulty,
        categoryId: values.categoryId,
        sourceType: 1,
        sourceUrl: "",
        ingredients: ingredients.filter((i) => i.name.trim()),
        steps: steps
          .filter((s) => s.description.trim())
          .map((step, index) => ({
            ...step,
            stepNumber: index + 1,
          })),
      }).unwrap();

      Alert.alert("Başarılı", "Tarif oluşturuldu.");
      router.back();
    } catch (error) {
      console.log("Create recipe error:", error);
      Alert.alert("Hata", "Tarif oluşturulamadı.");
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

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        className="rounded-xl bg-primary py-4"
      >
        <Text className="text-center font-bold text-white">
          {isLoading ? "Kaydediliyor..." : "Tarifi Kaydet"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
