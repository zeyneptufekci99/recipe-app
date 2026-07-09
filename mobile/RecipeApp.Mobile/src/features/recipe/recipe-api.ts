import { baseApi } from "@/services/base-api";
import type {
  CreateRecipeRequest,
  GetRecipesParams,
  PagedResult,
  RecipeDetail,
  RecipeListItem,
} from "@/types/recipe";

export const recipeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecipes: builder.query<PagedResult<RecipeListItem>, GetRecipesParams>({
      query: (params) => ({
        url: "/Recipe",
        params,
      }),
      providesTags: ["Recipe"],
    }),
    toggleFavorite: builder.mutation<RecipeListItem, string>({
      query: (id) => ({
        url: `/Recipe/${id}/favorite`,
        method: "PATCH",
      }),
      invalidatesTags: ["Recipe"],
    }),
    getRecipeById: builder.query<RecipeDetail, string>({
      query: (id) => `/Recipe/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Recipe", id }],
    }),
    createRecipe: builder.mutation<RecipeListItem, CreateRecipeRequest>({
      query: (body) => ({
        url: "/Recipe",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Recipe"],
    }),
    updateRecipe: builder.mutation<
      RecipeDetail,
      { id: string; body: CreateRecipeRequest }
    >({
      query: ({ id, body }) => ({
        url: `/Recipe/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        "Recipe",
        { type: "Recipe", id: arg.id },
      ],
    }),
    deleteRecipe: builder.mutation<void, string>({
      query: (id) => ({
        url: `/Recipe/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Recipe"],
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipeByIdQuery,
  useToggleFavoriteMutation,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} = recipeApi;
