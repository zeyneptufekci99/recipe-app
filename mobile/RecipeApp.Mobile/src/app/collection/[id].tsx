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
import { getImageUrl } from "@/utils/get-image-url";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
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

  const {
    data: collection,
    isLoading,
    error,
    refetch,
  } = useGetCollectionByIdQuery(id);

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
    return (
      <AppScreen>
        <View className="mb-5 h-10 w-40 rounded-full bg-border" />

        <View className="mb-5 h-64 rounded-3xl bg-border" />

        <View className="gap-4">
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </View>
      </AppScreen>
    );
  }

  if (error || !collection) {
    return (
      <AppScreen>
        <PageHeader title="Koleksiyon" />

        <View className="flex-1 items-center justify-center px-6">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-danger/10">
            <Ionicons name="alert-circle-outline" size={30} color="#D9480F" />
          </View>

          <Text className="mt-4 text-xl font-bold text-text">
            Koleksiyon yüklenemedi
          </Text>

          <Text className="mt-2 text-center text-sm leading-5 text-muted">
            Bağlantını kontrol edip tekrar deneyebilirsin.
          </Text>

          <View className="mt-5 w-full">
            <AppButton title="Tekrar Dene" onPress={refetch} />
          </View>
        </View>
      </AppScreen>
    );
  }

  const coverImageUrl = getImageUrl(collection.recipes[0]?.imageUrl);

  return (
    <AppScreen>
      <PageHeader title="Koleksiyon Detayı" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <CollectionHeader
          name={collection.name}
          description={collection.description}
          recipeCount={collection.recipes.length}
          coverImageUrl={coverImageUrl}
          onEdit={() => setShowEditModal(true)}
          onAddRecipe={() => setShowRecipePicker(true)}
        />

        <View className="mb-4 mt-6 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-text">Tarifler</Text>

          <Text className="text-sm font-semibold text-primary">
            {collection.recipes.length} tarif
          </Text>
        </View>

        {collection.recipes.length === 0 ? (
          <CollectionEmptyState onAddRecipe={() => setShowRecipePicker(true)} />
        ) : (
          <View className="gap-4">
            {collection.recipes.map((recipe) => (
              <CollectionRecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
                onRemove={() => setRecipeToRemove(recipe)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <RecipePickerModal
        visible={showRecipePicker}
        collectionId={collection.id}
        existingRecipeIds={collection.recipes.map((recipe) => recipe.id)}
        onClose={() => setShowRecipePicker(false)}
      />

      {showEditModal ? (
        <EditCollectionModal
          key={`${collection.id}-${collection.name}-${collection.description ?? ""}`}
          collectionId={collection.id}
          initialName={collection.name}
          initialDescription={collection.description ?? ""}
          onClose={() => setShowEditModal(false)}
        />
      ) : null}
      <ConfirmDialog
        visible={recipeToRemove !== null}
        title="Tarifi Koleksiyondan Çıkar"
        description={
          recipeToRemove
            ? `"${recipeToRemove.title}" koleksiyondan çıkarılacak. Tarifin kendisi silinmeyecek.`
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

interface CollectionHeaderProps {
  name: string;
  description?: string | null;
  recipeCount: number;
  coverImageUrl?: string | null;
  onEdit: () => void;
  onAddRecipe: () => void;
}

function CollectionHeader({
  name,
  description,
  recipeCount,
  coverImageUrl,
  onEdit,
  onAddRecipe,
}: CollectionHeaderProps) {
  return (
    <AppCard className="overflow-hidden bg-primary p-0">
      <View className="relative">
        {coverImageUrl ? (
          <Image
            source={{ uri: coverImageUrl }}
            contentFit="cover"
            transition={250}
            className="h-44 w-full"
          />
        ) : (
          <View className="h-36 w-full items-center justify-center bg-white/10">
            <View className="h-16 w-16 items-center justify-center rounded-3xl bg-white/15">
              <Ionicons name="albums-outline" size={32} color="#FFFFFF" />
            </View>
          </View>
        )}

        {coverImageUrl ? (
          <View className="absolute inset-0 bg-black/30" />
        ) : null}

        <TouchableOpacity
          onPress={onEdit}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Koleksiyonu düzenle"
          className="absolute right-4 top-4 h-10 w-10 items-center justify-center rounded-full bg-white/90"
        >
          <Ionicons name="create-outline" size={20} color="#E85D04" />
        </TouchableOpacity>

        {coverImageUrl ? (
          <View className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5">
            <Text className="text-xs font-bold text-white">
              {recipeCount} tarif
            </Text>
          </View>
        ) : null}
      </View>

      <View className="p-5">
        <View className="flex-row items-start">
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
            <Ionicons name="albums-outline" size={23} color="#FFFFFF" />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-2xl font-bold leading-8 text-white">
              {name}
            </Text>

            <Text className="mt-1 text-sm font-semibold text-white/80">
              {recipeCount} tarif
            </Text>
          </View>
        </View>

        <Text className="mt-4 text-sm leading-6 text-white/80">
          {description || "Bu koleksiyon için henüz bir açıklama eklenmemiş."}
        </Text>

        <TouchableOpacity
          onPress={onAddRecipe}
          activeOpacity={0.85}
          className="mt-5 flex-row items-center justify-center rounded-2xl bg-white px-4 py-3.5"
        >
          <Ionicons name="add-circle-outline" size={21} color="#E85D04" />

          <Text className="ml-2 font-bold text-primary">
            Koleksiyona Tarif Ekle
          </Text>
        </TouchableOpacity>
      </View>
    </AppCard>
  );
}

interface CollectionRecipeCardProps {
  recipe: CollectionRecipe;
  onPress: () => void;
  onRemove: () => void;
}

function CollectionRecipeCard({
  recipe,
  onPress,
  onRemove,
}: CollectionRecipeCardProps) {
  const imageUrl = getImageUrl(recipe.imageUrl);
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <AppCard className="overflow-hidden p-0">
      <TouchableOpacity onPress={onPress} activeOpacity={0.88}>
        <View className="relative">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              contentFit="cover"
              transition={250}
              className="h-44 w-full bg-border"
            />
          ) : (
            <View className="h-36 w-full items-center justify-center bg-primary/10">
              <Ionicons name="restaurant-outline" size={34} color="#E85D04" />
            </View>
          )}

          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation();
              onRemove();
            }}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`${recipe.title} tarifini koleksiyondan çıkar`}
            className="absolute right-3 top-3 h-10 w-10 items-center justify-center rounded-full bg-black/50"
          >
            <Ionicons name="trash-outline" size={19} color="#FFFFFF" />
          </TouchableOpacity>

          <View className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1.5">
            <Text className="text-xs font-bold text-white">
              {recipe.category}
            </Text>
          </View>
        </View>

        <View className="p-5">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text
                numberOfLines={2}
                className="text-lg font-bold leading-6 text-text"
              >
                {recipe.title}
              </Text>

              <View className="mt-3 flex-row flex-wrap items-center gap-x-4 gap-y-2">
                <RecipeInfo icon="time-outline" value={`${totalTime} dk`} />

                <RecipeInfo
                  icon="people-outline"
                  value={`${recipe.servings} kişilik`}
                />

                <RecipeInfo
                  icon="flame-outline"
                  value={`${recipe.cookTime} dk pişirme`}
                />
              </View>
            </View>

            <View className="h-9 w-9 items-center justify-center rounded-full bg-background">
              <Ionicons name="chevron-forward" size={20} color="#7A7A7A" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </AppCard>
  );
}

function RecipeInfo({
  icon,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
}) {
  return (
    <View className="flex-row items-center">
      <Ionicons name={icon} size={15} color="#7A7A7A" />

      <Text className="ml-1.5 text-xs font-medium text-muted">{value}</Text>
    </View>
  );
}

function CollectionEmptyState({ onAddRecipe }: { onAddRecipe: () => void }) {
  return (
    <AppCard className="items-center py-10">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Ionicons name="albums-outline" size={36} color="#E85D04" />
      </View>

      <Text className="mt-5 text-xl font-bold text-text">
        Bu koleksiyon henüz boş
      </Text>

      <Text className="mt-2 px-6 text-center text-sm leading-6 text-muted">
        Tariflerini bu koleksiyonda gruplamak için ilk tarifini ekleyebilirsin.
      </Text>

      <View className="mt-6 w-full">
        <AppButton title="İlk Tarifi Ekle" onPress={onAddRecipe} />
      </View>
    </AppCard>
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

  const totalAvailableRecipes = data?.totalCount ?? recipes.length;

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
          <AppCard className="max-h-[88vh] p-6">
            <View className="mb-5 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xl font-bold text-text">
                  Koleksiyona Tarif Ekle
                </Text>

                <Text className="mt-2 text-sm leading-5 text-muted">
                  {recipes.length} tarif eklenebilir
                  {totalAvailableRecipes > recipes.length
                    ? ` · ${existingRecipeIds.length} tarif zaten koleksiyonda`
                    : ""}
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

            <View className="relative">
              <View className="absolute left-4 top-3.5 z-10">
                <Ionicons name="search-outline" size={19} color="#7A7A7A" />
              </View>

              <AppInput
                value={search}
                onChangeText={setSearch}
                placeholder="Tarif ara..."
                autoCapitalize="none"
                className="pl-11"
              />
            </View>

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
                  keyboardShouldPersistTaps="handled"
                  contentContainerClassName="gap-3 pb-2"
                >
                  {recipes.map((recipe) => {
                    const adding = isAdding && addingRecipeId === recipe.id;

                    const imageUrl = getImageUrl(recipe.imageUrl);

                    return (
                      <TouchableOpacity
                        key={recipe.id}
                        onPress={() => handleAdd(recipe.id, recipe.title)}
                        disabled={isAdding}
                        activeOpacity={0.85}
                      >
                        <View className="flex-row items-center rounded-2xl border border-border bg-background p-3">
                          {imageUrl ? (
                            <Image
                              source={{ uri: imageUrl }}
                              contentFit="cover"
                              className="h-14 w-14 rounded-xl bg-border"
                            />
                          ) : (
                            <View className="h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                              <Ionicons
                                name="restaurant-outline"
                                size={23}
                                color="#E85D04"
                              />
                            </View>
                          )}

                          <View className="ml-3 flex-1 pr-2">
                            <Text
                              numberOfLines={1}
                              className="text-base font-bold text-text"
                            >
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
                              size={26}
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
  collectionId: string;
  initialName: string;
  initialDescription: string;
  onClose: () => void;
}

function EditCollectionModal({
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
      visible
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
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xl font-bold text-text">
                  Koleksiyonu Düzenle
                </Text>

                <Text className="mt-2 text-sm leading-5 text-muted">
                  Koleksiyonun adını ve açıklamasını güncelle.
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleClose}
                disabled={isLoading}
                className="h-9 w-9 items-center justify-center rounded-full bg-background"
              >
                <Ionicons name="close" size={21} color="#7A7A7A" />
              </TouchableOpacity>
            </View>

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

function RecipeCardSkeleton() {
  return (
    <View className="overflow-hidden rounded-3xl bg-surface">
      <View className="h-44 w-full bg-border" />

      <View className="p-5">
        <View className="h-6 w-2/3 rounded-full bg-border" />
        <View className="mt-3 h-4 w-1/2 rounded-full bg-border" />
      </View>
    </View>
  );
}
