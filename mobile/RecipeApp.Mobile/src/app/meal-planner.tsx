import {
  AppCard,
  AppScreen,
  ConfirmDialog,
  LoadingSpinner,
  PageHeader,
} from "@/components";
import { useGenerateWeeklyMealPlanMutation } from "@/features/meal-plan/api";
import { AiPlannerWizard } from "@/features/meal-plan/components/ai-planner-wizard";
import { CreateShoppingListModal } from "@/features/meal-plan/components/create-shopping-list-modal";
import { DaySelector } from "@/features/meal-plan/components/day-selector";
import { MealCard } from "@/features/meal-plan/components/meal-card";
import { MealRecipePickerModal } from "@/features/meal-plan/components/meal-recipe-picker-modal";
import { NutritionSummaryCard } from "@/features/meal-plan/components/nutrition-summary-card";
import { WeekSelector } from "@/features/meal-plan/components/week-selector";
import { MEAL_TYPES } from "@/features/meal-plan/constants";
import { useMealPlan } from "@/features/meal-plan/hooks/use-meal-plan";
import { useEstimateRecipeNutritionMutation } from "@/features/recipe/api";
import dayjs from "@/lib/dayjs";
import { toastService } from "@/services/toast-service";
import type { AiPlannerFormValues } from "@/types/ai-planner";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface PlannerActionCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onPress: () => void;
}

export default function MealPlannerScreen() {
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);

  const [showAiPlanner, setShowAiPlanner] = useState(false);

  const [pendingPlannerValues, setPendingPlannerValues] =
    useState<AiPlannerFormValues | null>(null);

  const [estimatingRecipeId, setEstimatingRecipeId] = useState<string | null>(
    null,
  );

  const [generateWeeklyPlan, { isLoading: isGeneratingPlan }] =
    useGenerateWeeklyMealPlanMutation();

  const [estimateNutrition] = useEstimateRecipeNutritionMutation();

  const {
    mealPlan,
    weekStart,
    weekEnd,
    weekDays,
    selectedDate,
    selectedDayItems,
    selectedMeal,
    itemToDelete,

    isLoading,
    isFetching,
    isSaving,
    isDeleting,
    error,

    setSelectedDate,
    setItemToDelete,

    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,

    openMealPicker,
    closeMealPicker,
    saveMeal,
    confirmDelete,
  } = useMealPlan();

  const selectedDayLabel = dayjs(selectedDate).format("D MMMM dddd");

  const plannedMealCount = selectedDayItems.length;
  const hasWeeklyMeals = mealPlan.length > 0;

  const handleRequestAiPlan = (values: AiPlannerFormValues) => {
    setPendingPlannerValues(values);
  };

  const handleConfirmAiPlan = async () => {
    if (!pendingPlannerValues) return;

    try {
      await generateWeeklyPlan({
        startDate: weekStart.format("YYYY-MM-DD"),
        days: pendingPlannerValues.days,
        servings: pendingPlannerValues.servings,
        goal: pendingPlannerValues.goal,
        budget: pendingPlannerValues.budget,
        maxPrepTime: pendingPlannerValues.maxPrepTime,
        mealTypes: pendingPlannerValues.mealTypes,
        excludedIngredients: pendingPlannerValues.excludedIngredients,
        allergies: pendingPlannerValues.allergies,
        notes: pendingPlannerValues.notes,
      }).unwrap();

      toastService.success(
        "Haftalık plan oluşturuldu",
        "AI seçimlerine uygun yemek planını hazırladı.",
      );

      setPendingPlannerValues(null);
      setShowAiPlanner(false);
    } catch (generateError) {
      console.log("Generate weekly meal plan error:", generateError);

      toastService.error(
        "Plan oluşturulamadı",
        "AI haftalık planı oluşturamadı. Lütfen tekrar dene.",
      );
    }
  };

  const handleEstimateNutrition = async (recipeId: string) => {
    try {
      setEstimatingRecipeId(recipeId);

      await estimateNutrition(recipeId).unwrap();

      toastService.success(
        "Besin değerleri hesaplandı",
        "Günlük ve haftalık toplamlar güncellendi.",
      );
    } catch (estimateError) {
      console.log("Estimate meal nutrition error:", estimateError);

      toastService.error(
        "Hesaplama başarısız",
        "Bu tarifin besin değerleri şu anda hesaplanamadı.",
      );
    } finally {
      setEstimatingRecipeId(null);
    }
  };

  return (
    <AppScreen>
      <PageHeader title="Yemek Planı" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <AppCard className="mb-5 p-4">
          <WeekSelector
            weekStart={weekStart}
            weekEnd={weekEnd}
            onPrevious={goToPreviousWeek}
            onNext={goToNextWeek}
            onCurrentWeek={goToCurrentWeek}
          />

          <View className="mt-4">
            <DaySelector
              days={weekDays}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />
          </View>
        </AppCard>

        <View className="mb-6">
          <Text className="mb-3 text-lg font-bold text-text">
            Planlama Araçları
          </Text>

          <View className="flex-row gap-3">
            <PlannerActionCard
              title="AI Plan"
              description="Tercihlerine göre haftalık menü oluştur"
              icon="sparkles-outline"
              variant="primary"
              disabled={isGeneratingPlan}
              onPress={() => setShowAiPlanner(true)}
            />

            <PlannerActionCard
              title="Market Listesi"
              description="Bu haftanın malzemelerini listele"
              icon="cart-outline"
              variant="secondary"
              onPress={() => setShowShoppingListModal(true)}
            />
          </View>
        </View>

        <View className="mb-4 flex-row items-end justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-xl font-bold capitalize text-text">
              {selectedDayLabel}
            </Text>

            <Text className="mt-1 text-sm text-muted">
              {plannedMealCount > 0
                ? `${plannedMealCount} öğün planlandı`
                : "Bu gün için henüz öğün eklenmedi"}
            </Text>
          </View>

          {isFetching && !isLoading ? (
            <View className="flex-row items-center rounded-full bg-primary/10 px-3 py-1.5">
              <LoadingSpinner />
              <Text className="ml-2 text-xs font-semibold text-primary">
                Güncelleniyor
              </Text>
            </View>
          ) : null}
        </View>

        {isLoading ? (
          <View className="gap-3">
            <MealCardSkeleton />
            <MealCardSkeleton />
            <MealCardSkeleton />
            <MealCardSkeleton />
          </View>
        ) : error ? (
          <AppCard className="items-center py-8">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-danger/10">
              <Ionicons name="alert-circle-outline" size={27} color="#D9480F" />
            </View>

            <Text className="mt-4 text-lg font-bold text-text">
              Yemek planı yüklenemedi
            </Text>

            <Text className="mt-2 px-6 text-center text-sm leading-5 text-muted">
              Bağlantını kontrol edip tekrar deneyebilirsin.
            </Text>
          </AppCard>
        ) : (
          <View className="gap-3">
            {MEAL_TYPES.map((mealType) => {
              const item = selectedDayItems.find(
                (meal) => meal.mealType === mealType.value,
              );

              return (
                <MealCard
                  key={mealType.value}
                  mealType={mealType}
                  item={item}
                  isEstimatingNutrition={
                    item != null && estimatingRecipeId === item.recipeId
                  }
                  onEstimateNutrition={() => {
                    if (item) {
                      handleEstimateNutrition(item.recipeId);
                    }
                  }}
                  onEdit={() => openMealPicker(mealType.value, item)}
                  onDelete={() => {
                    if (item) {
                      setItemToDelete(item);
                    }
                  }}
                />
              );
            })}

            <View className="mt-3">
              <NutritionSummaryCard
                title="Günün Tahmini Besin Değerleri"
                items={selectedDayItems}
              />
            </View>

            {hasWeeklyMeals ? (
              <View className="mt-3">
                <NutritionSummaryCard
                  title="Haftalık Günlük Ortalama"
                  items={mealPlan}
                  mode="daily-average"
                  dayCount={weekDays.length}
                />
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>

      <MealRecipePickerModal
        visible={selectedMeal !== null}
        isSaving={isSaving}
        onClose={closeMealPicker}
        onSelect={saveMeal}
      />

      <CreateShoppingListModal
        visible={showShoppingListModal}
        startDate={weekStart.format("YYYY-MM-DD")}
        endDate={weekEnd.format("YYYY-MM-DD")}
        defaultName={`${weekStart.format(
          "D MMM",
        )} - ${weekEnd.format("D MMM")} Market Listesi`}
        onClose={() => setShowShoppingListModal(false)}
      />

      <ConfirmDialog
        visible={itemToDelete !== null}
        title="Öğünü Kaldır"
        description={
          itemToDelete
            ? `"${itemToDelete.recipeTitle}" yemek planından kaldırılacak.`
            : ""
        }
        confirmText="Kaldır"
        cancelText="Vazgeç"
        variant="danger"
        loading={isDeleting}
        onCancel={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
      />

      <AiPlannerWizard
        visible={showAiPlanner}
        isGenerating={isGeneratingPlan}
        onClose={() => {
          if (!isGeneratingPlan) {
            setShowAiPlanner(false);
          }
        }}
        onGenerate={handleRequestAiPlan}
      />

      <ConfirmDialog
        visible={pendingPlannerValues !== null}
        title="Yeni plan oluşturulsun mu?"
        description="Seçilen tarih aralığındaki mevcut öğünler AI tarafından oluşturulan yeni planla değiştirilecek."
        confirmText="Planı Oluştur"
        cancelText="Vazgeç"
        variant="primary"
        loading={isGeneratingPlan}
        onCancel={() => {
          if (!isGeneratingPlan) {
            setPendingPlannerValues(null);
          }
        }}
        onConfirm={handleConfirmAiPlan}
      />
    </AppScreen>
  );
}

function PlannerActionCard({
  title,
  description,
  icon,
  variant = "secondary",
  disabled = false,
  onPress,
}: PlannerActionCardProps) {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      className={
        isPrimary
          ? "flex-1 rounded-2xl bg-primary p-4"
          : "flex-1 rounded-2xl border border-border bg-surface p-4"
      }
    >
      <View
        className={
          isPrimary
            ? "h-11 w-11 items-center justify-center rounded-xl bg-white/15"
            : "h-11 w-11 items-center justify-center rounded-xl bg-primary/10"
        }
      >
        <Ionicons
          name={icon}
          size={22}
          color={isPrimary ? "#FFFFFF" : "#E85D04"}
        />
      </View>

      <Text
        className={
          isPrimary ? "mt-4 font-bold text-white" : "mt-4 font-bold text-text"
        }
      >
        {title}
      </Text>

      <Text
        className={
          isPrimary
            ? "mt-1 text-xs leading-5 text-white/80"
            : "mt-1 text-xs leading-5 text-muted"
        }
      >
        {description}
      </Text>
    </TouchableOpacity>
  );
}

function MealCardSkeleton() {
  return (
    <View className="rounded-2xl border border-border bg-surface p-4">
      <View className="flex-row items-center">
        <View className="h-11 w-11 rounded-xl bg-border" />

        <View className="ml-3 flex-1">
          <View className="h-4 w-20 rounded-full bg-border" />
          <View className="mt-2 h-5 w-40 rounded-full bg-border" />
        </View>

        <View className="h-10 w-10 rounded-full bg-border" />
      </View>
    </View>
  );
}
