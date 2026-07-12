import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface SettingsItemProps {
  title: string;
  description?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  value?: string;
  danger?: boolean;
}

export function SettingsItem({
  title,
  description,
  icon,
  onPress,
  value,
  danger = false,
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
      className="flex-row items-center justify-between py-4"
    >
      <View className="flex-1 flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-background">
          <Ionicons
            name={icon}
            size={21}
            color={danger ? "#D9480F" : "#7A7A7A"}
          />
        </View>

        <View className="flex-1">
          <Text
            className={
              danger
                ? "text-base font-semibold text-danger"
                : "text-base font-semibold text-text"
            }
          >
            {title}
          </Text>

          {description ? (
            <Text className="mt-1 text-sm text-muted">{description}</Text>
          ) : null}
        </View>
      </View>

      {value ? (
        <Text className="text-sm text-muted">{value}</Text>
      ) : onPress ? (
        <Ionicons name="chevron-forward" size={18} color="#7A7A7A" />
      ) : null}
    </TouchableOpacity>
  );
}
