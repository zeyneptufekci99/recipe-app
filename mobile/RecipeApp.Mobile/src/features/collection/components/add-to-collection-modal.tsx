import {
  AppButton,
  AppCard,
  AppInput,
  EmptyState,
  LoadingSpinner,
} from "@/components";
import {
  useAddRecipeToCollectionMutation,
  useCreateCollectionMutation,
  useGetCollectionsQuery,
} from "@/features/collection/api";
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

interface AddToCollectionModalProps {
  visible: boolean;
  recipeId: string;
  onClose: () => void;
}

export function AddToCollectionModal({
  visible,
  recipeId,
  onClose,
}: AddToCollectionModalProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);

  const {
    data: collections = [],
    isLoading,
    error,
  } = useGetCollectionsQuery(undefined, {
    skip: !visible,
  });

  const [addRecipeToCollection, { isLoading: isAdding }] =
    useAddRecipeToCollectionMutation();

  const [createCollection, { isLoading: isCreating }] =
    useCreateCollectionMutation();

  const handleClose = () => {
    if (isAdding || isCreating) return;

    setShowCreateForm(false);
    setNewCollectionName("");
    setNewCollectionDescription("");
    setSelectedCollectionId(null);

    onClose();
  };

  const handleAddToCollection = async (
    collectionId: string,
    collectionName: string,
  ) => {
    try {
      setSelectedCollectionId(collectionId);

      await addRecipeToCollection({
        collectionId,
        recipeId,
      }).unwrap();

      toastService.success(
        "Koleksiyona eklendi",
        `Tarif "${collectionName}" koleksiyonuna eklendi.`,
      );

      handleClose();
    } catch (addError) {
      console.log("Add recipe to collection error:", addError);

      toastService.error("Tarif eklenemedi", "Lütfen tekrar deneyin.");
    } finally {
      setSelectedCollectionId(null);
    }
  };

  const handleCreateAndAdd = async () => {
    const trimmedName = newCollectionName.trim();

    if (!trimmedName) {
      toastService.error(
        "Koleksiyon adı gerekli",
        "Yeni koleksiyona bir ad vermelisin.",
      );

      return;
    }

    try {
      const createdCollection = await createCollection({
        name: trimmedName,
        description: newCollectionDescription.trim() || null,
      }).unwrap();

      await addRecipeToCollection({
        collectionId: createdCollection.id,
        recipeId,
      }).unwrap();

      toastService.success(
        "Koleksiyon oluşturuldu",
        "Yeni koleksiyon oluşturuldu ve tarif eklendi.",
      );

      handleClose();
    } catch (createError) {
      console.log("Create collection and add recipe error:", createError);

      toastService.error(
        "İşlem başarısız",
        "Koleksiyon oluşturulamadı veya tarif eklenemedi.",
      );
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
                  Koleksiyona Ekle
                </Text>

                <Text className="mt-2 text-sm leading-5 text-muted">
                  Tarifi eklemek istediğin koleksiyonu seç.
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
                  label="Koleksiyon adı"
                  value={newCollectionName}
                  onChangeText={setNewCollectionName}
                  placeholder="Örn. Hafta İçi Pratik"
                  autoFocus
                  maxLength={100}
                />

                <View className="mt-4">
                  <AppInput
                    label="Açıklama"
                    value={newCollectionDescription}
                    onChangeText={setNewCollectionDescription}
                    placeholder="İsteğe bağlı"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    maxLength={500}
                    className="min-h-28"
                  />
                </View>

                <View className="mt-6 gap-3">
                  <AppButton
                    title={
                      isCreating || isAdding
                        ? "Ekleniyor..."
                        : "Koleksiyonu Oluştur ve Ekle"
                    }
                    onPress={handleCreateAndAdd}
                    disabled={
                      isCreating || isAdding || !newCollectionName.trim()
                    }
                  />

                  <AppButton
                    title="Mevcut Koleksiyonlara Dön"
                    variant="outline"
                    onPress={() => {
                      setShowCreateForm(false);
                      setNewCollectionName("");
                      setNewCollectionDescription("");
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
                  Koleksiyonlar yüklenemedi.
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
                  {collections.length === 0 ? (
                    <EmptyState
                      title="Henüz koleksiyonun yok"
                      description="Yeni bir koleksiyon oluşturup bu tarifi ekleyebilirsin."
                    />
                  ) : (
                    collections.map((collection) => {
                      const loading =
                        isAdding && selectedCollectionId === collection.id;

                      return (
                        <TouchableOpacity
                          key={collection.id}
                          activeOpacity={0.85}
                          disabled={isAdding || isCreating}
                          onPress={() =>
                            handleAddToCollection(
                              collection.id,
                              collection.name,
                            )
                          }
                        >
                          <View className="flex-row items-center justify-between rounded-2xl border border-border bg-background p-4">
                            <View className="flex-1 pr-3">
                              <Text className="text-base font-bold text-text">
                                {collection.name}
                              </Text>

                              <Text className="mt-1 text-sm text-muted">
                                {collection.recipeCount} tarif
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
                    title="Yeni Koleksiyon Oluştur"
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
