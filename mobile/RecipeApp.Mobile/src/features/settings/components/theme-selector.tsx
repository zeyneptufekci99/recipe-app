import { AppCard } from "@/components";
import { useAppTheme } from "@/features/settings/theme-provider";
import { ThemeMode } from "@/types/themes";
import { cn } from "@/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface ThemeOption {
  value: ThemeMode;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const themeOptions: ThemeOption[] = [
  {
    value: "system",
    label: "Sistem",
    description: "Cihaz temasını kullan",
    icon: "phone-portrait-outline",
  },
  {
    value: "light",
    label: "Açık",
    description: "Her zaman açık tema",
    icon: "sunny-outline",
  },
  {
    value: "dark",
    label: "Koyu",
    description: "Her zaman koyu tema",
    icon: "moon-outline",
  },
];

export function ThemeSelector() {
  const { themeMode, changeTheme } = useAppTheme();

  return (
    <View>
      <Text className="mb-3 text-lg font-bold text-text">Tema</Text>

      <AppCard className="gap-2">
        {themeOptions.map((option) => {
          const selected = themeMode === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => changeTheme(option.value)}
              activeOpacity={0.8}
              className={cn(
                "flex-row items-center justify-between rounded-xl px-4 py-4",
                selected ? "bg-primary" : "bg-background",
              )}
            >
              <View className="flex-1 flex-row items-center gap-3">
                <Ionicons
                  name={option.icon}
                  size={22}
                  color={selected ? "#FFFFFF" : "#7A7A7A"}
                />

                <View className="flex-1">
                  <Text
                    className={cn(
                      "text-base font-semibold",
                      selected ? "text-white" : "text-text",
                    )}
                  >
                    {option.label}
                  </Text>

                  <Text
                    className={cn(
                      "mt-1 text-sm",
                      selected ? "text-white/80" : "text-muted",
                    )}
                  >
                    {option.description}
                  </Text>
                </View>
              </View>

              {selected ? (
                <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </AppCard>
    </View>
  );
}
