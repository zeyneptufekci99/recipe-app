import { IconButton } from "@/components";
import type { Dayjs } from "dayjs";
import { Text, TouchableOpacity, View } from "react-native";

interface WeekSelectorProps {
  weekStart: Dayjs;
  weekEnd: Dayjs;
  onPrevious: () => void;
  onNext: () => void;
  onCurrentWeek: () => void;
}

export function WeekSelector({
  weekStart,
  weekEnd,
  onPrevious,
  onNext,
  onCurrentWeek,
}: WeekSelectorProps) {
  const sameMonth = weekStart.month() === weekEnd.month();

  const dateLabel = sameMonth
    ? `${weekStart.format("D")}–${weekEnd.format("D MMMM YYYY")}`
    : `${weekStart.format("D MMM")}–${weekEnd.format("D MMM YYYY")}`;

  return (
    <View className="mb-5 flex-row items-center justify-between">
      <IconButton
        icon="chevron-back"
        onPress={onPrevious}
        accessibilityLabel="Önceki hafta"
      />

      <TouchableOpacity
        onPress={onCurrentWeek}
        activeOpacity={0.8}
        className="flex-1 px-3"
      >
        <Text className="text-center text-lg font-bold text-text">
          {dateLabel}
        </Text>

        <Text className="mt-1 text-center text-xs font-semibold text-primary">
          Bugüne dön
        </Text>
      </TouchableOpacity>

      <IconButton
        icon="chevron-forward"
        onPress={onNext}
        accessibilityLabel="Sonraki hafta"
      />
    </View>
  );
}
