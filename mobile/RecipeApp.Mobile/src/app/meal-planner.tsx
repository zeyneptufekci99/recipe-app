import {
  AppCard,
  AppScreen,
  ConfirmDialog,
  LoadingSpinner,
  PageHeader,
} from "@/components";
import { DaySelector } from "@/features/meal-plan/components/day-selector";
import { MealCard } from "@/features/meal-plan/components/meal-card";
import { MealRecipePickerModal } from "@/features/meal-plan/components/meal-recipe-picker-modal";
import { WeekSelector } from "@/features/meal-plan/components/week-selector";

import { MEAL_TYPES } from "@/features/meal-plan/constants";
import { useMealPlan } from "@/features/meal-plan/hooks/use-meal-plan";
import dayjs from "@/lib/dayjs";
import { ScrollView, Text, View } from "react-native";

export default function MealPlannerScreen() {
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
    </AppScreen>
  );
}
