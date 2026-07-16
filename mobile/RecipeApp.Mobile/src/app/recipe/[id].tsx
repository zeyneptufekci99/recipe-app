import { AppButton, ConfirmDialog } from "@/components";
import { useGetRecipeCollectionsQuery } from "@/features/collection/api";
import { AddToCollectionModal } from "@/features/collection/components/add-to-collection-modal";
import {
  useDeleteRecipeMutation,
  useDuplicateRecipeMutation,
  useEstimateRecipeNutritionMutation,
  useGetRecipeByIdQuery,
  useToggleFavoriteMutation,
} from "@/features/recipe/api";
import { AiChefModal } from "@/features/recipe/components/ai-chef-modal";
import { AiTransformRecipeModal } from "@/features/recipe/components/ai-transform-recipe-modal";
import { IngredientList } from "@/features/recipe/components/ingredient-list";
import { InstructionList } from "@/features/recipe/components/instruciton-list";
import { NutritionCard } from "@/features/recipe/components/nutrition-card";
import { RecipeAiToolsModal } from "@/features/recipe/components/recipe-ai-tools-modal";
import { RecipeDetailHeader } from "@/features/recipe/components/recipe-detail-header";
import { AddToShoppingListModal } from "@/features/shopping-list/components/add-to-shopping-list-modal";
import { toastService } from "@/services/toast-service";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAiTransformModal, setShowAiTransformModal] = useState(false);
  const [showAiChefModal, setShowAiChefModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showAiToolsModal, setShowAiToolsModal] = useState(false);

  const [estimateNutrition, { isLoading: isEstimatingNutrition }] =
    useEstimateRecipeNutritionMutation();
  const { data, isLoading, error } = useGetRecipeByIdQuery(id);
  const [toggleFavorite] = useToggleFavoriteMutation();
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();
  const [duplicateRecipe, { isLoading: isDuplicating }] =
    useDuplicateRecipeMutation();

  const recipeId = data?.id;
  const { data: recipeCollections = [] } = useGetRecipeCollectionsQuery(
    recipeId ?? "",
    {
      skip: !recipeId,
    },
  );
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

  const handleEstimateNutrition = async () => {
    try {
      await estimateNutrition(data.id).unwrap();

      setShowAiToolsModal(false);

      toastService.success(
        "Besin değerleri hesaplandı",
        "Tahmini porsiyon değerleri tarife eklendi.",
      );
    } catch (estimateError) {
      console.log("Estimate nutrition error:", estimateError);

      toastService.error(
        "Hesaplama başarısız",
        "Besin değerleri şu anda hesaplanamadı.",
      );
    }
  };

  const hasNutrition =
    data.caloriesPerServing != null &&
    data.proteinGramsPerServing != null &&
    data.carbohydrateGramsPerServing != null &&
    data.fatGramsPerServing != null;

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="p-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <RecipeDetailHeader
          recipe={data}
          onFavoritePress={() => toggleFavorite(data.id)}
        />

        <View className="mt-6 gap-3">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <AppButton
                title="Düzenle"
                onPress={() => router.push(`/recipe/edit/${data.id}`)}
              />
            </View>

            <View className="flex-1">
              <AppButton
                title="AI Araçları"
                onPress={() => setShowAiToolsModal(true)}
                variant="outline"
              />
            </View>
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setShowShoppingListModal(true)}
              activeOpacity={0.85}
              className="flex-1 rounded-2xl border border-border bg-surface p-4"
            >
              <Ionicons name="cart-outline" size={22} color="#E85D04" />

              <Text className="mt-3 font-bold text-text">
                Alışveriş Listesi
              </Text>

              <Text className="mt-1 text-xs leading-5 text-muted">
                Malzemeleri listene ekle
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowCollectionModal(true)}
              activeOpacity={0.85}
              className="flex-1 rounded-2xl border border-border bg-surface p-4"
            >
              <Ionicons name="albums-outline" size={22} color="#E85D04" />

              <Text className="mt-3 font-bold text-text">Koleksiyon</Text>

              <Text className="mt-1 text-xs leading-5 text-muted">
                Tarifi gruplandır
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleDuplicate}
            disabled={isDuplicating}
            activeOpacity={0.85}
            className="flex-row items-center justify-between rounded-2xl border border-border bg-surface p-4"
          >
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Ionicons name="copy-outline" size={21} color="#E85D04" />
              </View>

              <View>
                <Text className="font-bold text-text">
                  {isDuplicating ? "Kopyalanıyor..." : "Tarifi Kopyala"}
                </Text>

                <Text className="mt-1 text-xs text-muted">
                  Düzenlemek için yeni bir kopya oluştur
                </Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#7A7A7A" />
          </TouchableOpacity>
        </View>

        {hasNutrition ? <NutritionCard recipe={data} /> : null}

        <IngredientList ingredients={data.ingredients} />

        <InstructionList steps={data.steps} />
        <View className="mt-8 border-t border-border pt-6">
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
      <AiTransformRecipeModal
        visible={showAiTransformModal}
        recipeId={data.id}
        onClose={() => setShowAiTransformModal(false)}
      />
      <AiChefModal
        visible={showAiChefModal}
        recipeId={data.id}
        onClose={() => setShowAiChefModal(false)}
      />
      <AddToCollectionModal
        visible={showCollectionModal}
        recipeId={data.id}
        onClose={() => setShowCollectionModal(false)}
      />

      <RecipeAiToolsModal
        visible={showAiToolsModal}
        hasNutrition={hasNutrition}
        isEstimatingNutrition={isEstimatingNutrition}
        onClose={() => setShowAiToolsModal(false)}
        onOpenChef={() => setShowAiChefModal(true)}
        onOpenTransform={() => setShowAiTransformModal(true)}
        onEstimateNutrition={handleEstimateNutrition}
      />
    </>
  );
}
