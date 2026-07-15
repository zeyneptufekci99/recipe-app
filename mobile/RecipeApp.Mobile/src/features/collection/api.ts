import { baseApi } from "@/services/base-api";
import type {
  CollectionDetail,
  CollectionMembership,
  CollectionSummary,
  CreateCollectionRequest,
  UpdateCollectionRequest,
} from "@/types/collection";

export const collectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCollections: builder.query<CollectionSummary[], void>({
      query: () => "/Collection",
      providesTags: ["Collection"],
    }),

    getCollectionById: builder.query<CollectionDetail, string>({
      query: (id) => `/Collection/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Collection", id }],
    }),

    createCollection: builder.mutation<
      CollectionSummary,
      CreateCollectionRequest
    >({
      query: (body) => ({
        url: "/Collection",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Collection"],
    }),

    updateCollection: builder.mutation<
      CollectionSummary,
      {
        id: string;
        body: UpdateCollectionRequest;
      }
    >({
      query: ({ id, body }) => ({
        url: `/Collection/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        "Collection",
        { type: "Collection", id: arg.id },
      ],
    }),

    deleteCollection: builder.mutation<void, string>({
      query: (id) => ({
        url: `/Collection/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Collection"],
    }),

    addRecipeToCollection: builder.mutation<
      CollectionDetail,
      {
        collectionId: string;
        recipeId: string;
      }
    >({
      query: ({ collectionId, recipeId }) => ({
        url: `/Collection/${collectionId}/recipes/${recipeId}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, arg) => [
        "Collection",
        { type: "Collection", id: arg.collectionId },
        { type: "Collection", id: `recipe-${arg.recipeId}` },
      ],
    }),

    removeRecipeFromCollection: builder.mutation<
      void,
      {
        collectionId: string;
        recipeId: string;
      }
    >({
      query: ({ collectionId, recipeId }) => ({
        url: `/Collection/${collectionId}/recipes/${recipeId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        "Collection",
        { type: "Collection", id: arg.collectionId },
        { type: "Collection", id: `recipe-${arg.recipeId}` },
      ],
    }),
    getRecipeCollections: builder.query<CollectionMembership[], string>({
      query: (recipeId) => `/Collection/recipe/${recipeId}`,
      providesTags: (_result, _error, recipeId) => [
        { type: "Collection", id: `recipe-${recipeId}` },
      ],
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetCollectionByIdQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useAddRecipeToCollectionMutation,
  useRemoveRecipeFromCollectionMutation,
  useGetRecipeCollectionsQuery,
} = collectionApi;
