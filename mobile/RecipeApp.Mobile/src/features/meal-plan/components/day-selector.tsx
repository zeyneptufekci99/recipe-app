import { cn } from "@/utils/cn";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface WeekDay {
  date: string;
  dayName: string;
  dayNumber: string;
  isToday: boolean;
  plannedCount: number;
}

interface DaySelectorProps {
  days: WeekDay[];
  selectedDate: string;
  onSelect: (date: string) => void;
}

export function DaySelector({
  days,
  selectedDate,
  onSelect,
}: DaySelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 pb-2"
    >
      {days.map((day) => {
        const selected = selectedDate === day.date;

        return (
          <TouchableOpacity
            key={day.date}
            onPress={() => onSelect(day.date)}
            activeOpacity={0.8}
            className={cn(
              "w-16 items-center rounded-2xl border px-3 py-3",
              selected
                ? "border-primary bg-primary"
                : "border-border bg-surface",
            )}
          >
            <Text
              className={cn(
                "text-xs font-semibold uppercase",
                selected ? "text-white/80" : "text-muted",
              )}
            >
              {day.dayName}
            </Text>

            <Text
              className={cn(
                "mt-1 text-xl font-bold",
                selected ? "text-white" : "text-text",
              )}
            >
              {day.dayNumber}
            </Text>

            <View className="mt-2 h-2 flex-row gap-1">
              {day.plannedCount > 0
                ? Array.from(
                    {
                      length: Math.min(day.plannedCount, 4),
                    },
                    (_, index) => (
                      <View
                        key={index}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          selected ? "bg-white" : "bg-primary",
                        )}
                      />
                    ),
                  )
                : day.isToday && (
                    <View
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        selected ? "bg-white" : "bg-primary",
                      )}
                    />
                  )}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
