import { AppInput } from "@/components";
import type { CreateRecipeStepRequest } from "@/types/recipe";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface StepEditorProps {
  steps: CreateRecipeStepRequest[];
  onChange: (steps: CreateRecipeStepRequest[]) => void;
}

export function StepEditor({ steps, onChange }: StepEditorProps) {
  const updateStep = (index: number, description: string) => {
    const updated = steps.map((step, i) =>
      i === index
        ? {
            ...step,
            description,
          }
        : step,
    );

    onChange(updated);
  };

  const addStep = () => {
    onChange([
      ...steps,
      {
        stepNumber: steps.length + 1,
        description: "",
      },
    ]);
  };

  const removeStep = (index: number) => {
    if (steps.length === 1) return;

    const updated = steps
      .filter((_, i) => i !== index)
      .map((step, i) => ({
        ...step,
        stepNumber: i + 1,
      }));

    onChange(updated);
  };

  return (
    <View>
      <Text className="mb-3 text-base font-semibold text-text">
        Instructions
      </Text>

      <View className="gap-3">
        {steps.map((step, index) => (
          <View
            key={index}
            className="rounded-2xl border border-border bg-surface p-4"
          >
            <View className="mb-3 flex-row items-center justify-between">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Text className="font-bold text-white">{index + 1}</Text>
              </View>

              <TouchableOpacity onPress={() => removeStep(index)}>
                <Ionicons name="trash-outline" size={20} color="#D9480F" />
              </TouchableOpacity>
            </View>

            <AppInput
              value={step.description}
              onChangeText={(value) => updateStep(index, value)}
              placeholder="Describe this step..."
              multiline
              textAlignVertical="top"
              className="min-h-24 bg-background"
            />
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={addStep}
        className="mt-4 rounded-xl border border-primary py-3"
      >
        <Text className="text-center font-bold text-primary">+ Add Step</Text>
      </TouchableOpacity>
    </View>
  );
}
