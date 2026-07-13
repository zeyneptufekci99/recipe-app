import { AppButton, ConfirmDialog } from "@/components";
import {
  useDeleteRecipeMutation,
  useDuplicateRecipeMutation,
  useGetRecipeByIdQuery,
  useToggleFavoriteMutation,
} from "@/features/recipe/api";
import { IngredientList } from "@/features/recipe/components/ingredient-list";
import { InstructionList } from "@/features/recipe/components/instruciton-list";
import { RecipeDetailHeader } from "@/features/recipe/components/recipe-detail-header";
import { AddToShoppingListModal } from "@/features/shopping-list/components/add-to-shopping-list-modal";
import { toastService } from "@/services/toast-service";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data, isLoading, error } = useGetRecipeByIdQuery(id);
  const [toggleFavorite] = useToggleFavoriteMutation();
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();
  const [duplicateRecipe, { isLoading: isDuplicating }] =
    useDuplicateRecipeMutation();

  if (isLoading) {
    return (
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="pb-10"
      >
        <View className="h-64 w-full bg-border" />

        <View className="gap-5 p-5">
          <View className="h-8 w-2/3 rounded-full bg-border" />
          <View className="h-4 w-1/3 rounded-full bg-border" />
          <View className="mt-4 h-24 rounded-2xl bg-border" />
          <View className="h-32 rounded-2xl bg-border" />
          <View className="h-40 rounded-2xl bg-border" />
        </View>
      </ScrollView>
    );
  }

  if (error || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center text-lg font-semibold text-danger">
          Tarif bulunamadı.
        </Text>

        <AppButton
          title="Ana Sayfaya Dön"
          onPress={() => router.replace("/(tabs)/home")}
          variant="outline"
        />
      </View>
    );
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteRecipe(data.id).unwrap();

      setShowDeleteDialog(false);

      toastService.success(
        "Tarif silindi",
        "Tarif koleksiyonundan kaldırıldı.",
      );

      router.replace("/(tabs)/home");
    } catch (error) {
      console.log("Delete recipe error:", error);

      toastService.error(
        "Silme başarısız",
        "Tarif silinemedi. Lütfen tekrar deneyin.",
      );
    }
  };

  const handleDuplicate = async () => {
    try {
      const duplicated = await duplicateRecipe(data.id).unwrap();

      toastService.success(
        "Tarif kopyalandı",
        "Yeni bir tarif kopyası oluşturuldu.",
      );

      router.push(`/recipe/${duplicated.id}`);
    } catch (error) {
      console.log("Duplicate recipe error:", error);

      toastService.error("İşlem başarısız", "Tarif kopyalanamadı.");
    }
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="p-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-bold text-text">{data.title}</Text>
        <Text className="mt-2 text-muted">{data.category}</Text>

        <RecipeDetailHeader
          recipe={data}
          onFavoritePress={() => toggleFavorite(data.id)}
        />

        <View className="mt-4 gap-3">
          <AppButton
            title="Düzenle"
            onPress={() => router.push(`/recipe/edit/${data.id}`)}
          />

          <AppButton
            title={isDuplicating ? "Kopyalanıyor..." : "Tarifi Kopyala"}
            onPress={handleDuplicate}
            disabled={isDuplicating}
            variant="outline"
          />

          <AppButton
            title="Alışveriş Listesine Ekle"
            onPress={() => setShowShoppingListModal(true)}
            variant="outline"
          />
        </View>

        <IngredientList ingredients={data.ingredients} />

        <InstructionList steps={data.steps} />

        <View className="mt-6">
          <AppButton
            title="Tarifi Sil"
            onPress={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            variant="danger"
          />
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={showDeleteDialog}
        title="Tarifi Sil"
        description="Bu tarif kalıcı olarak silinecek. Bu işlem geri alınamaz."
        confirmText="Tarifi Sil"
        cancelText="Vazgeç"
        variant="danger"
        loading={isDeleting}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />
      <AddToShoppingListModal
        visible={showShoppingListModal}
        recipeId={data.id}
        onClose={() => setShowShoppingListModal(false)}
      />
    </>
  );
}
