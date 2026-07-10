import { AppCard, AppLink, AppScreen } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  return (
    <AppScreen>
      <View className="mb-6 flex-row items-center gap-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2B2B2B" />
        </TouchableOpacity>

        <Text className="text-3xl font-bold text-text">Settings</Text>
      </View>

      <AppCard>
        <TouchableOpacity className="flex-row items-center justify-between py-4">
          <Text className="text-base text-text">Theme</Text>

          <Text className="text-muted">Coming Soon</Text>
        </TouchableOpacity>

        <View className="h-px bg-border" />

        <TouchableOpacity className="flex-row items-center justify-between py-4">
          <Text className="text-base text-text">Language</Text>

          <Text className="text-muted">Coming Soon</Text>
        </TouchableOpacity>

        <View className="h-px bg-border" />

        <TouchableOpacity className="flex-row items-center justify-between py-4">
          <Text className="text-base text-text">About</Text>

          <Ionicons name="chevron-forward" size={18} color="#7A7A7A" />
        </TouchableOpacity>
      </AppCard>

      <View className="mt-8">
        <AppLink title="Back to Profile" onPress={() => router.back()} />
      </View>
    </AppScreen>
  );
}
