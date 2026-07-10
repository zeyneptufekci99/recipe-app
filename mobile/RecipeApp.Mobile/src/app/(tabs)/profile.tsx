import { AppButton, AppCard, AppScreen } from "@/components";
import { logout } from "@/features/auth/auth-slice";
import {
  useGetFavoriteRecipesQuery,
  useGetRecipesQuery,
} from "@/features/recipe/api";
import { storageService } from "@/services/storage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { data: recipesData } = useGetRecipesQuery({
    page: 1,
    pageSize: 1,
  });

  const { data: favoritesData } = useGetFavoriteRecipesQuery();
  const handleLogout = async () => {
    await storageService.removeToken();
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <AppScreen>
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

      <View className="mt-6 flex-row gap-3">
        <View className="flex-1 rounded-2xl bg-surface p-5">
          <Text className="text-2xl font-bold text-primary">
            {recipesData?.totalCount ?? 0}
          </Text>
          <Text className="mt-1 text-muted">Tariflerim</Text>
        </View>

        <View className="flex-1 rounded-2xl bg-surface p-5">
          <Text className="text-2xl font-bold text-primary">
            {favoritesData?.totalCount ?? 0}
          </Text>
          <Text className="mt-1 text-muted">Favorilerim</Text>
        </View>
      </View>

      <View className="mt-6 rounded-2xl bg-surface p-5">
        <Text className="mb-4 text-lg font-bold text-text">Account</Text>

        <AppButton title="Logout" onPress={handleLogout} variant="danger" />
      </View>
    </AppScreen>
  );
}
