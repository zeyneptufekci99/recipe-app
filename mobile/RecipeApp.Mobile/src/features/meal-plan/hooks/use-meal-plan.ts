import {
  useCreateMealPlanItemMutation,
  useDeleteMealPlanItemMutation,
  useGetMealPlanQuery,
} from "@/features/meal-plan/api";
import dayjs from "@/lib/dayjs";
import { toastService } from "@/services/toast-service";
import type { MealPlanItem, MealType } from "@/types/meal-plan";
import { useMemo, useState } from "react";

interface SelectedMeal {
  mealType: MealType;
  existingItem?: MealPlanItem;
}

export function useMealPlan() {
  const today = dayjs().startOf("day");

  const [weekStart, setWeekStart] = useState(() => today.startOf("isoWeek"));

  const [selectedDate, setSelectedDate] = useState(() =>
    today.format("YYYY-MM-DD"),
  );

  const [selectedMeal, setSelectedMeal] = useState<SelectedMeal | null>(null);

  const [itemToDelete, setItemToDelete] = useState<MealPlanItem | null>(null);

  const weekEnd = weekStart.endOf("isoWeek");

  const {
    data: mealPlan = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetMealPlanQuery({
    startDate: weekStart.format("YYYY-MM-DD"),
    endDate: weekEnd.format("YYYY-MM-DD"),
  });

  const [createMealPlanItem, { isLoading: isSaving }] =
    useCreateMealPlanItemMutation();

  const [deleteMealPlanItem, { isLoading: isDeleting }] =
    useDeleteMealPlanItemMutation();

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = weekStart.add(index, "day");
        const formattedDate = date.format("YYYY-MM-DD");

        return {
          date: formattedDate,
          dayName: date.format("ddd"),
          dayNumber: date.format("D"),
          isToday: date.isSame(today, "day"),
          plannedCount: mealPlan.filter((item) => item.date === formattedDate)
            .length,
        };
      }),
    [mealPlan, today, weekStart],
  );

  const selectedDayItems = useMemo(
    () => mealPlan.filter((item) => item.date === selectedDate),
    [mealPlan, selectedDate],
  );

  const goToPreviousWeek = () => {
    const previousWeek = weekStart.subtract(1, "week");

    setWeekStart(previousWeek);
    setSelectedDate(previousWeek.format("YYYY-MM-DD"));
  };

  const goToNextWeek = () => {
    const nextWeek = weekStart.add(1, "week");

    setWeekStart(nextWeek);
    setSelectedDate(nextWeek.format("YYYY-MM-DD"));
  };

  const goToCurrentWeek = () => {
    const currentDate = dayjs().startOf("day");

    setWeekStart(currentDate.startOf("isoWeek"));
    setSelectedDate(currentDate.format("YYYY-MM-DD"));
  };

  const openMealPicker = (mealType: MealType, existingItem?: MealPlanItem) => {
    setSelectedMeal({
      mealType,
      existingItem,
    });
  };

  const closeMealPicker = () => {
    if (isSaving) return;

    setSelectedMeal(null);
  };

  const saveMeal = async (recipeId: string) => {
    if (!selectedMeal) return;

    try {
      await createMealPlanItem({
        recipeId,
        date: selectedDate,
        mealType: selectedMeal.mealType,
      }).unwrap();

      toastService.success(
        selectedMeal.existingItem ? "Öğün güncellendi" : "Öğün eklendi",
        "Tarif yemek planına kaydedildi.",
      );

      setSelectedMeal(null);
    } catch (saveError) {
      console.log("Save meal plan error:", saveError);

      toastService.error("Öğün kaydedilemedi", "Lütfen tekrar deneyin.");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteMealPlanItem(itemToDelete.id).unwrap();

      toastService.success(
        "Öğün kaldırıldı",
        "Tarif yemek planından çıkarıldı.",
      );

      setItemToDelete(null);
    } catch (deleteError) {
      console.log("Delete meal plan item error:", deleteError);

      toastService.error("Öğün silinemedi", "Lütfen tekrar deneyin.");
    }
  };

  return {
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
    refetch,
  };
}
