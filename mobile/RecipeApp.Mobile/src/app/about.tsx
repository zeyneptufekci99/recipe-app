import { AppCard, AppScreen, PageHeader } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Linking, Text, TouchableOpacity, View } from "react-native";

export default function AboutScreen() {
  const version =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "1.0.0";

  const platform = Constants.platform?.web ? "Web" : "Mobile";

  return (
    <AppScreen>
      <PageHeader title="Hakkında" />

      <View className="mb-8 items-center">
        <View className="mb-4 h-24 w-24 items-center justify-center rounded-3xl bg-primary">
          <Ionicons name="restaurant" size={42} color="#FFFFFF" />
        </View>

        <Text className="text-3xl font-bold text-text">RecipeApp</Text>

        <Text className="mt-2 text-center text-muted">
          Tariflerini tek bir yerde yönet.
        </Text>
      </View>

      <AppCard className="gap-4">
        <InfoRow label="Sürüm" value={version} />
        <InfoRow label="Platform" value={platform} />
        <InfoRow label="Geliştirici" value="Zeynep Tüfekçi" />
      </AppCard>

      <AppCard className="mt-6">
        <TouchableOpacity
          className="flex-row items-center justify-between py-2"
          onPress={() =>
            Linking.openURL("https://github.com/YOUR_GITHUB_USERNAME")
          }
        >
          <View className="flex-row items-center gap-3">
            <Ionicons name="logo-github" size={22} color="#7A7A7A" />

            <Text className="text-base font-semibold text-text">GitHub</Text>
          </View>

          <Ionicons name="open-outline" size={18} color="#7A7A7A" />
        </TouchableOpacity>
      </AppCard>
    </AppScreen>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-muted">{label}</Text>
      <Text className="font-semibold text-text">{value}</Text>
    </View>
  );
}
