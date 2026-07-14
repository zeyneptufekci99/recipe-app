import { baseApi } from "@/services/base-api";
import type {
  CreateMealPlanItemRequest,
  MealPlanItem,
} from "@/types/meal-plan";
import {
  CreateShoppingListFromMealPlanRequest,
  ShoppingListSummary,
} from "@/types/shopping-list";

export const mealPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMealPlan: builder.query<
      MealPlanItem[],
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: "/MealPlan",
        params: {
          startDate,
          endDate,
        },
      }),
      providesTags: ["MealPlan"],
    }),

    createMealPlanItem: builder.mutation<
      MealPlanItem,
      CreateMealPlanItemRequest
    >({
      query: (body) => ({
        url: "/MealPlan",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MealPlan"],
    }),

    deleteMealPlanItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `/MealPlan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MealPlan"],
    }),
    createShoppingListFromMealPlan: builder.mutation<
      ShoppingListSummary,
      CreateShoppingListFromMealPlanRequest
    >({
      query: (body) => ({
        url: "/ShoppingList/from-meal-plan",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ShoppingList"],
    }),
  }),
});

export const {
  useGetMealPlanQuery,
  useCreateMealPlanItemMutation,
  useDeleteMealPlanItemMutation,
  useCreateShoppingListFromMealPlanMutation,
} = mealPlanApi;
