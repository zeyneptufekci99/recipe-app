import { AppButton, AppCard, IconButton } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

interface RecipeAiToolsModalProps {
  visible: boolean;
  hasNutrition: boolean;
  isEstimatingNutrition: boolean;
  onClose: () => void;
  onOpenChef: () => void;
  onOpenTransform: () => void;
  onEstimateNutrition: () => void;
}

export function RecipeAiToolsModal({
  visible,
  hasNutrition,
  isEstimatingNutrition,
  onClose,
  onOpenChef,
  onOpenTransform,
  onEstimateNutrition,
}: RecipeAiToolsModalProps) {
  const handleOpenChef = () => {
    onClose();
    onOpenChef();
  };

  const handleOpenTransform = () => {
    onClose();
    onOpenTransform();
  };

  const handleEstimateNutrition = () => {
    onEstimateNutrition();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-5"
        onPress={onClose}
      >
        <Pressable
          className="w-full max-w-md"
          onPress={(event) => event.stopPropagation()}
        >
          <AppCard className="p-6">
            <View className="mb-5 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xl font-bold text-text">AI Araçları</Text>

                <Text className="mt-2 text-sm leading-5 text-muted">
                  Tarif hakkında soru sorabilir, tarifi düzenleyebilir veya
                  tahmini besin değerlerini hesaplayabilirsin.
                </Text>
              </View>

              <IconButton
                icon="close"
                onPress={onClose}
                disabled={isEstimatingNutrition}
                accessibilityLabel="AI araçlarını kapat"
              />
            </View>

            <View className="gap-3">
              <ToolButton
                icon="chatbubble-ellipses-outline"
                title="AI Şef'e Sor"
                description="Malzeme alternatifi, pişirme ve servis önerisi al."
                onPress={handleOpenChef}
                disabled={isEstimatingNutrition}
              />

              <ToolButton
                icon="sparkles-outline"
                title="AI ile Düzenle"
                description="Tarifi porsiyon, içerik veya hedefe göre değiştir."
                onPress={handleOpenTransform}
                disabled={isEstimatingNutrition}
              />

              <ToolButton
                icon="nutrition-outline"
                title={
                  isEstimatingNutrition
                    ? "Besin değerleri hesaplanıyor..."
                    : hasNutrition
                      ? "Besin Değerlerini Yeniden Hesapla"
                      : "Besin Değerlerini Hesapla"
                }
                description={
                  hasNutrition
                    ? "Mevcut tahmini değerleri yeniden oluştur."
                    : "Porsiyon başına tahmini kalori ve makroları oluştur."
                }
                onPress={handleEstimateNutrition}
                disabled={isEstimatingNutrition}
              />
            </View>

            <View className="mt-6">
              <AppButton
                title="Kapat"
                variant="outline"
                onPress={onClose}
                disabled={isEstimatingNutrition}
              />
            </View>
          </AppCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface ToolButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  disabled?: boolean;
  onPress: () => void;
}

function ToolButton({
  icon,
  title,
  description,
  disabled = false,
  onPress,
}: ToolButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      className="flex-row items-center rounded-2xl border border-border bg-background p-4"
    >
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
        <Ionicons name={icon} size={22} color="#E85D04" />
      </View>

      <View className="ml-3 flex-1">
        <Text className="font-bold text-text">{title}</Text>

        <Text className="mt-1 text-sm leading-5 text-muted">{description}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#7A7A7A" />
    </TouchableOpacity>
  );
}
