import { STORAGE_KEYS } from "@/constants/storage-keys";
import { useAppSelector } from "@/store/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function IndexScreen() {
  const token = useAppSelector((state) => state.auth.token);

  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    const loadOnboardingStatus = async () => {
      const value = await AsyncStorage.getItem(
        STORAGE_KEYS.HAS_SEEN_ONBOARDING,
      );

      setHasSeenOnboarding(value === "true");
    };

    void loadOnboardingStatus();
  }, []);

  if (hasSeenOnboarding === null) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#E85D04" />
      </View>
    );
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return token ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
