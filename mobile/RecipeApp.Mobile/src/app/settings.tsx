import { AppCard, AppScreen, ConfirmDialog, PageHeader } from "@/components";
import { logout } from "@/features/auth/auth-slice";
import { SettingsItem } from "@/features/settings/components/settings-item";
import { ThemeSelector } from "@/features/settings/components/theme-selector";
import { shareService } from "@/services/share-service";
import { storageService } from "@/services/storage";
import { toastService } from "@/services/toast-service";
import { useAppDispatch } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

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

      toastService.error("Paylaşım başarısız", "Cooksy şu anda paylaşılamadı.");
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <AppCard className="mb-6 overflow-hidden bg-primary p-0">
          <View className="p-5">
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Ionicons name="settings-outline" size={25} color="#FFFFFF" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xl font-bold text-white">
                  Cooksy Ayarları
                </Text>

                <Text className="mt-1 text-sm leading-5 text-white/80">
                  Görünüm, hesap ve uygulama seçeneklerini yönet.
                </Text>
              </View>
            </View>
          </View>
        </AppCard>

        <SectionHeader
          title="Görünüm"
          description="Uygulamanın nasıl görüneceğini seç."
        />

        <ThemeSelector />

        <View className="mt-8">
          <SectionHeader
            title="Uygulama"
            description="Cooksy hakkında bilgi al veya paylaş."
          />

          <AppCard className="overflow-hidden p-0">
            <SettingsItem
              title="Uygulamayı Paylaş"
              description="Cooksy'yi arkadaşlarınla paylaş"
              icon="share-social-outline"
              onPress={handleShareApp}
            />

            <Divider />

            <SettingsItem
              title="Hakkında"
              description="Cooksy ve kullanılan teknolojiler"
              icon="information-circle-outline"
              onPress={() => router.push("/about")}
            />

            <Divider />

            <SettingsItem
              title="Sürüm"
              description="Yüklü uygulama sürümü"
              icon="code-slash-outline"
              value={appVersion}
            />
          </AppCard>
        </View>

        <View className="mt-8">
          <SectionHeader
            title="Hesap"
            description="Oturum ve hesap işlemlerini yönet."
          />

          <AppCard className="overflow-hidden p-0">
            <SettingsItem
              title="Çıkış Yap"
              description="Hesabından güvenli şekilde çık"
              icon="log-out-outline"
              onPress={() => setShowLogoutDialog(true)}
              danger
            />
          </AppCard>
        </View>

        <View className="mt-8 items-center">
          <Text className="text-sm font-bold text-primary">Cooksy</Text>

          <Text className="mt-1 text-xs text-muted">
            AI destekli tarif ve yemek planlama asistanın
          </Text>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={showLogoutDialog}
        title="Çıkış Yap"
        description="Hesabından çıkmak istediğine emin misin?"
        confirmText="Çıkış Yap"
        cancelText="Vazgeç"
        variant="danger"
        loading={isLoggingOut}
        onCancel={() => {
          if (!isLoggingOut) {
            setShowLogoutDialog(false);
          }
        }}
        onConfirm={handleConfirmLogout}
      />
    </AppScreen>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View className="mb-3">
      <Text className="text-lg font-bold text-text">{title}</Text>

      <Text className="mt-1 text-sm leading-5 text-muted">{description}</Text>
    </View>
  );
}

function Divider() {
  return <View className="mx-4 h-px bg-border" />;
}
