import { AppButton, AppScreen } from "@/components";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface OnboardingItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  features: string[];
}

const ONBOARDING_ITEMS: OnboardingItem[] = [
  {
    id: "ai-recipe",
    icon: "sparkles-outline",
    title: "AI ile Tarif Oluştur",
    description:
      "İstediğin yemeği veya mutfağındaki malzemeleri yaz. Cooksy sana saniyeler içinde uygulanabilir bir tarif hazırlasın.",
    features: [
      "Elindeki malzemeleri değerlendir",
      "Tariflerini AI ile düzenle",
      "AI Şef'e sorular sor",
    ],
  },
  {
    id: "meal-plan",
    icon: "calendar-outline",
    title: "Haftanı Kolayca Planla",
    description:
      "Hedeflerine, bütçene ve zamanına uygun kişisel yemek planını AI ile otomatik olarak oluştur.",
    features: [
      "3, 5 veya 7 günlük plan",
      "Günlük ve haftalık besin özeti",
      "Manuel öğün düzenleme",
    ],
  },
  {
    id: "organize",
    icon: "restaurant-outline",
    title: "Her Şey Tek Yerde",
    description:
      "Tariflerini koleksiyonlarda düzenle, alışveriş listeni oluştur ve tüm yemek sürecini tek uygulamadan yönet.",
    features: [
      "Akıllı alışveriş listeleri",
      "Kişisel tarif koleksiyonları",
      "Tahmini besin değerleri",
    ],
  },
];

export default function OnboardingScreen() {
  const listRef = useRef<FlatList<OnboardingItem>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLastPage = currentIndex === ONBOARDING_ITEMS.length - 1;

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, "true");

    router.replace("/");
  };

  const handleNext = () => {
    if (isLastPage) {
      void completeOnboarding();
      return;
    }

    const nextIndex = currentIndex + 1;

    listRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    });

    setCurrentIndex(nextIndex);
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
    );

    setCurrentIndex(nextIndex);
  };

  const renderItem: ListRenderItem<OnboardingItem> = ({ item }) => (
    <View style={{ width: SCREEN_WIDTH }} className="flex-1 px-6">
      <View className="flex-1 items-center justify-center">
        <View className="h-32 w-32 items-center justify-center rounded-[40px] bg-primary/10">
          <View className="h-24 w-24 items-center justify-center rounded-[32px] bg-primary">
            <Ionicons name={item.icon} size={48} color="#FFFFFF" />
          </View>
        </View>

        <Text className="mt-10 text-center text-3xl font-bold leading-10 text-text">
          {item.title}
        </Text>

        <Text className="mt-4 max-w-sm text-center text-base leading-7 text-muted">
          {item.description}
        </Text>

        <View className="mt-8 w-full max-w-sm gap-3">
          {item.features.map((feature) => (
            <View
              key={feature}
              className="flex-row items-center rounded-2xl border border-border bg-surface p-4"
            >
              <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Ionicons name="checkmark" size={18} color="#E85D04" />
              </View>

              <Text className="ml-3 flex-1 font-semibold text-text">
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <AppScreen className="px-0">
      <View className="flex-row items-center justify-between px-6 pt-3">
        <Text className="text-2xl font-bold text-primary">Cooksy</Text>

        {!isLastPage ? (
          <TouchableOpacity
            onPress={() => void completeOnboarding()}
            activeOpacity={0.8}
            className="rounded-full px-3 py-2"
          >
            <Text className="font-semibold text-muted">Atla</Text>
          </TouchableOpacity>
        ) : (
          <View className="w-12" />
        )}
      </View>

      <FlatList
        ref={listRef}
        data={ONBOARDING_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
      />

      <View className="px-6 pb-7">
        <View className="mb-6 flex-row justify-center gap-2">
          {ONBOARDING_ITEMS.map((item, index) => (
            <View
              key={item.id}
              className={
                index === currentIndex
                  ? "h-2.5 w-8 rounded-full bg-primary"
                  : "h-2.5 w-2.5 rounded-full bg-border"
              }
            />
          ))}
        </View>

        <AppButton
          title={isLastPage ? "Cooksy'ye Başla" : "Devam Et"}
          onPress={handleNext}
        />
      </View>
    </AppScreen>
  );
}
