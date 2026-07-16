import {
  AppButton,
  AppCard,
  AppScreen,
  LoadingSpinner,
  StatCard,
} from "@/components";
import { useGetRecipeStatisticsQuery } from "@/features/recipe/api";
import { useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface NavigationCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function ProfileScreen() {
  const user = useAppSelector((state) => state.auth.user);

  const {
    data: statistics,
    isLoading,
    error,
    refetch,
  } = useGetRecipeStatisticsQuery();

  const userName = user?.name?.trim() || "Kullanıcı";
  const userInitial = userName.charAt(0).toLocaleUpperCase("tr");

  return (
    <AppScreen className="px-0 pt-0">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-4 pb-10 pt-10"
      >
        <View className="mb-6">
          <Text className="text-3xl font-bold text-text">Profil</Text>

          <Text className="mt-1 text-base text-muted">
            Cooksy hesabını ve tarif arşivini yönet
          </Text>
        </View>

        <AppCard className="overflow-hidden bg-primary p-0">
          <View className="p-6">
            <View className="flex-row items-center">
              <View className="h-20 w-20 items-center justify-center rounded-full border-4 border-white/25 bg-white/15">
                <Text className="text-3xl font-bold text-white">
                  {userInitial}
                </Text>
              </View>

              <View className="ml-4 flex-1">
                <Text className="text-2xl font-bold text-white">
                  {userName}
                </Text>

                <Text numberOfLines={1} className="mt-1 text-sm text-white/80">
                  {user?.email ?? "E-posta bilgisi bulunmuyor"}
                </Text>

                <View className="mt-3 self-start rounded-full bg-white/15 px-3 py-1.5">
                  <Text className="text-xs font-semibold text-white">
                    Cooksy kullanıcısı
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </AppCard>

        <View className="mt-8">
          <Text className="mb-3 text-lg font-bold text-text">
            Cooksy Araçları
          </Text>

          <View className="gap-3">
            <NavigationCard
              title="Yemek Planı"
              description="Haftalık öğünlerini manuel veya AI ile planla"
              icon="calendar-outline"
              onPress={() => router.push("/meal-planner")}
            />

            <NavigationCard
              title="Alışveriş Listeleri"
              description="Tarif ve yemek planı malzemelerini yönet"
              icon="cart-outline"
              onPress={() => router.push("/shopping-lists")}
            />

            <NavigationCard
              title="Koleksiyonlar"
              description="Tariflerini kendi başlıkların altında gruplandır"
              icon="albums-outline"
              onPress={() => router.push("/collections")}
            />

            <NavigationCard
              title="Ayarlar"
              description="Tema, hesap ve uygulama seçeneklerini yönet"
              icon="settings-outline"
              onPress={() => router.push("/settings")}
            />
          </View>
        </View>

        <View className="mt-8">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-text">
              Tarif İstatistikleri
            </Text>

            {statistics ? (
              <Text className="text-sm font-semibold text-primary">
                {statistics.recipeCount} tarif
              </Text>
            ) : null}
          </View>

          {isLoading ? (
            <AppCard className="py-10">
              <LoadingSpinner />
            </AppCard>
          ) : error || !statistics ? (
            <AppCard className="items-center py-8">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-danger/10">
                <Ionicons
                  name="alert-circle-outline"
                  size={27}
                  color="#D9480F"
                />
              </View>

              <Text className="mt-4 text-lg font-bold text-text">
                İstatistikler yüklenemedi
              </Text>

              <Text className="mt-2 text-center text-sm leading-5 text-muted">
                Bağlantını kontrol edip tekrar deneyebilirsin.
              </Text>

              <View className="mt-5 w-full">
                <AppButton
                  title="Tekrar Dene"
                  variant="outline"
                  onPress={refetch}
                />
              </View>
            </AppCard>
          ) : (
            <>
              <View className="flex-row gap-3">
                <StatCard
                  title="Tariflerim"
                  value={statistics.recipeCount}
                  icon="restaurant-outline"
                />

                <StatCard
                  title="Favorilerim"
                  value={statistics.favoriteCount}
                  icon="heart-outline"
                />
              </View>

              <View className="mt-3 flex-row gap-3">
                <StatCard
                  title="İçe Aktarılan"
                  value={statistics.importedRecipeCount}
                  icon="cloud-download-outline"
                />

                <StatCard
                  title="Manuel Eklenen"
                  value={statistics.manualRecipeCount}
                  icon="create-outline"
                />
              </View>

              <AppCard className="mt-3">
                <View className="flex-row items-center gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Ionicons name="trophy-outline" size={23} color="#E85D04" />
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm font-medium text-muted">
                      En çok kullanılan kategori
                    </Text>

                    <Text className="mt-1 text-lg font-bold text-text">
                      {statistics.mostUsedCategory || "Henüz yeterli veri yok"}
                    </Text>
                  </View>
                </View>
              </AppCard>
            </>
          )}
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function NavigationCard({
  title,
  description,
  icon,
  onPress,
}: NavigationCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={title}
      className="flex-row items-center rounded-2xl border border-border bg-surface p-4"
    >
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
        <Ionicons name={icon} size={23} color="#E85D04" />
      </View>

      <View className="ml-3 flex-1 pr-2">
        <Text className="text-base font-bold text-text">{title}</Text>

        <Text className="mt-1 text-sm leading-5 text-muted">{description}</Text>
      </View>

      <View className="h-9 w-9 items-center justify-center rounded-full bg-background">
        <Ionicons name="chevron-forward" size={19} color="#7A7A7A" />
      </View>
    </TouchableOpacity>
  );
}
