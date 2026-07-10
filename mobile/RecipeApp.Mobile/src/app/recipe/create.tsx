import { AppScreen } from "@/components";
import { RecipeForm } from "@/features/recipe/components/recipe-form";
import type { ImportedRecipe } from "@/types/recipe";
import { router, useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function CreateRecipeScreen() {
  const { importedRecipe } = useLocalSearchParams<{
    importedRecipe?: string;
  }>();

  const parsedImportedRecipe: ImportedRecipe | undefined = importedRecipe
    ? JSON.parse(importedRecipe)
    : undefined;

  return (
    <AppScreen>
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-text">Yeni Tarif</Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text className="font-semibold text-primary">Kapat</Text>
        </TouchableOpacity>
      </View>
      {parsedImportedRecipe ? (
        <View className="mb-4 rounded-2xl border border-border bg-surface p-4">
          <Text className="text-sm text-muted">
            Tarif başarıyla içe aktarıldı. Kaydetmeden önce kategori seçiniz.
          </Text>
        </View>
      ) : null}
      <RecipeForm mode="create" importedRecipe={parsedImportedRecipe} />
    </AppScreen>
  );
}
