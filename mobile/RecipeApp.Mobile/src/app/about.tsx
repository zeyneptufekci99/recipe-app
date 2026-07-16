import { AppCard, AppScreen, PageHeader } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TECH_STACK = [
  {
    label: "React Native",
    icon: "phone-portrait-outline" as const,
  },
  {
    label: "Expo",
    icon: "rocket-outline" as const,
  },
  {
    label: "ASP.NET Core",
    icon: "server-outline" as const,
  },
  {
    label: "PostgreSQL",
    icon: "layers-outline" as const,
  },
  {
    label: "Gemini AI",
    icon: "sparkles-outline" as const,
  },
];

export default function AboutScreen() {
  const version =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "1.0.0";

  const platform = Constants.platform?.web ? "Web" : "Mobil";

  const handleOpenGitHub = async () => {
    await Linking.openURL("https://github.com/YOUR_GITHUB_USERNAME");
  };

  return (
    <AppScreen>
      <PageHeader title="Hakkında" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <AppCard className="overflow-hidden bg-primary p-0">
          <View className="items-center px-6 py-8">
            <View className="h-24 w-24 items-center justify-center rounded-[32px] border-4 border-white/20 bg-white/15">
              <Ionicons name="restaurant" size={43} color="#FFFFFF" />
            </View>

            <Text className="mt-5 text-3xl font-bold text-white">Cooksy</Text>

            <Text className="mt-2 text-center text-base font-semibold text-white/90">
              AI destekli tarif ve yemek planlama asistanın
            </Text>

            <Text className="mt-3 max-w-sm text-center text-sm leading-6 text-white/75">
              Tariflerini oluştur, düzenle, planla ve alışveriş süreçlerini tek
              bir uygulamada yönet.
            </Text>

            <View className="mt-5 rounded-full bg-white/15 px-4 py-2">
              <Text className="text-xs font-bold text-white">
                Sürüm {version}
              </Text>
            </View>
          </View>
        </AppCard>

        <View className="mt-8">
          <SectionHeader
            title="Uygulama Bilgileri"
            description="Cooksy'nin sürüm ve platform detayları."
          />

          <AppCard className="gap-4">
            <InfoRow icon="code-slash-outline" label="Sürüm" value={version} />

            <Divider />

            <InfoRow
              icon="phone-portrait-outline"
              label="Platform"
              value={platform}
            />

            <Divider />

            <InfoRow
              icon="person-outline"
              label="Geliştirici"
              value="Zeynep Tüfekçi"
            />
          </AppCard>
        </View>

        <View className="mt-8">
          <SectionHeader
            title="Teknolojiler"
            description="Cooksy'nin geliştirildiği temel araçlar."
          />

          <View className="flex-row flex-wrap gap-3">
            {TECH_STACK.map((technology) => (
              <View
                key={technology.label}
                className="w-[48%] rounded-2xl border border-border bg-surface p-4"
              >
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Ionicons name={technology.icon} size={21} color="#E85D04" />
                </View>

                <Text className="mt-3 font-bold text-text">
                  {technology.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-8">
          <SectionHeader
            title="Proje"
            description="Kaynak kodu ve geliştirme süreci."
          />

          <AppCard className="overflow-hidden p-0">
            <TouchableOpacity
              onPress={handleOpenGitHub}
              activeOpacity={0.85}
              accessibilityRole="link"
              accessibilityLabel="Cooksy GitHub projesini aç"
              className="flex-row items-center p-4"
            >
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-background">
                <Ionicons name="logo-github" size={24} color="#2B2B2B" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-base font-bold text-text">GitHub</Text>

                <Text className="mt-1 text-sm leading-5 text-muted">
                  Cooksy kaynak kodunu incele
                </Text>
              </View>

              <Ionicons name="open-outline" size={20} color="#7A7A7A" />
            </TouchableOpacity>
          </AppCard>
        </View>

        <View className="mt-8 items-center px-6">
          <Ionicons name="heart" size={19} color="#E85D04" />

          <Text className="mt-2 text-center text-sm leading-6 text-muted">
            Cooksy, tarif yönetimini ve günlük yemek planlamayı daha kolay hale
            getirmek için geliştirildi.
          </Text>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View className="flex-row items-center">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        <Ionicons name={icon} size={20} color="#E85D04" />
      </View>

      <Text className="ml-3 flex-1 text-muted">{label}</Text>

      <Text className="max-w-[48%] text-right font-semibold text-text">
        {value}
      </Text>
    </View>
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
  return <View className="h-px bg-border" />;
}
