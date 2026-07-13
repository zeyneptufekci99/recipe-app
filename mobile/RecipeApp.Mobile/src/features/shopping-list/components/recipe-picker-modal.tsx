import {
  AppButton,
  AppCard,
  AppInput,
  EmptyState,
  LoadingSpinner,
} from "@/components";
import { useGetRecipesQuery } from "@/features/recipe/api";
import { useAddRecipeToShoppingListMutation } from "@/features/shopping-list/api";
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

interface RecipePickerModalProps {
  visible: boolean;
  shoppingListId: string;
  onClose: () => void;
}

export function RecipePickerModal({
  visible,
  shoppingListId,
  onClose,
}: RecipePickerModalProps) {
  const [search, setSearch] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const { data, isLoading, error } = useGetRecipesQuery(
    {
      search: search.trim() || undefined,
      page: 1,
      pageSize: 50,
      sortBy: "created_desc",
    },
    {
      skip: !visible,
    },
  );

  const [addRecipe, { isLoading: isAdding }] =
    useAddRecipeToShoppingListMutation();

  const recipes = data?.items ?? [];

  const handleAdd = async (recipeId: string, recipeTitle: string) => {
    try {
      setSelectedRecipeId(recipeId);

      await addRecipe({
        shoppingListId,
        recipeId,
      }).unwrap();

      toastService.success(
        "Malzemeler eklendi",
        `"${recipeTitle}" tarifinin malzemeleri listeye eklendi.`,
      );

      handleClose();
    } catch (addError) {
      console.log("Add recipe to shopping list error:", addError);

      toastService.error("Malzemeler eklenemedi", "Lütfen tekrar deneyin.");
    } finally {
      setSelectedRecipeId(null);
    }
  };

  const handleClose = () => {
    if (isAdding) return;

    setSearch("");
    setSelectedRecipeId(null);
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
          <AppCard className="max-h-[85vh] p-6">
            <View className="mb-5 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xl font-bold text-text">Tarif Seç</Text>

                <Text className="mt-2 text-sm text-muted">
                  Malzemelerini eklemek istediğin tarifi seç.
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleClose}
                disabled={isAdding}
                className="h-9 w-9 items-center justify-center rounded-full bg-background"
              >
                <Ionicons name="close" size={21} color="#7A7A7A" />
              </TouchableOpacity>
            </View>

            <AppInput
              value={search}
              onChangeText={setSearch}
              placeholder="Tarif ara..."
              autoCapitalize="none"
            />

            <View className="mt-5">
              {isLoading ? (
                <LoadingSpinner />
              ) : error ? (
                <View className="gap-4">
                  <Text className="text-center text-danger">
                    Tarifler yüklenemedi.
                  </Text>

                  <AppButton
                    title="Kapat"
                    variant="outline"
                    onPress={handleClose}
                  />
                </View>
              ) : recipes.length === 0 ? (
                <EmptyState
                  title="Tarif bulunamadı"
                  description={
                    search.trim()
                      ? "Arama sonucuna uygun bir tarif bulunamadı."
                      : "Henüz ekleyebileceğin bir tarif yok."
                  }
                />
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerClassName="gap-3 pb-2"
                >
                  {recipes.map((recipe) => {
                    const adding = isAdding && selectedRecipeId === recipe.id;

                    return (
                      <TouchableOpacity
                        key={recipe.id}
                        onPress={() => handleAdd(recipe.id, recipe.title)}
                        disabled={isAdding}
                        activeOpacity={0.85}
                      >
                        <View className="flex-row items-center justify-between rounded-2xl border border-border bg-background p-4">
                          <View className="flex-1 pr-3">
                            <Text className="text-base font-bold text-text">
                              {recipe.title}
                            </Text>

                            <Text className="mt-1 text-sm text-muted">
                              {recipe.category}
                            </Text>
                          </View>

                          {adding ? (
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
                  })}
                </ScrollView>
              )}
            </View>
          </AppCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
