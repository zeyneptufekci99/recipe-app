import { AppLink, AppScreen, PageHeader } from "@/components";
import { RecipeForm } from "@/features/recipe/components/recipe-form";
import type { ImportedRecipe } from "@/types/recipe";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function CreateRecipeScreen() {
  const { importedRecipe } = useLocalSearchParams<{
    importedRecipe?: string;
  }>();

  let parsedImportedRecipe: ImportedRecipe | undefined;

  if (importedRecipe) {
    try {
      parsedImportedRecipe = JSON.parse(importedRecipe);
    } catch (error) {
      console.log("Imported recipe parse error:", error);
    }
  }

  return (
    <AppScreen>
      <PageHeader
        title="Yeni Tarif"
        canGoBack={false}
        rightContent={<AppLink title="Kapat" onPress={() => router.back()} />}
      />

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
