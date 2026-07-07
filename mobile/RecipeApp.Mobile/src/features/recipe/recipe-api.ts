import { baseApi } from "@/services/base-api";
import type {
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
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipeByIdQuery,
  useToggleFavoriteMutation,
} = recipeApi;
