import { AppCard } from "@/components";
import type { MealPlanItem } from "@/types/meal-plan";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface NutritionSummaryCardProps {
  title: string;
  items: MealPlanItem[];
  mode?: "total" | "daily-average";
  dayCount?: number;
}

interface NutritionTotals {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  analyzedItemCount: number;
}

function calculateTotals(items: MealPlanItem[]): NutritionTotals {
  return items.reduce<NutritionTotals>(
    (totals, item) => {
      const hasNutrition =
        item.caloriesPerServing != null &&
        item.proteinGramsPerServing != null &&
        item.carbohydrateGramsPerServing != null &&
        item.fatGramsPerServing != null;

      if (!hasNutrition) {
        return totals;
      }

      return {
        calories: totals.calories + (item.caloriesPerServing ?? 0),
        protein: totals.protein + (item.proteinGramsPerServing ?? 0),
        carbohydrates:
          totals.carbohydrates + (item.carbohydrateGramsPerServing ?? 0),
        fat: totals.fat + (item.fatGramsPerServing ?? 0),
        analyzedItemCount: totals.analyzedItemCount + 1,
      };
    },
    {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      analyzedItemCount: 0,
    },
  );
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

export function NutritionSummaryCard({
  title,
  items,
  mode = "total",
  dayCount = 1,
}: NutritionSummaryCardProps) {
  const totals = calculateTotals(items);

  if (totals.analyzedItemCount === 0) {
    return (
      <AppCard>
        <Text className="text-lg font-bold text-text">{title}</Text>

        <Text className="mt-2 text-sm leading-5 text-muted">
          {`Bu plandaki tariflerin besin değerleri henüz hesaplanmamış. Tarif detayına giderek "Besin Değerlerini Hesapla" seçeneğini kullanabilirsin.`}
        </Text>
      </AppCard>
    );
  }

  const divisor = mode === "daily-average" ? Math.max(dayCount, 1) : 1;

  const values = [
    {
      label: "Kalori",
      value: `${Math.round(totals.calories / divisor)} kcal`,
      icon: "flame-outline" as const,
    },
    {
      label: "Protein",
      value: `${formatNumber(totals.protein / divisor)} g`,
      icon: "barbell-outline" as const,
    },
    {
      label: "Karbonhidrat",
      value: `${formatNumber(totals.carbohydrates / divisor)} g`,
      icon: "nutrition-outline" as const,
    },
    {
      label: "Yağ",
      value: `${formatNumber(totals.fat / divisor)} g`,
      icon: "water-outline" as const,
    },
  ];

  const missingNutritionCount = items.length - totals.analyzedItemCount;

  return (
    <AppCard>
      <View className="mb-4">
        <Text className="text-lg font-bold text-text">{title}</Text>

        <Text className="mt-1 text-sm leading-5 text-muted">
          Porsiyon başına tahmini değerler üzerinden hesaplanmıştır.
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {values.map((item) => (
          <View
            key={item.label}
            className="w-[48%] rounded-2xl bg-background p-4"
          >
            <Ionicons name={item.icon} size={21} color="#E85D04" />

            <Text className="mt-3 text-sm text-muted">{item.label}</Text>

            <Text className="mt-1 text-lg font-bold text-text">
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      {missingNutritionCount > 0 ? (
        <Text className="mt-4 text-xs leading-5 text-muted">
          {missingNutritionCount} öğünün besin değerleri henüz hesaplanmadığı
          için toplama dahil edilmedi.
        </Text>
      ) : null}
    </AppCard>
  );
}
