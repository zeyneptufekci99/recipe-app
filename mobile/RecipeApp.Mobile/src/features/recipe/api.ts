import { baseApi } from "@/services/base-api";
import type {
  CreateRecipeRequest,
  GenerateRecipeWithAiRequest,
  GetRecipesParams,
  ImportedRecipe,
  ImportRecipeFromUrlRequest,
  PagedResult,
  ProfileStatistics,
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

      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const state = getState() as any;
        const queries = state.api.queries;

        const listPatches = Object.values(queries)
          .filter((query: any) => query?.endpointName === "getRecipes")
          .map((query: any) =>
            dispatch(
              recipeApi.util.updateQueryData(
                "getRecipes",
                query.originalArgs,
                (draft) => {
                  const recipe = draft.items.find((item) => item.id === id);

                  if (recipe) {
                    recipe.isFavorite = !recipe.isFavorite;
                  }
                },
              ),
            ),
          );

        const favoritesPatch = dispatch(
          recipeApi.util.updateQueryData(
            "getFavoriteRecipes",
            undefined,
            (draft) => {
              draft.items = draft.items.filter((item) => item.id !== id);
            },
          ),
        );

        const detailPatch = dispatch(
          recipeApi.util.updateQueryData("getRecipeById", id, (draft) => {
            draft.isFavorite = !draft.isFavorite;
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          listPatches.forEach((patch) => patch.undo());
          favoritesPatch.undo();
          detailPatch.undo();
        }
      },

      invalidatesTags: [],
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
    getFavoriteRecipes: builder.query<PagedResult<RecipeListItem>, void>({
      query: () => "/Recipe/favorites",
      providesTags: ["Recipe"],
    }),
    duplicateRecipe: builder.mutation<RecipeDetail, string>({
      query: (id) => ({
        url: `/Recipe/${id}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: ["Recipe"],
    }),
    importRecipeFromUrl: builder.mutation<
      ImportedRecipe,
      ImportRecipeFromUrlRequest
    >({
      query: (body) => ({
        url: "/Recipe/import-url",
        method: "POST",
        body,
      }),
    }),
    getRecipeStatistics: builder.query<ProfileStatistics, void>({
      query: () => "/Recipe/statistics",
      providesTags: ["Recipe"],
    }),
    generateRecipeWithAi: builder.mutation<
      ImportedRecipe,
      GenerateRecipeWithAiRequest
    >({
      query: (body) => ({
        url: "/Recipe/generate-ai",
        method: "POST",
        body,
      }),
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
  useGetFavoriteRecipesQuery,
  useDuplicateRecipeMutation,
  useImportRecipeFromUrlMutation,
  useLazyGetRecipesQuery,
  useGetRecipeStatisticsQuery,
  useGenerateRecipeWithAiMutation,
} = recipeApi;
