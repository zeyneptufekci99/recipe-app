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
  onEdit: () => void;
  onDelete: () => void;
}

export function MealCard({ mealType, item, onEdit, onDelete }: MealCardProps) {
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
            <TouchableOpacity
              onPress={() => router.push(`/recipe/${item.recipeId}`)}
              activeOpacity={0.8}
            >
              <Text className="mt-1 text-base font-bold text-text">
                {item.recipeTitle}
              </Text>
            </TouchableOpacity>
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
