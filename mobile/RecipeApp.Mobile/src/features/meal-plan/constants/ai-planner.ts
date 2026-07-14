import { MealPlanBudget, MealPlanDays, MealPlanGoal } from "@/types/ai-planner";
import type { MealType } from "@/types/meal-plan";
import type { Ionicons } from "@expo/vector-icons";

interface GoalOption {
  value: MealPlanGoal;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface BudgetOption {
  value: MealPlanBudget;
  label: string;
  description: string;
}

interface MealTypeOption {
  value: MealType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const AI_PLANNER_GOALS: GoalOption[] = [
  {
    value: "lose_weight",
    label: "Kilo Vermek",
    description: "Daha hafif ve dengeli öğünler",
    icon: "trending-down-outline",
  },
  {
    value: "gain_muscle",
    label: "Kas Yapmak",
    description: "Protein ağırlıklı öğünler",
    icon: "barbell-outline",
  },
  {
    value: "healthy",
    label: "Sağlıklı Beslenmek",
    description: "Çeşitli ve dengeli bir plan",
    icon: "leaf-outline",
  },
  {
    value: "gain_weight",
    label: "Kilo Almak",
    description: "Doyurucu ve besleyici öğünler",
    icon: "trending-up-outline",
  },
  {
    value: "mediterranean",
    label: "Akdeniz Diyeti",
    description: "Sebze, tahıl ve zeytinyağı ağırlıklı",
    icon: "sunny-outline",
  },
  {
    value: "vegetarian",
    label: "Vejetaryen",
    description: "Et içermeyen öğünler",
    icon: "nutrition-outline",
  },
  {
    value: "vegan",
    label: "Vegan",
    description: "Hayvansal ürün içermeyen öğünler",
    icon: "earth-outline",
  },
];

export const AI_PLANNER_DAY_OPTIONS: MealPlanDays[] = [3, 5, 7];

export const AI_PLANNER_MEAL_TYPES: MealTypeOption[] = [
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
    label: "Ara Öğün",
    icon: "cafe-outline",
  },
];

export const AI_PLANNER_PREP_TIMES = [15, 30, 45, 60];

export const AI_PLANNER_BUDGETS: BudgetOption[] = [
  {
    value: "low",
    label: "Düşük",
    description: "Ekonomik malzemeler",
  },
  {
    value: "medium",
    label: "Orta",
    description: "Fiyat ve çeşitlilik dengesi",
  },
  {
    value: "high",
    label: "Yüksek",
    description: "Daha geniş malzeme seçeneği",
  },
];

export const AI_PLANNER_ALLERGIES = [
  "Gluten",
  "Laktoz",
  "Yumurta",
  "Yer Fıstığı",
  "Kuruyemiş",
  "Balık",
  "Kabuklu Deniz Ürünleri",
] as const;
