import { AppButton, AppCard, AppInput, IconButton } from "@/components";
import {
  AI_PLANNER_ALLERGIES,
  AI_PLANNER_BUDGETS,
  AI_PLANNER_DAY_OPTIONS,
  AI_PLANNER_GOALS,
  AI_PLANNER_MEAL_TYPES,
  AI_PLANNER_PREP_TIMES,
} from "@/features/meal-plan/constants/ai-planner";
import { useAiPlanner } from "@/features/meal-plan/hooks/use-ai-planner";
import { cn } from "@/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { AiPlannerFormValues } from "@/types/ai-planner";

interface AiPlannerWizardProps {
  visible: boolean;
  isGenerating: boolean;
  onClose: () => void;
  onGenerate: (values: AiPlannerFormValues) => void;
}

export function AiPlannerWizard({
  visible,
  isGenerating,
  onClose,
  onGenerate,
}: AiPlannerWizardProps) {
  const [ingredientInput, setIngredientInput] = useState("");

  const {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    canContinue,
    values,

    setGoal,
    increaseServings,
    decreaseServings,
    setDays,
    toggleMealType,
    setMaxPrepTime,
    setBudget,
    addExcludedIngredient,
    removeExcludedIngredient,
    toggleAllergy,
    setNotes,

    goNext,
    goBack,
    reset,
  } = useAiPlanner();

  const handleClose = () => {
    if (isGenerating) return;

    setIngredientInput("");
    reset();
    onClose();
  };
  const handleAddIngredient = () => {
    addExcludedIngredient(ingredientInput);
    setIngredientInput("");
  };

  const handleFinish = () => {
    onGenerate(values);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-4 py-8"
        onPress={handleClose}
      >
        <Pressable
          className="w-full max-w-lg"
          onPress={(event) => event.stopPropagation()}
        >
          <AppCard className="max-h-[92vh] p-0">
            <View className="flex-row items-center justify-between border-b border-border px-5 py-4">
              <View className="flex-1 pr-3">
                <Text className="text-xl font-bold text-text">
                  AI ile Haftalık Plan
                </Text>

                <Text className="mt-1 text-sm text-muted">
                  Adım {currentStep + 1} / {totalSteps}
                </Text>
              </View>

              <IconButton
                icon="close"
                onPress={handleClose}
                disabled={isGenerating}
                accessibilityLabel="Plan oluşturma penceresini kapat"
              />
            </View>

            <View className="h-1 bg-border">
              <View
                className="h-full bg-primary"
                style={{
                  width: `${((currentStep + 1) / totalSteps) * 100}%`,
                }}
              />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerClassName="p-5"
            >
              {currentStep === 0 ? (
                <GoalStep value={values.goal} onChange={setGoal} />
              ) : null}

              {currentStep === 1 ? (
                <ServingsStep
                  value={values.servings}
                  onDecrease={decreaseServings}
                  onIncrease={increaseServings}
                />
              ) : null}

              {currentStep === 2 ? (
                <DaysStep value={values.days} onChange={setDays} />
              ) : null}

              {currentStep === 3 ? (
                <MealTypesStep
                  values={values.mealTypes}
                  onToggle={toggleMealType}
                />
              ) : null}

              {currentStep === 4 ? (
                <PrepTimeStep
                  value={values.maxPrepTime}
                  onChange={setMaxPrepTime}
                />
              ) : null}

              {currentStep === 5 ? (
                <BudgetStep value={values.budget} onChange={setBudget} />
              ) : null}

              {currentStep === 6 ? (
                <ExcludedIngredientsStep
                  inputValue={ingredientInput}
                  ingredients={values.excludedIngredients}
                  onInputChange={setIngredientInput}
                  onAdd={handleAddIngredient}
                  onRemove={removeExcludedIngredient}
                />
              ) : null}

              {currentStep === 7 ? (
                <AllergiesStep
                  values={values.allergies}
                  onToggle={toggleAllergy}
                />
              ) : null}

              {currentStep === 8 ? (
                <SummaryStep values={values} onNotesChange={setNotes} />
              ) : null}
            </ScrollView>

            <View className="flex-row gap-3 border-t border-border p-5">
              {!isFirstStep ? (
                <View className="flex-1">
                  <AppButton
                    title="Geri"
                    variant="outline"
                    onPress={goBack}
                    disabled={isGenerating}
                  />
                </View>
              ) : null}

              <View className="flex-1">
                <AppButton
                  title={
                    isGenerating
                      ? "Plan oluşturuluyor..."
                      : isLastStep
                        ? "Planı Oluştur"
                        : "Devam Et"
                  }
                  onPress={isLastStep ? handleFinish : goNext}
                  disabled={!canContinue || isGenerating}
                />
              </View>
            </View>
          </AppCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function StepHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View className="mb-5">
      <Text className="text-2xl font-bold text-text">{title}</Text>
      <Text className="mt-2 text-sm leading-5 text-muted">{description}</Text>
    </View>
  );
}

function GoalStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: (typeof AI_PLANNER_GOALS)[number]["value"]) => void;
}) {
  return (
    <View>
      <StepHeader
        title="Hedefin nedir?"
        description="Planın genel yapısını belirlemek için bir hedef seç."
      />

      <View className="gap-3">
        {AI_PLANNER_GOALS.map((option) => {
          const selected = value === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onChange(option.value)}
              className={cn(
                "flex-row items-center rounded-2xl border p-4",
                selected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background",
              )}
            >
              <Ionicons name={option.icon} size={24} color="#E85D04" />

              <View className="ml-3 flex-1">
                <Text className="font-bold text-text">{option.label}</Text>
                <Text className="mt-1 text-sm text-muted">
                  {option.description}
                </Text>
              </View>

              {selected ? (
                <Ionicons name="checkmark-circle" size={23} color="#E85D04" />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function ServingsStep({
  value,
  onDecrease,
  onIncrease,
}: {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <View>
      <StepHeader
        title="Kaç kişilik?"
        description="Tariflerin porsiyon miktarını buna göre planlayacağız."
      />

      <View className="items-center py-8">
        <View className="flex-row items-center gap-8">
          <IconButton
            icon="remove"
            onPress={onDecrease}
            disabled={value <= 1}
            accessibilityLabel="Kişi sayısını azalt"
          />

          <View className="items-center">
            <Text className="text-5xl font-bold text-primary">{value}</Text>
            <Text className="mt-2 text-muted">kişilik</Text>
          </View>

          <IconButton
            icon="add"
            onPress={onIncrease}
            disabled={value >= 10}
            accessibilityLabel="Kişi sayısını artır"
          />
        </View>
      </View>
    </View>
  );
}

function DaysStep({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: 3 | 5 | 7) => void;
}) {
  return (
    <View>
      <StepHeader
        title="Kaç günlük plan?"
        description="Planlamak istediğin gün sayısını seç."
      />

      <View className="gap-3">
        {AI_PLANNER_DAY_OPTIONS.map((day) => (
          <SelectionButton
            key={day}
            title={`${day} Gün`}
            selected={value === day}
            onPress={() => onChange(day)}
          />
        ))}
      </View>
    </View>
  );
}

function MealTypesStep({
  values,
  onToggle,
}: {
  values: number[];
  onToggle: (value: 1 | 2 | 3 | 4) => void;
}) {
  return (
    <View>
      <StepHeader
        title="Hangi öğünler?"
        description="En az bir öğün türü seçmelisin."
      />

      <View className="gap-3">
        {AI_PLANNER_MEAL_TYPES.map((option) => {
          const selected = values.includes(option.value);

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onToggle(option.value)}
              className={cn(
                "flex-row items-center rounded-2xl border p-4",
                selected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background",
              )}
            >
              <Ionicons name={option.icon} size={23} color="#E85D04" />

              <Text className="ml-3 flex-1 font-semibold text-text">
                {option.label}
              </Text>

              <Ionicons
                name={selected ? "checkbox" : "square-outline"}
                size={23}
                color={selected ? "#E85D04" : "#7A7A7A"}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function PrepTimeStep({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <View>
      <StepHeader
        title="Maksimum hazırlama süresi"
        description="Günlük tariflerin ne kadar pratik olmasını istediğini seç."
      />

      <View className="gap-3">
        {AI_PLANNER_PREP_TIMES.map((time) => (
          <SelectionButton
            key={time}
            title={`${time} dakika`}
            selected={value === time}
            onPress={() => onChange(time)}
          />
        ))}
      </View>
    </View>
  );
}

function BudgetStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: "low" | "medium" | "high") => void;
}) {
  return (
    <View>
      <StepHeader
        title="Bütçe tercihin"
        description="AI tarifleri seçerken bu bütçe seviyesini dikkate alacak."
      />

      <View className="gap-3">
        {AI_PLANNER_BUDGETS.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            className={cn(
              "rounded-2xl border p-4",
              value === option.value
                ? "border-primary bg-primary/10"
                : "border-border bg-background",
            )}
          >
            <Text className="font-bold text-text">{option.label}</Text>
            <Text className="mt-1 text-sm text-muted">
              {option.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function ExcludedIngredientsStep({
  inputValue,
  ingredients,
  onInputChange,
  onAdd,
  onRemove,
}: {
  inputValue: string;
  ingredients: string[];
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (value: string) => void;
}) {
  return (
    <View>
      <StepHeader
        title="Sevmediğin malzemeler"
        description="Bu alan isteğe bağlıdır. Eklenen malzemeler plan dışında tutulur."
      />

      <AppInput
        label="Malzeme"
        value={inputValue}
        onChangeText={onInputChange}
        placeholder="Örn. Mantar"
        onSubmitEditing={onAdd}
      />

      <View className="mt-3">
        <AppButton
          title="Malzemeyi Ekle"
          variant="outline"
          onPress={onAdd}
          disabled={!inputValue.trim()}
        />
      </View>

      <View className="mt-5 flex-row flex-wrap gap-2">
        {ingredients.map((ingredient) => (
          <TouchableOpacity
            key={ingredient}
            onPress={() => onRemove(ingredient)}
            className="flex-row items-center rounded-full bg-danger/10 px-3 py-2"
          >
            <Text className="text-sm font-medium text-danger">
              {ingredient}
            </Text>
            <Ionicons
              name="close"
              size={16}
              color="#D9480F"
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function AllergiesStep({
  values,
  onToggle,
}: {
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <View>
      <StepHeader
        title="Alerjilerin var mı?"
        description="Bu alan isteğe bağlıdır. Uygun olanların tümünü seçebilirsin."
      />

      <View className="flex-row flex-wrap gap-2">
        {AI_PLANNER_ALLERGIES.map((allergy) => {
          const selected = values.includes(allergy);

          return (
            <TouchableOpacity
              key={allergy}
              onPress={() => onToggle(allergy)}
              className={cn(
                "rounded-full border px-4 py-3",
                selected
                  ? "border-primary bg-primary"
                  : "border-border bg-background",
              )}
            >
              <Text
                className={cn(
                  "font-medium",
                  selected ? "text-white" : "text-text",
                )}
              >
                {allergy}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function SummaryStep({
  values,
  onNotesChange,
}: {
  values: AiPlannerFormValues;
  onNotesChange: (value: string) => void;
}) {
  const goalLabel =
    AI_PLANNER_GOALS.find((item) => item.value === values.goal)?.label ??
    values.goal;

  const budgetLabel =
    AI_PLANNER_BUDGETS.find((item) => item.value === values.budget)?.label ??
    values.budget;

  const mealTypeLabels = AI_PLANNER_MEAL_TYPES.filter((item) =>
    values.mealTypes.includes(item.value),
  ).map((item) => item.label);

  return (
    <View>
      <StepHeader
        title="Planını kontrol et"
        description="AI planı oluşturmadan önce seçimlerini son kez gözden geçir."
      />

      <View className="gap-3">
        <SummaryItem icon="flag-outline" label="Hedef" value={goalLabel} />

        <SummaryItem
          icon="people-outline"
          label="Kişi sayısı"
          value={`${values.servings} kişilik`}
        />

        <SummaryItem
          icon="calendar-outline"
          label="Plan süresi"
          value={`${values.days} gün`}
        />

        <SummaryItem
          icon="restaurant-outline"
          label="Öğünler"
          value={mealTypeLabels.join(", ")}
        />

        <SummaryItem
          icon="time-outline"
          label="Maksimum hazırlama süresi"
          value={`${values.maxPrepTime} dakika`}
        />

        <SummaryItem icon="wallet-outline" label="Bütçe" value={budgetLabel} />

        <SummaryItem
          icon="remove-circle-outline"
          label="Hariç tutulan malzemeler"
          value={
            values.excludedIngredients.length
              ? values.excludedIngredients.join(", ")
              : "Yok"
          }
        />

        <SummaryItem
          icon="warning-outline"
          label="Alerjiler"
          value={values.allergies.length ? values.allergies.join(", ") : "Yok"}
        />
      </View>

      <View className="mt-6">
        <AppInput
          label="Ek not"
          value={values.notes}
          onChangeText={onNotesChange}
          placeholder="Örn. Hafta içi tarifler pratik, hafta sonu tarifleri daha özel olsun."
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          className="min-h-32"
        />
      </View>
    </View>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-start rounded-2xl border border-border bg-background p-4">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        <Ionicons name={icon} size={21} color="#E85D04" />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-sm font-semibold text-muted">{label}</Text>

        <Text className="mt-1 font-bold leading-5 text-text">{value}</Text>
      </View>
    </View>
  );
}

function SelectionButton({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        "flex-row items-center justify-between rounded-2xl border p-4",
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-background",
      )}
    >
      <Text className="font-semibold text-text">{title}</Text>

      {selected ? (
        <Ionicons name="checkmark-circle" size={23} color="#E85D04" />
      ) : null}
    </TouchableOpacity>
  );
}
