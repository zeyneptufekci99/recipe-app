import type { RecipeSort } from "@/types/recipe";
import { cn } from "@/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface SortOption {
  label: string;
  value: RecipeSort;
}

const sortOptions: SortOption[] = [
  { label: "Newest", value: "created_desc" },
  { label: "Oldest", value: "created_asc" },
  { label: "A → Z", value: "title_asc" },
  { label: "Z → A", value: "title_desc" },
  { label: "Favorites First", value: "favorites_first" },
];

interface SortSelectorProps {
  value: RecipeSort;
  onChange: (value: RecipeSort) => void;
}

export function SortSelector({ value, onChange }: SortSelectorProps) {
  const [visible, setVisible] = useState(false);

  const selectedLabel =
    sortOptions.find((option) => option.value === value)?.label ?? "Sort";

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface"
      >
        <Ionicons name="swap-vertical-outline" size={22} color="#2B2B2B" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setVisible(false)}
          className="flex-1 justify-end bg-black/40"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="rounded-t-3xl bg-background p-5"
          >
            <Text className="mb-4 text-xl font-bold text-text">Sort by</Text>

            <View className="gap-2">
              {sortOptions.map((option) => {
                const selected = option.value === value;

                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      setVisible(false);
                    }}
                    className={cn(
                      "flex-row items-center justify-between rounded-xl px-4 py-4",
                      selected ? "bg-primary" : "bg-surface",
                    )}
                  >
                    <Text
                      className={cn(
                        "text-base font-semibold",
                        selected ? "text-white" : "text-text",
                      )}
                    >
                      {option.label}
                    </Text>

                    {selected ? (
                      <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="mt-4 text-center text-sm text-muted">
              Current: {selectedLabel}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
