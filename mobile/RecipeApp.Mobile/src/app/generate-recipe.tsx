import {
  AppButton,
  AppInput,
  AppScreen,
  PageHeader,
  PromptChip,
} from "@/components";
import { AI_PROMPTS } from "@/constants/ai-prompts";
import { useGenerateRecipeWithAiMutation } from "@/features/recipe/api";
import { toastService } from "@/services/toast-service";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function GenerateRecipeScreen() {
  const [prompt, setPrompt] = useState("");

  const [generateRecipe, { isLoading }] = useGenerateRecipeWithAiMutation();

  const handleGenerate = async () => {
    try {
      const recipe = await generateRecipe({
        prompt: prompt.trim(),
      }).unwrap();

      router.push({
        pathname: "/recipe/create",
        params: {
          importedRecipe: JSON.stringify(recipe),
        },
      });
    } catch (error) {
      console.log("Generate recipe error:", error);

      toastService.error(
        "Tarif oluşturulamadı",
        "AI servisi şu anda tarif oluşturamadı.",
      );
    }
  };

  return (
    <AppScreen>
      <PageHeader title="AI ile Tarif Oluştur" />

      <View className="gap-5">
        <View>
          <Text className="mb-2 text-base font-semibold text-text">
            Nasıl bir tarif istiyorsun?
          </Text>

          <Text className="mb-3 text-sm text-muted">
            Malzemeleri, porsiyonu veya istediğin yemek türünü yazabilirsin.
          </Text>
          <View className="mb-5 flex-row flex-wrap gap-2">
            {AI_PROMPTS.map((item) => (
              <PromptChip
                key={item.title}
                title={item.title}
                onPress={() => setPrompt(item.prompt)}
              />
            ))}
          </View>
          <AppInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Örn. 4 kişilik, kolay ve kremalı mantarlı makarna"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="min-h-32"
          />
          <Text className="mt-3 text-sm text-muted">
            {`Örnek: "4 kişilik tavuklu makarna", "yüksek proteinli kahvaltı", "airfryer tarifi", "glutensiz tatlı"`}
          </Text>
        </View>

        <AppButton
          title={isLoading ? "Tarif oluşturuluyor..." : "Tarif Oluştur"}
          onPress={handleGenerate}
          disabled={isLoading || !prompt.trim()}
        />
      </View>
    </AppScreen>
  );
}
