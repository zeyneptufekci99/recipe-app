import { AppCard } from "@/components";
import type { RecipeDetail } from "@/types/recipe";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface NutritionCardProps {
  recipe: RecipeDetail;
}

export function NutritionCard({ recipe }: NutritionCardProps) {
  const hasNutrition =
    recipe.caloriesPerServing != null &&
    recipe.proteinGramsPerServing != null &&
    recipe.carbohydrateGramsPerServing != null &&
    recipe.fatGramsPerServing != null;

  if (!hasNutrition) return null;

  const items = [
    {
      label: "Kalori",
      value: `${recipe.caloriesPerServing} kcal`,
      icon: "flame-outline" as const,
    },
    {
      label: "Protein",
      value: `${recipe.proteinGramsPerServing} g`,
      icon: "barbell-outline" as const,
    },
    {
      label: "Karbonhidrat",
      value: `${recipe.carbohydrateGramsPerServing} g`,
      icon: "nutrition-outline" as const,
    },
    {
      label: "Yağ",
      value: `${recipe.fatGramsPerServing} g`,
      icon: "water-outline" as const,
    },
  ];

  return (
    <AppCard className="mt-5">
      <View className="mb-4">
        <Text className="text-lg font-bold text-text">
          Tahmini Besin Değerleri
        </Text>

        <Text className="mt-1 text-sm text-muted">
          Değerler porsiyon başınadır ve AI tarafından tahmini olarak
          hesaplanmıştır.
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {items.map((item) => (
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
    </AppCard>
  );
}
