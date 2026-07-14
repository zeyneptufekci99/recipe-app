import {
  AppButton,
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
import { WeekSelector } from "@/features/meal-plan/components/week-selector";

import { MEAL_TYPES } from "@/features/meal-plan/constants";
import { useMealPlan } from "@/features/meal-plan/hooks/use-meal-plan";
import dayjs from "@/lib/dayjs";
import { toastService } from "@/services/toast-service";
import { AiPlannerFormValues } from "@/types/ai-planner";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function MealPlannerScreen() {
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);
  const [showAiPlanner, setShowAiPlanner] = useState(false);
  const [pendingPlannerValues, setPendingPlannerValues] =
    useState<AiPlannerFormValues | null>(null);
  const [generateWeeklyPlan, { isLoading: isGeneratingPlan }] =
    useGenerateWeeklyMealPlanMutation();
  const handleRequestAiPlan = (values: AiPlannerFormValues) => {
    setPendingPlannerValues(values);
  };

  const {
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
    } catch (error) {
      console.log("Generate weekly meal plan error:", error);

      toastService.error(
        "Plan oluşturulamadı",
        "AI haftalık planı oluşturamadı. Lütfen tekrar dene.",
      );
    }
  };

  return (
    <AppScreen>
      <PageHeader title="Yemek Planı" />

      <WeekSelector
        weekStart={weekStart}
        weekEnd={weekEnd}
        onPrevious={goToPreviousWeek}
        onNext={goToNextWeek}
        onCurrentWeek={goToCurrentWeek}
      />

      <DaySelector
        days={weekDays}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />

      <View className="mt-4 gap-3">
        <AppButton
          title="AI ile Haftalık Plan Oluştur"
          onPress={() => setShowAiPlanner(true)}
        />

        <AppButton
          title="Bu Haftadan Alışveriş Listesi Oluştur"
          variant="outline"
          onPress={() => setShowShoppingListModal(true)}
        />
      </View>

      <Text className="mb-4 mt-6 text-xl font-bold capitalize text-text">
        {dayjs(selectedDate).format("D MMMM dddd")}
      </Text>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <AppCard>
          <Text className="text-center text-danger">
            Yemek planı yüklenemedi.
          </Text>
        </AppCard>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-3 pb-10"
        >
          {MEAL_TYPES.map((mealType) => {
            const item = selectedDayItems.find(
              (meal) => meal.mealType === mealType.value,
            );

            return (
              <MealCard
                key={mealType.value}
                mealType={mealType}
                item={item}
                onEdit={() => openMealPicker(mealType.value, item)}
                onDelete={() => {
                  if (item) {
                    setItemToDelete(item);
                  }
                }}
              />
            );
          })}

          {isFetching && !isLoading ? (
            <View className="py-2">
              <Text className="text-center text-sm text-muted">
                Plan güncelleniyor...
              </Text>
            </View>
          ) : null}
        </ScrollView>
      )}

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
        defaultName={`${weekStart.format("D MMM")} - ${weekEnd.format(
          "D MMM",
        )} Market Listesi`}
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
