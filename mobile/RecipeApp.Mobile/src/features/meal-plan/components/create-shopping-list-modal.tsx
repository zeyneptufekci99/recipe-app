import { AppButton, AppCard, AppInput } from "@/components";

import { toastService } from "@/services/toast-service";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useCreateShoppingListFromMealPlanMutation } from "../api";

interface CreateShoppingListModalProps {
  visible: boolean;
  startDate: string;
  endDate: string;
  defaultName: string;
  onClose: () => void;
}

export function CreateShoppingListModal({
  visible,
  startDate,
  endDate,
  defaultName,
  onClose,
}: CreateShoppingListModalProps) {
  const [name, setName] = useState(defaultName);

  const [createShoppingList, { isLoading }] =
    useCreateShoppingListFromMealPlanMutation();

  const handleCreate = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      toastService.error(
        "Liste adı gerekli",
        "Alışveriş listesine bir ad vermelisin.",
      );

      return;
    }

    try {
      const createdList = await createShoppingList({
        name: trimmedName,
        startDate,
        endDate,
      }).unwrap();

      toastService.success(
        "Liste oluşturuldu",
        "Haftalık planındaki malzemeler alışveriş listesine eklendi.",
      );

      onClose();

      router.push({
        pathname: "/shopping-list/[id]",
        params: {
          id: createdList.id,
        },
      });
    } catch (error) {
      console.log("Create shopping list from meal plan error:", error);

      toastService.error("Liste oluşturulamadı", "Lütfen tekrar deneyin.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/40 px-6"
        onPress={onClose}
      >
        <Pressable
          className="w-full max-w-md"
          onPress={(event) => event.stopPropagation()}
        >
          <AppCard className="p-6">
            <Text className="text-xl font-bold text-text">
              Alışveriş Listesi Oluştur
            </Text>

            <Text className="mt-2 text-sm leading-5 text-muted">
              Seçili haftadaki tariflerin malzemeleri yeni bir alışveriş
              listesine eklenecek.
            </Text>

            <View className="mt-5">
              <AppInput
                label="Liste adı"
                value={name}
                onChangeText={setName}
                placeholder="Örn. Haftalık Market"
                maxLength={100}
              />
            </View>

            <View className="mt-6 gap-3">
              <AppButton
                title={isLoading ? "Liste oluşturuluyor..." : "Listeyi Oluştur"}
                onPress={handleCreate}
                disabled={isLoading || !name.trim()}
              />

              <AppButton
                title="Vazgeç"
                variant="outline"
                onPress={onClose}
                disabled={isLoading}
              />
            </View>
          </AppCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
