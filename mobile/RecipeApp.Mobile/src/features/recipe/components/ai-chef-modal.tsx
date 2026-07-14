import { AppButton, AppCard, AppInput, IconButton } from "@/components";
import { useAskRecipeAssistantMutation } from "@/features/recipe/api";
import { toastService } from "@/services/toast-service";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AiChefModalProps {
  visible: boolean;
  recipeId: string;
  onClose: () => void;
}

const EXAMPLE_QUESTIONS = [
  "Evde krema yok, yerine ne kullanabilirim?",
  "Bu tarifi airfryer'da yapabilir miyim?",
  "Yanına ne iyi gider?",
  "Daha az baharatlı nasıl yapabilirim?",
];

export function AiChefModal({ visible, recipeId, onClose }: AiChefModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [askAi, { isLoading }] = useAskRecipeAssistantMutation();

  const handleClose = () => {
    if (isLoading) return;

    setQuestion("");
    setAnswer("");
    onClose();
  };

  const handleAsk = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      toastService.error("Soru gerekli", "AI Şef'e bir soru yazmalısın.");

      return;
    }

    try {
      const result = await askAi({
        recipeId,
        body: {
          question: trimmedQuestion,
        },
      }).unwrap();

      setAnswer(result.answer);
    } catch (error) {
      console.log("Ask AI Chef error:", error);

      toastService.error(
        "Cevap alınamadı",
        "AI Şef şu anda cevap veremedi. Lütfen tekrar dene.",
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
        className="flex-1 items-center justify-center bg-black/50 px-5 py-8"
        onPress={handleClose}
      >
        <Pressable
          className="w-full max-w-md"
          onPress={(event) => event.stopPropagation()}
        >
          <AppCard className="max-h-[88vh] p-6">
            <View className="mb-5 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xl font-bold text-text">AI Şef</Text>

                <Text className="mt-2 text-sm leading-5 text-muted">
                  Bu tarif hakkında malzeme alternatifleri, pişirme yöntemi veya
                  servis önerileri sorabilirsin.
                </Text>
              </View>

              <IconButton
                icon="close"
                onPress={handleClose}
                disabled={isLoading}
                accessibilityLabel="AI Şef penceresini kapat"
              />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View className="mb-5 flex-row flex-wrap gap-2">
                {EXAMPLE_QUESTIONS.map((example) => (
                  <TouchableOpacity
                    key={example}
                    onPress={() => {
                      setQuestion(example);
                      setAnswer("");
                    }}
                    disabled={isLoading}
                    className="rounded-full border border-border bg-background px-3 py-2"
                  >
                    <Text className="text-sm font-medium text-text">
                      {example}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <AppInput
                label="Ne sormak istiyorsun?"
                value={question}
                onChangeText={(value) => {
                  setQuestion(value);
                  setAnswer("");
                }}
                placeholder="Örn. Krema yerine ne kullanabilirim?"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="min-h-28"
              />

              <View className="mt-5">
                <AppButton
                  title={isLoading ? "Düşünüyor..." : "AI Şef'e Sor"}
                  onPress={handleAsk}
                  disabled={isLoading || !question.trim()}
                />
              </View>

              {answer ? (
                <View className="mt-6 rounded-2xl border border-primary/20 bg-primary/10 p-4">
                  <Text className="mb-2 text-sm font-bold text-primary">
                    {`AI Şef'in cevabı`}
                  </Text>

                  <Text className="text-base leading-6 text-text">
                    {answer}
                  </Text>
                </View>
              ) : null}
            </ScrollView>
          </AppCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
