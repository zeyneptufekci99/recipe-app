import {
  AppButton,
  AppCard,
  AppInput,
  EmptyState,
  LoadingSpinner,
} from "@/components";
import {
  useAddRecipeToShoppingListMutation,
  useCreateShoppingListMutation,
  useGetShoppingListsQuery,
} from "@/features/shopping-list/api";
import { toastService } from "@/services/toast-service";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AddToShoppingListModalProps {
  visible: boolean;
  recipeId: string;
  onClose: () => void;
}

export function AddToShoppingListModal({
  visible,
  recipeId,
  onClose,
}: AddToShoppingListModalProps) {
  const [newListName, setNewListName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const {
    data: shoppingLists = [],
    isLoading,
    error,
  } = useGetShoppingListsQuery(undefined, {
    skip: !visible,
  });

  const [addRecipeToShoppingList, { isLoading: isAdding }] =
    useAddRecipeToShoppingListMutation();

  const [createShoppingList, { isLoading: isCreating }] =
    useCreateShoppingListMutation();

  const handleAdd = async (shoppingListId: string) => {
    try {
      setSelectedListId(shoppingListId);

      await addRecipeToShoppingList({
        shoppingListId,
        recipeId,
      }).unwrap();

      toastService.success(
        "Listeye eklendi",
        "Tarifin malzemeleri alışveriş listesine eklendi.",
      );

      handleClose();
    } catch (addError) {
      console.log("Add recipe to shopping list error:", addError);

      toastService.error("Malzemeler eklenemedi", "Lütfen tekrar deneyin.");
    } finally {
      setSelectedListId(null);
    }
  };

  const handleCreateAndAdd = async () => {
    const trimmedName = newListName.trim();

    if (!trimmedName) {
      toastService.error(
        "Liste adı gerekli",
        "Yeni listeye bir ad vermelisin.",
      );
      return;
    }

    try {
      const createdList = await createShoppingList({
        name: trimmedName,
      }).unwrap();

      await addRecipeToShoppingList({
        shoppingListId: createdList.id,
        recipeId,
      }).unwrap();

      toastService.success(
        "Liste oluşturuldu",
        "Yeni liste oluşturuldu ve malzemeler eklendi.",
      );

      handleClose();
    } catch (createError) {
      console.log("Create and add shopping list error:", createError);

      toastService.error(
        "İşlem başarısız",
        "Liste oluşturulamadı veya malzemeler eklenemedi.",
      );
    }
  };

  const handleClose = () => {
    if (isAdding || isCreating) return;

    setNewListName("");
    setShowCreateForm(false);
    setSelectedListId(null);
    onClose();
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
          onPress={(event) => event.stopPropagation()}
          className="w-full max-w-md"
        >
          <AppCard className="max-h-[80vh] p-6">
            <View className="mb-5 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xl font-bold text-text">
                  Alışveriş Listesine Ekle
                </Text>

                <Text className="mt-2 text-sm text-muted">
                  Tarifin tüm malzemelerinin ekleneceği listeyi seç.
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleClose}
                disabled={isAdding || isCreating}
                className="h-9 w-9 items-center justify-center rounded-full bg-background"
              >
                <Ionicons name="close" size={21} color="#7A7A7A" />
              </TouchableOpacity>
            </View>

            {showCreateForm ? (
              <View>
                <AppInput
                  label="Yeni liste adı"
                  value={newListName}
                  onChangeText={setNewListName}
                  placeholder="Örn. Haftalık Market"
                  autoFocus
                  maxLength={100}
                />

                <View className="mt-5 gap-3">
                  <AppButton
                    title={
                      isCreating || isAdding
                        ? "Ekleniyor..."
                        : "Listeyi Oluştur ve Ekle"
                    }
                    onPress={handleCreateAndAdd}
                    disabled={isCreating || isAdding || !newListName.trim()}
                  />

                  <AppButton
                    title="Mevcut Listelere Dön"
                    variant="outline"
                    onPress={() => {
                      setNewListName("");
                      setShowCreateForm(false);
                    }}
                    disabled={isCreating || isAdding}
                  />
                </View>
              </View>
            ) : isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <View className="gap-4">
                <Text className="text-center text-danger">
                  Alışveriş listeleri yüklenemedi.
                </Text>

                <AppButton
                  title="Kapat"
                  variant="outline"
                  onPress={handleClose}
                />
              </View>
            ) : (
              <>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerClassName="gap-3 pb-2"
                >
                  {shoppingLists.length === 0 ? (
                    <EmptyState
                      title="Henüz listen yok"
                      description="Yeni bir alışveriş listesi oluşturup malzemeleri ekleyebilirsin."
                    />
                  ) : (
                    shoppingLists.map((list) => {
                      const loading = isAdding && selectedListId === list.id;

                      return (
                        <TouchableOpacity
                          key={list.id}
                          activeOpacity={0.85}
                          onPress={() => handleAdd(list.id)}
                          disabled={isAdding || isCreating}
                        >
                          <View className="flex-row items-center justify-between rounded-2xl border border-border bg-background p-4">
                            <View className="flex-1">
                              <Text className="text-base font-bold text-text">
                                {list.name}
                              </Text>

                              <Text className="mt-1 text-sm text-muted">
                                {list.itemCount} madde
                              </Text>
                            </View>

                            {loading ? (
                              <LoadingSpinner />
                            ) : (
                              <Ionicons
                                name="add-circle-outline"
                                size={25}
                                color="#E85D04"
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  )}
                </ScrollView>

                <View className="mt-5">
                  <AppButton
                    title="Yeni Liste Oluştur"
                    variant="outline"
                    onPress={() => setShowCreateForm(true)}
                    disabled={isAdding || isCreating}
                  />
                </View>
              </>
            )}
          </AppCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
