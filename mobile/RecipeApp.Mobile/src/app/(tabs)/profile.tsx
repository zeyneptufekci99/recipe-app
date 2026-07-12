import { AppCard, AppScreen, LoadingSpinner, StatCard } from "@/components";
import { useGetRecipeStatisticsQuery } from "@/features/recipe/api";

import { useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const user = useAppSelector((state) => state.auth.user);

  const { data: statistics, isLoading, error } = useGetRecipeStatisticsQuery();

  return (
    <AppScreen className="px-0 pt-0">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-4 pb-10 pt-10"
      >
        <Text className="mb-6 text-3xl font-bold text-text">Profile</Text>

        <AppCard className="p-5">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary">
            <Text className="text-3xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </Text>
          </View>

          <Text className="text-2xl font-bold text-text">
            {user?.name ?? "User"}
          </Text>

          <Text className="mt-1 text-base text-muted">
            {user?.email ?? "No email"}
          </Text>
        </AppCard>

        <TouchableOpacity
          onPress={() => router.push("/settings")}
          activeOpacity={0.8}
          className="mt-6 flex-row items-center justify-between rounded-2xl border border-border bg-surface p-5"
        >
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-background">
              <Ionicons name="settings-outline" size={22} color="#7A7A7A" />
            </View>

            <View>
              <Text className="text-base font-semibold text-text">
                Settings
              </Text>

              <Text className="mt-1 text-sm text-muted">
                Theme, about and account options
              </Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#7A7A7A" />
        </TouchableOpacity>

        <Text className="mb-3 mt-8 text-lg font-bold text-text">
          Statistics
        </Text>

        {isLoading ? (
          <LoadingSpinner />
        ) : error || !statistics ? (
          <AppCard>
            <Text className="text-center text-danger">
              İstatistikler yüklenemedi.
            </Text>
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
                title="Manuel"
                value={statistics.manualRecipeCount}
                icon="create-outline"
              />
            </View>

            <AppCard className="mt-3">
              <View className="flex-row items-center gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Ionicons name="trophy-outline" size={22} color="#E85D04" />
                </View>

                <View className="flex-1">
                  <Text className="text-sm text-muted">
                    En Çok Kullanılan Kategori
                  </Text>

                  <Text className="mt-1 text-lg font-bold text-text">
                    {statistics.mostUsedCategory || "Henüz veri yok"}
                  </Text>
                </View>
              </View>
            </AppCard>
          </>
        )}
      </ScrollView>
    </AppScreen>
  );
}
