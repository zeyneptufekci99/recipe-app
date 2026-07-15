import { AppCard, IconButton } from "@/components";
import type { MealPlanItem, MealType } from "@/types/meal-plan";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface MealCardProps {
  mealType: {
    value: MealType;
    label: string;
    icon: string;
  };
  item?: MealPlanItem;
  isEstimatingNutrition?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onEstimateNutrition: () => void;
}

export function MealCard({
  mealType,
  item,
  isEstimatingNutrition = false,
  onEdit,
  onDelete,
  onEstimateNutrition,
}: MealCardProps) {
  const hasNutrition =
    item?.caloriesPerServing != null &&
    item?.proteinGramsPerServing != null &&
    item?.carbohydrateGramsPerServing != null &&
    item?.fatGramsPerServing != null;

  return (
    <AppCard>
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Ionicons
            name={mealType.icon as keyof typeof Ionicons.glyphMap}
            size={22}
            color="#E85D04"
          />
        </View>

        <View className="flex-1">
          <Text className="text-sm font-semibold text-muted">
            {mealType.label}
          </Text>

          {item ? (
            <>
              <TouchableOpacity
                onPress={() => router.push(`/recipe/${item.recipeId}`)}
                activeOpacity={0.8}
              >
                <Text className="mt-1 text-base font-bold text-text">
                  {item.recipeTitle}
                </Text>
              </TouchableOpacity>

              {!hasNutrition ? (
                <TouchableOpacity
                  onPress={onEstimateNutrition}
                  disabled={isEstimatingNutrition}
                  activeOpacity={0.8}
                  className="mt-2 flex-row items-center self-start rounded-full bg-secondary/10 px-3 py-1.5"
                >
                  <Ionicons name="warning-outline" size={15} color="#FAA307" />

                  <Text className="ml-1.5 text-xs font-semibold text-secondary">
                    {isEstimatingNutrition
                      ? "Hesaplanıyor..."
                      : "Besin değerini hesapla"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View className="mt-2 flex-row items-center">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={15}
                    color="#2F9E44"
                  />

                  <Text className="ml-1.5 text-xs font-semibold text-success">
                    Besin değerleri hazır
                  </Text>
                </View>
              )}
            </>
          ) : (
            <Text className="mt-1 text-sm text-muted">
              Henüz tarif eklenmedi
            </Text>
          )}
        </View>

        <IconButton
          icon={item ? "create-outline" : "add"}
          onPress={onEdit}
          color="#E85D04"
          accessibilityLabel={item ? "Öğünü değiştir" : "Öğün ekle"}
        />

        {item ? (
          <IconButton
            icon="trash-outline"
            onPress={onDelete}
            color="#D9480F"
            backgroundClassName="bg-danger/10"
            accessibilityLabel="Öğünü kaldır"
          />
        ) : null}
      </View>
    </AppCard>
  );
}
