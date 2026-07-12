import { AppCard, AppScreen, ConfirmDialog, PageHeader } from "@/components";

import { logout } from "@/features/auth/auth-slice";
import { SettingsItem } from "@/features/settings/components/settings-item";
import { ThemeSelector } from "@/features/settings/components/theme-selector";
import { shareService } from "@/services/share-service";
import { storageService } from "@/services/storage";
import { toastService } from "@/services/toast-service";
import { useAppDispatch } from "@/store/hooks";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const appVersion =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "1.0.0";

  const handleShareApp = async () => {
    try {
      await shareService.shareApp();
    } catch (error) {
      console.log("Share app error:", error);
      toastService.error("Paylaşım başarısız", "Uygulama paylaşılamadı.");
    }
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);

      await storageService.removeToken();

      dispatch(logout());

      router.replace("/login");
    } catch (error) {
      console.log("Logout error:", error);

      toastService.error("Çıkış yapılamadı", "Lütfen tekrar deneyin.");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <AppScreen>
      <PageHeader title="Ayarlar" />

      <ThemeSelector />

      <Text className="mb-3 mt-8 text-lg font-bold text-text">Uygulama</Text>

      <AppCard>
        <SettingsItem
          title="Uygulamayı Paylaş"
          description="RecipeApp'i arkadaşlarınla paylaş"
          icon="share-social-outline"
          onPress={handleShareApp}
        />

        <View className="h-px bg-border" />

        <SettingsItem
          title="Hakkında"
          description="Uygulama hakkında bilgi"
          icon="information-circle-outline"
          onPress={() => router.push("/about")}
        />

        <View className="h-px bg-border" />

        <SettingsItem
          title="Sürüm"
          icon="code-slash-outline"
          value={appVersion}
        />
      </AppCard>

      <Text className="mb-3 mt-8 text-lg font-bold text-text">Hesap</Text>

      <AppCard>
        <SettingsItem
          title="Çıkış Yap"
          description="Hesabından güvenli şekilde çık"
          icon="log-out-outline"
          onPress={() => setShowLogoutDialog(true)}
          danger
        />
      </AppCard>

      <ConfirmDialog
        visible={showLogoutDialog}
        title="Çıkış Yap"
        description="Hesabından çıkmak istediğine emin misin?"
        confirmText="Çıkış Yap"
        cancelText="Vazgeç"
        variant="danger"
        loading={isLoggingOut}
        onCancel={() => setShowLogoutDialog(false)}
        onConfirm={handleConfirmLogout}
      />
    </AppScreen>
  );
}
