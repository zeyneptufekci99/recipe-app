import { AppButton, AppInput, AppScreen } from "@/components";
import { useImportRecipeFromUrlMutation } from "@/features/recipe/api";
import { toastService } from "@/services/toast-service";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ImportRecipeScreen() {
  const [url, setUrl] = useState("");

  const [importRecipe, { isLoading }] = useImportRecipeFromUrlMutation();

  const handleImport = async () => {
    try {
      const recipe = await importRecipe({ url }).unwrap();

      router.push({
        pathname: "/recipe/create",
        params: {
          importedRecipe: JSON.stringify(recipe),
        },
      });
    } catch (error) {
      console.log("Import recipe error:", error);
      toastService.error("Import failed", "Recipe could not be imported.");
    }
  };

  return (
    <AppScreen>
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-text">Import Recipe</Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text className="font-semibold text-primary">Kapat</Text>
        </TouchableOpacity>
      </View>

      <View className="gap-5">
        <AppInput
          label="Recipe URL"
          placeholder="https://..."
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
        />

        <AppButton
          title={isLoading ? "Importing..." : "Import"}
          onPress={handleImport}
          disabled={isLoading || !url.trim()}
        />
      </View>
    </AppScreen>
  );
}
