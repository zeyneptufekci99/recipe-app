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
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
  useGetCollectionsQuery,
} from "@/features/collection/api";
import { toastService } from "@/services/toast-service";
import type { CollectionSummary } from "@/types/collection";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CollectionsScreen() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [collectionToDelete, setCollectionToDelete] =
    useState<CollectionSummary | null>(null);

  const { data: collections = [], isLoading, error } = useGetCollectionsQuery();

  const [createCollection, { isLoading: isCreating }] =
    useCreateCollectionMutation();

  const [deleteCollection, { isLoading: isDeleting }] =
    useDeleteCollectionMutation();

  const closeCreateModal = () => {
    if (isCreating) return;

    setName("");
    setDescription("");
    setShowCreateModal(false);
  };

  const handleCreate = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      toastService.error(
        "Koleksiyon adı gerekli",
        "Koleksiyona bir ad vermelisin.",
      );
      return;
    }

    try {
      const createdCollection = await createCollection({
        name: trimmedName,
        description: description.trim() || null,
      }).unwrap();

      closeCreateModal();

      toastService.success(
        "Koleksiyon oluşturuldu",
        "Yeni koleksiyonun hazır.",
      );

      router.push({
        pathname: "/collection/[id]",
        params: {
          id: createdCollection.id,
        },
      });
    } catch (createError) {
      console.log("Create collection error:", createError);

      toastService.error("Koleksiyon oluşturulamadı", "Lütfen tekrar deneyin.");
    }
  };

  const handleDelete = async () => {
    if (!collectionToDelete) return;

    try {
      await deleteCollection(collectionToDelete.id).unwrap();

      toastService.success(
        "Koleksiyon silindi",
        "Koleksiyon ve bağlantıları kaldırıldı.",
      );

      setCollectionToDelete(null);
    } catch (deleteError) {
      console.log("Delete collection error:", deleteError);

      toastService.error("Koleksiyon silinemedi", "Lütfen tekrar deneyin.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <AppScreen>
      <PageHeader
        title="Koleksiyonlar"
        rightContent={
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Yeni koleksiyon oluştur"
            className="h-10 w-10 items-center justify-center rounded-full bg-primary"
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      {error ? (
        <AppCard>
          <Text className="text-center text-danger">
            Koleksiyonlar yüklenemedi.
          </Text>
        </AppCard>
      ) : collections.length === 0 ? (
        <View className="flex-1 justify-center">
          <EmptyState
            title="Henüz koleksiyonun yok"
            description="Tariflerini konuya veya kullanım amacına göre gruplamak için ilk koleksiyonunu oluştur."
          />

          <View className="mt-5">
            <AppButton
              title="İlk Koleksiyonunu Oluştur"
              onPress={() => setShowCreateModal(true)}
            />
          </View>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-3 pb-10"
        >
          {collections.map((collection) => (
            <TouchableOpacity
              key={collection.id}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: "/collection/[id]",
                  params: {
                    id: collection.id,
                  },
                })
              }
              onLongPress={() => setCollectionToDelete(collection)}
            >
              <AppCard>
                <View className="flex-row items-center gap-4">
                  {collection.coverImageUrl ? (
                    <Image
                      source={{ uri: collection.coverImageUrl }}
                      className="h-16 w-16 rounded-2xl bg-border"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <Ionicons
                        name="albums-outline"
                        size={26}
                        color="#E85D04"
                      />
                    </View>
                  )}

                  <View className="flex-1">
                    <Text className="text-lg font-bold text-text">
                      {collection.name}
                    </Text>

                    {collection.description ? (
                      <Text
                        numberOfLines={2}
                        className="mt-1 text-sm leading-5 text-muted"
                      >
                        {collection.description}
                      </Text>
                    ) : null}

                    <Text className="mt-2 text-sm font-semibold text-primary">
                      {collection.recipeCount} tarif
                    </Text>
                  </View>

                  <Ionicons name="chevron-forward" size={21} color="#7A7A7A" />
                </View>
              </AppCard>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={closeCreateModal}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 px-5"
          onPress={closeCreateModal}
        >
          <Pressable
            className="w-full max-w-md"
            onPress={(event) => event.stopPropagation()}
          >
            <AppCard className="p-6">
              <Text className="text-xl font-bold text-text">
                Yeni Koleksiyon
              </Text>

              <Text className="mt-2 text-sm leading-5 text-muted">
                Tariflerini daha kolay bulmak için bir koleksiyon oluştur.
              </Text>

              <View className="mt-5 gap-4">
                <AppInput
                  label="Koleksiyon adı"
                  value={name}
                  onChangeText={setName}
                  placeholder="Örn. Hafta İçi Pratik"
                  autoFocus
                  maxLength={100}
                />

                <AppInput
                  label="Açıklama"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Örn. 30 dakikadan kısa süren tarifler"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={500}
                  className="min-h-28"
                />
              </View>

              <View className="mt-6 gap-3">
                <AppButton
                  title={isCreating ? "Oluşturuluyor..." : "Koleksiyon Oluştur"}
                  onPress={handleCreate}
                  disabled={isCreating || !name.trim()}
                />

                <AppButton
                  title="Vazgeç"
                  variant="outline"
                  onPress={closeCreateModal}
                  disabled={isCreating}
                />
              </View>
            </AppCard>
          </Pressable>
        </Pressable>
      </Modal>

      <ConfirmDialog
        visible={collectionToDelete !== null}
        title="Koleksiyonu Sil"
        description={
          collectionToDelete
            ? `"${collectionToDelete.name}" koleksiyonu silinecek. Tariflerin kendisi silinmeyecek.`
            : ""
        }
        confirmText="Koleksiyonu Sil"
        cancelText="Vazgeç"
        variant="danger"
        loading={isDeleting}
        onCancel={() => setCollectionToDelete(null)}
        onConfirm={handleDelete}
      />
    </AppScreen>
  );
}
