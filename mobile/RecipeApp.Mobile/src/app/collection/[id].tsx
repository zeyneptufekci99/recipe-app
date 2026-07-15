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
  useAddRecipeToCollectionMutation,
  useGetCollectionByIdQuery,
  useRemoveRecipeFromCollectionMutation,
  useUpdateCollectionMutation,
} from "@/features/collection/api";
import { useGetRecipesQuery } from "@/features/recipe/api";
import { toastService } from "@/services/toast-service";
import type { CollectionRecipe } from "@/types/collection";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [showRecipePicker, setShowRecipePicker] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [recipeToRemove, setRecipeToRemove] = useState<CollectionRecipe | null>(
    null,
  );

  const { data: collection, isLoading, error } = useGetCollectionByIdQuery(id);

  const [removeRecipe, { isLoading: isRemoving }] =
    useRemoveRecipeFromCollectionMutation();

  const handleRemoveRecipe = async () => {
    if (!collection || !recipeToRemove) return;

    try {
      await removeRecipe({
        collectionId: collection.id,
        recipeId: recipeToRemove.id,
      }).unwrap();

      toastService.success(
        "Tarif kaldırıldı",
        "Tarif koleksiyondan çıkarıldı.",
      );

      setRecipeToRemove(null);
    } catch (removeError) {
      console.log("Remove recipe from collection error:", removeError);

      toastService.error("Tarif kaldırılamadı", "Lütfen tekrar deneyin.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !collection) {
    return (
      <AppScreen>
        <PageHeader title="Koleksiyon" />

        <AppCard>
          <Text className="text-center text-danger">
            Koleksiyon yüklenemedi.
          </Text>
        </AppCard>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <PageHeader
        title={collection.name}
        rightContent={
          <TouchableOpacity
            onPress={() => setShowEditModal(true)}
            activeOpacity={0.8}
            className="h-10 w-10 items-center justify-center rounded-full bg-surface"
          >
            <Ionicons name="create-outline" size={21} color="#E85D04" />
          </TouchableOpacity>
        }
      />

      {collection.description ? (
        <Text className="mb-5 text-sm leading-6 text-muted">
          {collection.description}
        </Text>
      ) : null}

      <View className="mb-5">
        <AppButton
          title="Tarif Ekle"
          onPress={() => setShowRecipePicker(true)}
        />
      </View>

      {collection.recipes.length === 0 ? (
        <EmptyState
          title="Bu koleksiyon boş"
          description="Tarif ekleyerek koleksiyonunu doldurmaya başlayabilirsin."
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-3 pb-10"
        >
          {collection.recipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              activeOpacity={0.85}
              onPress={() => router.push(`/recipe/${recipe.id}`)}
              onLongPress={() => setRecipeToRemove(recipe)}
            >
              <AppCard>
                <View className="flex-row items-center gap-4">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Ionicons
                      name="restaurant-outline"
                      size={23}
                      color="#E85D04"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-base font-bold text-text">
                      {recipe.title}
                    </Text>

                    <Text className="mt-1 text-sm text-muted">
                      {recipe.category}
                    </Text>

                    <Text className="mt-2 text-xs text-muted">
                      {recipe.prepTime + recipe.cookTime} dk · {recipe.servings}{" "}
                      kişilik
                    </Text>
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

      <RecipePickerModal
        visible={showRecipePicker}
        collectionId={collection.id}
        existingRecipeIds={collection.recipes.map((recipe) => recipe.id)}
        onClose={() => setShowRecipePicker(false)}
      />

      <EditCollectionModal
        visible={showEditModal}
        collectionId={collection.id}
        initialName={collection.name}
        initialDescription={collection.description ?? ""}
        onClose={() => setShowEditModal(false)}
      />

      <ConfirmDialog
        visible={recipeToRemove !== null}
        title="Tarifi Koleksiyondan Çıkar"
        description={
          recipeToRemove
            ? `"${recipeToRemove.title}" koleksiyondan çıkarılacak. Tarif silinmeyecek.`
            : ""
        }
        confirmText="Koleksiyondan Çıkar"
        cancelText="Vazgeç"
        variant="danger"
        loading={isRemoving}
        onCancel={() => setRecipeToRemove(null)}
        onConfirm={handleRemoveRecipe}
      />
    </AppScreen>
  );
}

interface RecipePickerModalProps {
  visible: boolean;
  collectionId: string;
  existingRecipeIds: string[];
  onClose: () => void;
}

function RecipePickerModal({
  visible,
  collectionId,
  existingRecipeIds,
  onClose,
}: RecipePickerModalProps) {
  const [search, setSearch] = useState("");
  const [addingRecipeId, setAddingRecipeId] = useState<string | null>(null);

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

  const [addRecipe, { isLoading: isAdding }] =
    useAddRecipeToCollectionMutation();

  const recipes = useMemo(
    () =>
      (data?.items ?? []).filter(
        (recipe) => !existingRecipeIds.includes(recipe.id),
      ),
    [data?.items, existingRecipeIds],
  );

  const handleClose = () => {
    if (isAdding) return;

    setSearch("");
    setAddingRecipeId(null);
    onClose();
  };

  const handleAdd = async (recipeId: string, recipeTitle: string) => {
    try {
      setAddingRecipeId(recipeId);

      await addRecipe({
        collectionId,
        recipeId,
      }).unwrap();

      toastService.success(
        "Tarif eklendi",
        `"${recipeTitle}" koleksiyona eklendi.`,
      );
    } catch (addError) {
      console.log("Add recipe to collection error:", addError);

      toastService.error("Tarif eklenemedi", "Lütfen tekrar deneyin.");
    } finally {
      setAddingRecipeId(null);
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
          <AppCard className="max-h-[85vh] p-6">
            <View className="mb-5 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xl font-bold text-text">
                  Koleksiyona Tarif Ekle
                </Text>

                <Text className="mt-2 text-sm leading-5 text-muted">
                  Koleksiyona eklemek istediğin tarifi seç.
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
                <Text className="text-center text-danger">
                  Tarifler yüklenemedi.
                </Text>
              ) : recipes.length === 0 ? (
                <EmptyState
                  title="Eklenecek tarif yok"
                  description={
                    search.trim()
                      ? "Aramana uygun bir tarif bulunamadı."
                      : "Tüm tariflerin bu koleksiyonda olabilir."
                  }
                />
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerClassName="gap-3 pb-2"
                >
                  {recipes.map((recipe) => {
                    const adding = isAdding && addingRecipeId === recipe.id;

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

interface EditCollectionModalProps {
  visible: boolean;
  collectionId: string;
  initialName: string;
  initialDescription: string;
  onClose: () => void;
}

function EditCollectionModal({
  visible,
  collectionId,
  initialName,
  initialDescription,
  onClose,
}: EditCollectionModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  const [updateCollection, { isLoading }] = useUpdateCollectionMutation();

  const handleClose = () => {
    if (isLoading) return;

    onClose();
  };

  const handleUpdate = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      toastService.error(
        "Koleksiyon adı gerekli",
        "Koleksiyona bir ad vermelisin.",
      );
      return;
    }

    try {
      await updateCollection({
        id: collectionId,
        body: {
          name: trimmedName,
          description: description.trim() || null,
        },
      }).unwrap();

      toastService.success(
        "Koleksiyon güncellendi",
        "Değişiklikler kaydedildi.",
      );

      onClose();
    } catch (updateError) {
      console.log("Update collection error:", updateError);

      toastService.error("Koleksiyon güncellenemedi", "Lütfen tekrar deneyin.");
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
        className="flex-1 items-center justify-center bg-black/50 px-5"
        onPress={handleClose}
      >
        <Pressable
          className="w-full max-w-md"
          onPress={(event) => event.stopPropagation()}
        >
          <AppCard className="p-6">
            <Text className="text-xl font-bold text-text">
              Koleksiyonu Düzenle
            </Text>

            <View className="mt-5 gap-4">
              <AppInput
                label="Koleksiyon adı"
                value={name}
                onChangeText={setName}
                maxLength={100}
              />

              <AppInput
                label="Açıklama"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
                className="min-h-28"
              />
            </View>

            <View className="mt-6 gap-3">
              <AppButton
                title={isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                onPress={handleUpdate}
                disabled={isLoading || !name.trim()}
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
