import { AppButton, AppCard, AppInput, IconButton } from "@/components";
import { useTransformRecipeWithAiMutation } from "@/features/meal-plan/api";

import { toastService } from "@/services/toast-service";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface AiTransformRecipeModalProps {
  visible: boolean;
  recipeId: string;
  onClose: () => void;
}

const EXAMPLE_INSTRUCTIONS = [
  "Bu tarifi 2 kişilik yap.",
  "Daha yüksek proteinli hale getir.",
  "Vegan hale getir.",
  "20 dakikanın altında hazırlanacak şekilde düzenle.",
];

export function AiTransformRecipeModal({
  visible,
  recipeId,
  onClose,
}: AiTransformRecipeModalProps) {
  const [instruction, setInstruction] = useState("");

  const [transformRecipe, { isLoading }] = useTransformRecipeWithAiMutation();

  const handleClose = () => {
    if (isLoading) return;

    setInstruction("");
    onClose();
  };

  const handleTransform = async () => {
    const trimmedInstruction = instruction.trim();

    if (!trimmedInstruction) {
      toastService.error(
        "Düzenleme talebi gerekli",
        "Tarifte neyi değiştirmek istediğini yazmalısın.",
      );

      return;
    }

    try {
      const transformedRecipe = await transformRecipe({
        recipeId,
        body: {
          instruction: trimmedInstruction,
        },
      }).unwrap();

      setInstruction("");
      onClose();

      router.push({
        pathname: "/recipe/edit/[id]",
        params: {
          id: recipeId,
          transformedRecipe: JSON.stringify(transformedRecipe),
        },
      });
    } catch (error) {
      console.log("Transform recipe error:", error);

      toastService.error(
        "Tarif düzenlenemedi",
        "AI servisi tarifi düzenleyemedi. Lütfen tekrar dene.",
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/40 px-5"
        onPress={handleClose}
      >
        <Pressable
          className="w-full max-w-md"
          onPress={(event) => event.stopPropagation()}
        >
          <AppCard className="p-6">
            <View className="mb-5 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xl font-bold text-text">
                  AI ile Düzenle
                </Text>

                <Text className="mt-2 text-sm leading-5 text-muted">
                  Tarifte değiştirmek istediğin şeyi yaz. Sonucu kaydetmeden
                  önce kontrol edebilirsin.
                </Text>
              </View>

              <IconButton
                icon="close"
                onPress={handleClose}
                disabled={isLoading}
                accessibilityLabel="AI düzenleme penceresini kapat"
              />
            </View>

            <View className="mb-5 flex-row flex-wrap gap-2">
              {EXAMPLE_INSTRUCTIONS.map((example) => (
                <Pressable
                  key={example}
                  onPress={() => setInstruction(example)}
                  disabled={isLoading}
                  className="rounded-full border border-border bg-background px-3 py-2"
                >
                  <Text className="text-sm font-medium text-text">
                    {example}
                  </Text>
                </Pressable>
              ))}
            </View>

            <AppInput
              label="Ne değiştirmek istiyorsun?"
              value={instruction}
              onChangeText={setInstruction}
              placeholder="Örn. Bu tarifi 2 kişilik ve daha yüksek proteinli yap."
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              className="min-h-32"
            />

            <View className="mt-6 gap-3">
              <AppButton
                title={isLoading ? "Tarif düzenleniyor..." : "AI ile Düzenle"}
                onPress={handleTransform}
                disabled={isLoading || !instruction.trim()}
              />

              <AppButton
                title="Vazgeç"
                variant="outline"
                onPress={handleClose}
                disabled={isLoading}
              />
            </View>
          </AppCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
