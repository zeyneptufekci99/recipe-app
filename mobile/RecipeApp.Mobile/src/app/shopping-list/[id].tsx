import {
  AppButton,
  AppCard,
  AppScreen,
  ConfirmDialog,
  EmptyState,
  LoadingSpinner,
  PageHeader,
} from "@/components";
import {
  useDeleteShoppingListItemMutation,
  useGetShoppingListByIdQuery,
  useToggleShoppingListItemMutation,
} from "@/features/shopping-list/api";
import { RecipePickerModal } from "@/features/shopping-list/components/recipe-picker-modal";
import { toastService } from "@/services/toast-service";
import type { ShoppingListItem } from "@/types/shopping-list";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ShoppingListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showRecipePicker, setShowRecipePicker] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShoppingListItem | null>(
    null,
  );

  const {
    data: shoppingList,
    isLoading,
    error,
  } = useGetShoppingListByIdQuery(id);

  const [toggleItem, { isLoading: isToggling }] =
    useToggleShoppingListItemMutation();

  const [deleteItem, { isLoading: isDeleting }] =
    useDeleteShoppingListItemMutation();

  const handleToggle = async (itemId: string) => {
    if (!shoppingList || isToggling) return;

    try {
      await toggleItem({
        shoppingListId: shoppingList.id,
        itemId,
      }).unwrap();
    } catch (toggleError) {
      console.log("Toggle shopping item error:", toggleError);

      toastService.error("Madde güncellenemedi", "Lütfen tekrar deneyin.");
    }
  };

  const handleDelete = async () => {
    if (!shoppingList || !selectedItem) return;

    try {
      await deleteItem({
        shoppingListId: shoppingList.id,
        itemId: selectedItem.id,
      }).unwrap();

      toastService.success(
        "Madde silindi",
        "Alışveriş listesinden kaldırıldı.",
      );

      setSelectedItem(null);
    } catch (deleteError) {
      console.log("Delete shopping item error:", deleteError);

      toastService.error("Madde silinemedi", "Lütfen tekrar deneyin.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !shoppingList) {
    return (
      <AppScreen>
        <PageHeader title="Alışveriş Listesi" />

        <AppCard>
          <Text className="text-center text-danger">
            Alışveriş listesi yüklenemedi.
          </Text>
        </AppCard>
      </AppScreen>
    );
  }

  const completedCount = shoppingList.items.filter(
    (item) => item.isCompleted,
  ).length;

  const totalCount = shoppingList.items.length;

  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <AppScreen>
      <PageHeader title={shoppingList.name} />

      <AppCard className="mb-5">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-muted">İlerleme</Text>

            <Text className="mt-1 text-2xl font-bold text-text">
              {completedCount}/{totalCount}
            </Text>
          </View>

          <Text className="text-2xl font-bold text-primary">%{progress}</Text>
        </View>

        <View className="mt-4 h-2 overflow-hidden rounded-full bg-background">
          <View
            className="h-full rounded-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </View>
      </AppCard>

      {shoppingList.items.length === 0 ? (
        <EmptyState
          title="Liste henüz boş"
          description="Bir tarifin malzemelerini bu listeye ekleyerek başlayabilirsin."
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-3 pb-10"
        >
          {shoppingList.items.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleToggle(item.id)}
              onLongPress={() => setSelectedItem(item)}
              activeOpacity={0.85}
              disabled={isToggling}
            >
              <AppCard
                className={
                  item.isCompleted
                    ? "border-success/30 bg-success/10"
                    : undefined
                }
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className={
                      item.isCompleted
                        ? "h-7 w-7 items-center justify-center rounded-full bg-success"
                        : "h-7 w-7 items-center justify-center rounded-full border-2 border-border"
                    }
                  >
                    {item.isCompleted ? (
                      <Ionicons name="checkmark" size={17} color="#FFFFFF" />
                    ) : null}
                  </View>

                  <View className="flex-1">
                    <Text
                      className={
                        item.isCompleted
                          ? "text-base font-semibold text-muted line-through"
                          : "text-base font-semibold text-text"
                      }
                    >
                      {item.name}
                    </Text>

                    {item.amount ? (
                      <Text
                        className={
                          item.isCompleted
                            ? "mt-1 text-sm text-muted line-through"
                            : "mt-1 text-sm text-muted"
                        }
                      >
                        {item.amount}
                      </Text>
                    ) : null}
                  </View>

                  <Ionicons
                    name="ellipsis-horizontal"
                    size={20}
                    color="#7A7A7A"
                  />
                </View>
              </AppCard>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View className="mt-auto pt-4">
        <AppButton
          title="Tariflerden Malzeme Ekle"
          variant="outline"
          onPress={() => setShowRecipePicker(true)}
        />
      </View>

      <ConfirmDialog
        visible={selectedItem !== null}
        title="Maddeyi Sil"
        description={
          selectedItem
            ? `"${selectedItem.name}" alışveriş listesinden kaldırılacak.`
            : ""
        }
        confirmText="Maddeyi Sil"
        cancelText="Vazgeç"
        variant="danger"
        loading={isDeleting}
        onCancel={() => setSelectedItem(null)}
        onConfirm={handleDelete}
      />
      <RecipePickerModal
        visible={showRecipePicker}
        shoppingListId={shoppingList.id}
        onClose={() => setShowRecipePicker(false)}
      />
    </AppScreen>
  );
}
