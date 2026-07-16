import {
  AppButton,
  AppCard,
  AppInput,
  AppScreen,
  ConfirmDialog,
  EmptyState,
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
import { Image } from "expo-image";
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

export default function CollectionsScreen() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [collectionToDelete, setCollectionToDelete] =
    useState<CollectionSummary | null>(null);

  const {
    data: collections = [],
    isLoading,
    error,
    refetch,
  } = useGetCollectionsQuery();

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
        "Koleksiyon kaldırıldı. Tariflerin silinmedi.",
      );

      setCollectionToDelete(null);
    } catch (deleteError) {
      console.log("Delete collection error:", deleteError);

      toastService.error("Koleksiyon silinemedi", "Lütfen tekrar deneyin.");
    }
  };

  if (isLoading) {
    return (
      <AppScreen>
        <View className="mb-5 flex-row items-center justify-between">
          <View className="h-8 w-40 rounded-full bg-border" />
          <View className="h-10 w-10 rounded-full bg-border" />
        </View>

        <View className="gap-4">
          <CollectionCardSkeleton />
          <CollectionCardSkeleton />
          <CollectionCardSkeleton />
        </View>
      </AppScreen>
    );
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
        <View className="flex-1 items-center justify-center px-6">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-danger/10">
            <Ionicons name="alert-circle-outline" size={30} color="#D9480F" />
          </View>

          <Text className="mt-4 text-xl font-bold text-text">
            Koleksiyonlar yüklenemedi
          </Text>

          <Text className="mt-2 text-center text-sm leading-5 text-muted">
            Bağlantını kontrol edip tekrar deneyebilirsin.
          </Text>

          <View className="mt-5 w-full">
            <AppButton title="Tekrar Dene" onPress={refetch} />
          </View>
        </View>
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
          contentContainerClassName="gap-4 pb-10"
        >
          <View className="mb-1">
            <Text className="text-sm leading-5 text-muted">
              Tariflerini farklı amaçlara göre gruplandır ve daha hızlı bul.
            </Text>
          </View>

          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onPress={() =>
                router.push({
                  pathname: "/collection/[id]",
                  params: {
                    id: collection.id,
                  },
                })
              }
              onDelete={() => setCollectionToDelete(collection)}
            />
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
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-xl font-bold text-text">
                    Yeni Koleksiyon
                  </Text>

                  <Text className="mt-2 text-sm leading-5 text-muted">
                    Tariflerini daha kolay bulmak için bir koleksiyon oluştur.
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={closeCreateModal}
                  disabled={isCreating}
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

interface CollectionCardProps {
  collection: CollectionSummary;
  onPress: () => void;
  onDelete: () => void;
}

function CollectionCard({
  collection,
  onPress,
  onDelete,
}: CollectionCardProps) {
  return (
    <AppCard className="overflow-hidden p-0">
      <TouchableOpacity onPress={onPress} activeOpacity={0.88}>
        <View className="relative">
          {collection.coverImageUrl ? (
            <Image
              source={{ uri: collection.coverImageUrl }}
              contentFit="cover"
              transition={250}
              className="h-44 w-full bg-border"
            />
          ) : (
            <View className="h-44 w-full items-center justify-center bg-primary/10">
              <View className="h-16 w-16 items-center justify-center rounded-3xl bg-white/80">
                <Ionicons name="albums-outline" size={31} color="#E85D04" />
              </View>
            </View>
          )}

          <View className="absolute inset-x-0 bottom-0 h-20 bg-black/20" />

          <View className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5">
            <Text className="text-xs font-bold text-white">
              {collection.recipeCount} tarif
            </Text>
          </View>

          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`${collection.name} koleksiyonunu sil`}
            className="absolute right-3 top-3 h-10 w-10 items-center justify-center rounded-full bg-black/45"
          >
            <Ionicons name="trash-outline" size={19} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View className="p-5">
          <View className="flex-row items-center justify-between gap-3">
            <Text
              numberOfLines={1}
              className="flex-1 text-xl font-bold text-text"
            >
              {collection.name}
            </Text>

            <Ionicons name="chevron-forward" size={21} color="#7A7A7A" />
          </View>

          {collection.description ? (
            <Text
              numberOfLines={2}
              className="mt-2 text-sm leading-5 text-muted"
            >
              {collection.description}
            </Text>
          ) : (
            <Text className="mt-2 text-sm text-muted">
              Bu koleksiyon için açıklama eklenmemiş.
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </AppCard>
  );
}

function CollectionCardSkeleton() {
  return (
    <View className="overflow-hidden rounded-3xl bg-surface">
      <View className="h-44 w-full bg-border" />

      <View className="p-5">
        <View className="h-6 w-1/2 rounded-full bg-border" />
        <View className="mt-3 h-4 w-4/5 rounded-full bg-border" />
      </View>
    </View>
  );
}
