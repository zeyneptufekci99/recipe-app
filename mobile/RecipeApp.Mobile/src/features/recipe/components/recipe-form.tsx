import { useGetCategoriesQuery } from "@/features/category/category-api";
import { CategorySelector } from "@/features/category/components/category-selector";
import {
  CreateIngredientRequest,
  CreateRecipeStepRequest,
} from "@/types/recipe";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity } from "react-native";
import { useCreateRecipeMutation } from "../recipe-api";
import { DifficultySelector } from "./difficulty-selector";
import { IngredientEditor } from "./ingredient-editor";
import { RecipeBasicInfo } from "./recipe-basic-info";
import { RecipeTimeInputs } from "./recipe-time-inputs";
import { StepEditor } from "./step-editor";

export function RecipeForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [ingredients, setIngredients] = useState<CreateIngredientRequest[]>([
    {
      name: "",
      amount: "",
    },
  ]);
  const [steps, setSteps] = useState<CreateRecipeStepRequest[]>([
    {
      stepNumber: 1,
      description: "",
    },
  ]);
  const [difficulty, setDifficulty] = useState(1);

  const { data: categories } = useGetCategoriesQuery();
  const [createRecipe, { isLoading }] = useCreateRecipeMutation();

  const handleSubmit = async () => {
    try {
      if (!title.trim()) {
        Alert.alert("Hata", "Tarif adı zorunludur.");
        return;
      }

      if (!categoryId) {
        Alert.alert("Hata", "Kategori seçmelisin.");
        return;
      }

      await createRecipe({
        title,
        description,
        imageUrl: "",
        prepTime: Number(prepTime) || 0,
        cookTime: Number(cookTime) || 0,
        servings: Number(servings) || 1,
        difficulty,
        categoryId,
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
      <RecipeBasicInfo
        title={title}
        description={description}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
      />

      <RecipeTimeInputs
        prepTime={prepTime}
        cookTime={cookTime}
        servings={servings}
        onPrepTimeChange={setPrepTime}
        onCookTimeChange={setCookTime}
        onServingsChange={setServings}
      />

      <CategorySelector
        categories={categories ?? []}
        selectedCategoryId={categoryId}
        onSelect={setCategoryId}
      />

      <IngredientEditor ingredients={ingredients} onChange={setIngredients} />

      <StepEditor steps={steps} onChange={setSteps} />

      <DifficultySelector value={difficulty} onChange={setDifficulty} />

      <TouchableOpacity
        onPress={handleSubmit}
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
