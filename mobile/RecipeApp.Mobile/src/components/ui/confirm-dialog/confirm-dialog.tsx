import { AppButton, AppCard } from "@/components";
import { Modal, Pressable, Text, View } from "react-native";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  description,
  confirmText = "Onayla",
  cancelText = "Vazgeç",
  loading = false,
  variant = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/40 px-6"
        onPress={onCancel}
      >
        <Pressable onPress={(event) => event.stopPropagation()}>
          <AppCard className="w-80 rounded-3xl p-6">
            <Text className="text-center text-xl font-bold text-text">
              {title}
            </Text>

            <Text className="mt-3 text-center text-base text-muted">
              {description}
            </Text>

            <View className="mt-8 gap-3">
              <AppButton
                title={loading ? "İşleniyor..." : confirmText}
                onPress={onConfirm}
                disabled={loading}
                variant={variant}
              />

              <AppButton
                title={cancelText}
                onPress={onCancel}
                disabled={loading}
                variant="outline"
              />
            </View>
          </AppCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
