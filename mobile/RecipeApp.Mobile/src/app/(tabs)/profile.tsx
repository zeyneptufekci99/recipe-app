import { logout } from "@/features/auth/auth-slice";
import { storageService } from "@/services/storage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = async () => {
    await storageService.removeToken();
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <View className="flex-1 bg-background px-4 pt-10">
      <Text className="mb-6 text-3xl font-bold text-text">Profile</Text>

      <View className="rounded-2xl bg-surface p-5">
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
      </View>

      <View className="mt-6 rounded-2xl bg-surface p-5">
        <Text className="mb-4 text-lg font-bold text-text">Account</Text>

        <TouchableOpacity
          onPress={handleLogout}
          className="rounded-xl bg-red-500 py-4"
        >
          <Text className="text-center font-bold text-white">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
