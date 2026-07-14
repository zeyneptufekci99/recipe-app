import {
  AppCard,
  AppInput,
  EmptyState,
  IconButton,
  LoadingSpinner,
} from "@/components";
import { useGetRecipesQuery } from "@/features/recipe/api";
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

interface MealRecipePickerModalProps {
  visible: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSelect: (recipeId: string) => void;
}

export function MealRecipePickerModal({
  visible,
  isSaving,
  onClose,
  onSelect,
}: MealRecipePickerModalProps) {
  const [search, setSearch] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const { data, isLoading, error } = useGetRecipesQuery(
    {
      page: 1,
      pageSize: 50,
      search: search.trim() || undefined,
      sortBy: "created_desc",
    },
    {
      skip: !visible,
    },
  );

  const recipes = data?.items ?? [];

  const handleSelect = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    onSelect(recipeId);
  };

  const handleClose = () => {
    if (isSaving) return;

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
          className="w-full max-w-md"
          onPress={(event) => event.stopPropagation()}
        >
          <AppCard className="max-h-[85vh] p-6">
            <View className="mb-5 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xl font-bold text-text">Tarif Seç</Text>

                <Text className="mt-2 text-sm text-muted">
                  Bu öğüne eklemek istediğin tarifi seç.
                </Text>
              </View>

              <IconButton
                icon="close"
                onPress={handleClose}
                disabled={isSaving}
                accessibilityLabel="Tarif seçimini kapat"
              />
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
                <Text className="text-center text-danger">
                  Tarifler yüklenemedi.
                </Text>
              ) : recipes.length === 0 ? (
                <EmptyState
                  title="Tarif bulunamadı"
                  description="Aramana uygun bir tarif bulunamadı."
                />
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerClassName="gap-3 pb-2"
                >
                  {recipes.map((recipe) => {
                    const selected = isSaving && selectedRecipeId === recipe.id;

                    return (
                      <TouchableOpacity
                        key={recipe.id}
                        onPress={() => handleSelect(recipe.id)}
                        disabled={isSaving}
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

                          {selected ? (
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
