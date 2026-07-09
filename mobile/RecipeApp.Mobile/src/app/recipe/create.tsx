import { AppScreen } from "@/components";
import { RecipeForm } from "@/features/recipe/components/recipe-form";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function CreateRecipeScreen() {
  return (
    <AppScreen>
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-text">Yeni Tarif</Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary font-semibold">Kapat</Text>
        </TouchableOpacity>
      </View>

      <RecipeForm />
    </AppScreen>
  );
}
