import {
  AiPlannerFormValues,
  MealPlanBudget,
  MealPlanDays,
  MealPlanGoal,
} from "@/types/ai-planner";
import type { MealType } from "@/types/meal-plan";
import { useState } from "react";

const INITIAL_VALUES: AiPlannerFormValues = {
  goal: "healthy",
  servings: 2,
  days: 7,
  mealTypes: [1, 2, 3],
  maxPrepTime: 30,
  budget: "medium",
  excludedIngredients: [],
  allergies: [],
  notes: "",
};

export function useAiPlanner() {
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<AiPlannerFormValues>(INITIAL_VALUES);

  const totalSteps = 9;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const setGoal = (goal: MealPlanGoal) => {
    setValues((current) => ({
      ...current,
      goal,
    }));
  };

  const increaseServings = () => {
    setValues((current) => ({
      ...current,
      servings: Math.min(current.servings + 1, 10),
    }));
  };

  const decreaseServings = () => {
    setValues((current) => ({
      ...current,
      servings: Math.max(current.servings - 1, 1),
    }));
  };

  const setDays = (days: MealPlanDays) => {
    setValues((current) => ({
      ...current,
      days,
    }));
  };

  const toggleMealType = (mealType: MealType) => {
    setValues((current) => {
      const selected = current.mealTypes.includes(mealType);

      return {
        ...current,
        mealTypes: selected
          ? current.mealTypes.filter((item) => item !== mealType)
          : [...current.mealTypes, mealType],
      };
    });
  };

  const setMaxPrepTime = (maxPrepTime: number) => {
    setValues((current) => ({
      ...current,
      maxPrepTime,
    }));
  };

  const setBudget = (budget: MealPlanBudget) => {
    setValues((current) => ({
      ...current,
      budget,
    }));
  };

  const addExcludedIngredient = (ingredient: string) => {
    const trimmedIngredient = ingredient.trim();

    if (!trimmedIngredient) return;

    setValues((current) => {
      const alreadyExists = current.excludedIngredients.some(
        (item) =>
          item.toLocaleLowerCase("tr") ===
          trimmedIngredient.toLocaleLowerCase("tr"),
      );

      if (alreadyExists) return current;

      return {
        ...current,
        excludedIngredients: [
          ...current.excludedIngredients,
          trimmedIngredient,
        ],
      };
    });
  };

  const removeExcludedIngredient = (ingredient: string) => {
    setValues((current) => ({
      ...current,
      excludedIngredients: current.excludedIngredients.filter(
        (item) => item !== ingredient,
      ),
    }));
  };

  const toggleAllergy = (allergy: string) => {
    setValues((current) => {
      const selected = current.allergies.includes(allergy);

      return {
        ...current,
        allergies: selected
          ? current.allergies.filter((item) => item !== allergy)
          : [...current.allergies, allergy],
      };
    });
  };

  const setNotes = (notes: string) => {
    setValues((current) => ({
      ...current,
      notes,
    }));
  };

  const canContinue = currentStep !== 3 || values.mealTypes.length > 0;

  const goNext = () => {
    if (!canContinue || isLastStep) return;

    setCurrentStep((step) => step + 1);
  };

  const goBack = () => {
    if (isFirstStep) return;

    setCurrentStep((step) => step - 1);
  };

  const reset = () => {
    setCurrentStep(0);
    setValues(INITIAL_VALUES);
  };

  return {
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
  };
}
