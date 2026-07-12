import { cn } from "@/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconName;
  className?: string;
}

export function StatCard({ title, value, icon, className }: StatCardProps) {
  return (
    <View
      className={cn(
        "flex-1 rounded-2xl border border-border bg-surface p-4",
        className,
      )}
    >
      <View className="mb-4 h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        <Ionicons name={icon} size={21} color="#E85D04" />
      </View>

      <Text className="text-2xl font-bold text-text">{value}</Text>

      <Text className="mt-1 text-sm text-muted">{title}</Text>
    </View>
  );
}
