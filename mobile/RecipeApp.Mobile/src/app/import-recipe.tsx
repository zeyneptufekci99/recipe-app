import { AppButton, AppInput, AppScreen, PageHeader } from "@/components";
import { useImportRecipeFromUrlMutation } from "@/features/recipe/api";
import { toastService } from "@/services/toast-service";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function ImportRecipeScreen() {
  const [url, setUrl] = useState("");

  const [importRecipe, { isLoading }] = useImportRecipeFromUrlMutation();

  const handleImport = async () => {
    try {
      const recipe = await importRecipe({
        url: url.trim(),
      }).unwrap();

      router.push({
        pathname: "/recipe/create",
        params: {
          importedRecipe: JSON.stringify(recipe),
        },
      });
    } catch (error) {
      console.log("Import recipe error:", error);

      toastService.error("İçe aktarma başarısız", "Tarif URL'den alınamadı.");
    }
  };

  return (
    <AppScreen>
      <PageHeader title="URL'den Tarif Aktar" />

      <View className="gap-5">
        <AppInput
          label="Tarif URL'si"
          placeholder="https://..."
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />

        <AppButton
          title={isLoading ? "Aktarılıyor..." : "Tarifi Aktar"}
          onPress={handleImport}
          disabled={isLoading || !url.trim()}
        />
      </View>
    </AppScreen>
  );
}
