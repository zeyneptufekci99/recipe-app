import { baseApi } from "@/services/base-api";
import type {
  GetRecipesParams,
  PagedResult,
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
  }),
});

export const { useGetRecipesQuery } = recipeApi;
