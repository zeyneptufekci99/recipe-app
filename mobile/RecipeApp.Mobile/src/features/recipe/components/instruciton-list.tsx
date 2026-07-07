import type { RecipeStep } from "@/types/recipe";
import { Text, View } from "react-native";

interface InstructionListProps {
  steps: RecipeStep[];
}

export function InstructionList({ steps }: InstructionListProps) {
  return (
    <View className="mt-6">
      <Text className="mb-3 text-xl font-bold text-text">Instructions</Text>

      <View className="gap-3">
        {steps.map((step) => (
          <View key={step.id} className="flex-row gap-3">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Text className="font-bold text-white">{step.stepNumber}</Text>
            </View>

            <View className="flex-1 rounded-xl bg-surface p-4">
              <Text className="text-base leading-6 text-text">
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
