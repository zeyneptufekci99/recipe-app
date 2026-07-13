import {
  AppButton,
  AppCard,
  AppInput,
  AppScreen,
  ConfirmDialog,
  EmptyState,
  LoadingSpinner,
  PageHeader,
} from "@/components";
import {
  useCreateShoppingListMutation,
  useDeleteShoppingListMutation,
  useGetShoppingListsQuery,
} from "@/features/shopping-list/api";
import { toastService } from "@/services/toast-service";
import type { ShoppingListSummary } from "@/types/shopping-list";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ShoppingListsScreen() {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [selectedList, setSelectedList] = useState<ShoppingListSummary | null>(
    null,
  );

  const {
    data: shoppingLists = [],
    isLoading,
    error,
  } = useGetShoppingListsQuery();

  const [createShoppingList, { isLoading: isCreating }] =
    useCreateShoppingListMutation();

  const [deleteShoppingList, { isLoading: isDeleting }] =
    useDeleteShoppingListMutation();

  const handleCreate = async () => {
    const trimmedName = newListName.trim();

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
      }).unwrap();

      setNewListName("");
      setIsCreateModalVisible(false);

      toastService.success("Liste oluşturuldu", "Yeni alışveriş listen hazır.");

      router.push(`/shopping-list/${createdList.id}`);
    } catch (createError) {
      console.log("Create shopping list error:", createError);

      toastService.error("Liste oluşturulamadı", "Lütfen tekrar deneyin.");
    }
  };

  const handleDelete = async () => {
    if (!selectedList) return;

    try {
      await deleteShoppingList(selectedList.id).unwrap();

      toastService.success("Liste silindi", "Alışveriş listesi kaldırıldı.");

      setSelectedList(null);
    } catch (deleteError) {
      console.log("Delete shopping list error:", deleteError);

      toastService.error("Liste silinemedi", "Lütfen tekrar deneyin.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <AppScreen>
      <PageHeader
        title="Alışveriş Listeleri"
        rightContent={
          <TouchableOpacity
            onPress={() => setIsCreateModalVisible(true)}
            activeOpacity={0.8}
            className="h-10 w-10 items-center justify-center rounded-full bg-primary"
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      {error ? (
        <AppCard>
          <Text className="text-center text-danger">
            Alışveriş listeleri yüklenemedi.
          </Text>
        </AppCard>
      ) : shoppingLists.length === 0 ? (
        <EmptyState
          title="Henüz alışveriş listen yok"
          description="İlk alışveriş listeni oluşturarak tarif malzemelerini tek yerde topla."
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-3 pb-10"
        >
          {shoppingLists.map((list) => {
            const progress =
              list.itemCount === 0
                ? 0
                : Math.round((list.completedItemCount / list.itemCount) * 100);

            return (
              <TouchableOpacity
                key={list.id}
                activeOpacity={0.85}
                onPress={() => router.push(`/shopping-list/${list.id}`)}
                onLongPress={() => setSelectedList(list)}
              >
                <AppCard>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-text">
                        {list.name}
                      </Text>

                      <Text className="mt-1 text-sm text-muted">
                        {list.completedItemCount}/{list.itemCount} tamamlandı
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text className="text-lg font-bold text-primary">
                        %{progress}
                      </Text>

                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#7A7A7A"
                      />
                    </View>
                  </View>

                  <View className="mt-4 h-2 overflow-hidden rounded-full bg-background">
                    <View
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progress}%` }}
                    />
                  </View>
                </AppCard>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <Modal
        visible={isCreateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/40 px-6"
          onPress={() => setIsCreateModalVisible(false)}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="w-full max-w-md"
          >
            <AppCard className="p-6">
              <Text className="text-xl font-bold text-text">
                Yeni Alışveriş Listesi
              </Text>

              <Text className="mb-5 mt-2 text-sm text-muted">
                Listeye kısa ve anlaşılır bir isim ver.
              </Text>

              <AppInput
                label="Liste adı"
                value={newListName}
                onChangeText={setNewListName}
                placeholder="Örn. Haftalık Market"
                autoFocus
                maxLength={100}
              />

              <View className="mt-6 gap-3">
                <AppButton
                  title={isCreating ? "Oluşturuluyor..." : "Liste Oluştur"}
                  onPress={handleCreate}
                  disabled={isCreating || !newListName.trim()}
                />

                <AppButton
                  title="Vazgeç"
                  variant="outline"
                  onPress={() => {
                    setNewListName("");
                    setIsCreateModalVisible(false);
                  }}
                  disabled={isCreating}
                />
              </View>
            </AppCard>
          </Pressable>
        </Pressable>
      </Modal>

      <ConfirmDialog
        visible={selectedList !== null}
        title="Listeyi Sil"
        description={
          selectedList
            ? `"${selectedList.name}" ve içindeki tüm maddeler kalıcı olarak silinecek.`
            : ""
        }
        confirmText="Listeyi Sil"
        cancelText="Vazgeç"
        variant="danger"
        loading={isDeleting}
        onCancel={() => setSelectedList(null)}
        onConfirm={handleDelete}
      />
    </AppScreen>
  );
}
