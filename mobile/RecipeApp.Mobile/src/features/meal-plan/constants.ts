import type { MealType } from "@/types/meal-plan";

export const MEAL_TYPES: {
  value: MealType;
  label: string;
  icon: string;
}[] = [
  {
    value: 1,
    label: "Kahvaltı",
    icon: "sunny-outline",
  },
  {
    value: 2,
    label: "Öğle Yemeği",
    icon: "restaurant-outline",
  },
  {
    value: 3,
    label: "Akşam Yemeği",
    icon: "moon-outline",
  },
  {
    value: 4,
    label: "Atıştırmalık",
    icon: "cafe-outline",
  },
];
