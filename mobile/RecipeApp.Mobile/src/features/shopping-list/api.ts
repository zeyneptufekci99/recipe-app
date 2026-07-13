import { baseApi } from "@/services/base-api";
import type {
  CreateShoppingListRequest,
  ShoppingListDetail,
  ShoppingListItem,
  ShoppingListSummary,
} from "@/types/shopping-list";

export const shoppingListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShoppingLists: builder.query<ShoppingListSummary[], void>({
      query: () => "/ShoppingList",
      providesTags: ["ShoppingList"],
    }),

    getShoppingListById: builder.query<ShoppingListDetail, string>({
      query: (id) => `/ShoppingList/${id}`,
      providesTags: (_result, _error, id) => [{ type: "ShoppingList", id }],
    }),

    createShoppingList: builder.mutation<
      ShoppingListSummary,
      CreateShoppingListRequest
    >({
      query: (body) => ({
        url: "/ShoppingList",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ShoppingList"],
    }),

    addRecipeToShoppingList: builder.mutation<
      ShoppingListDetail,
      { shoppingListId: string; recipeId: string }
    >({
      query: ({ shoppingListId, recipeId }) => ({
        url: `/ShoppingList/${shoppingListId}/recipes/${recipeId}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, arg) => [
        "ShoppingList",
        { type: "ShoppingList", id: arg.shoppingListId },
      ],
    }),

    toggleShoppingListItem: builder.mutation<
      ShoppingListItem,
      { shoppingListId: string; itemId: string }
    >({
      query: ({ itemId }) => ({
        url: `/ShoppingList/items/${itemId}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, arg) => [
        "ShoppingList",
        { type: "ShoppingList", id: arg.shoppingListId },
      ],
    }),

    deleteShoppingListItem: builder.mutation<
      void,
      { shoppingListId: string; itemId: string }
    >({
      query: ({ itemId }) => ({
        url: `/ShoppingList/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        "ShoppingList",
        { type: "ShoppingList", id: arg.shoppingListId },
      ],
    }),

    deleteShoppingList: builder.mutation<void, string>({
      query: (id) => ({
        url: `/ShoppingList/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ShoppingList"],
    }),
  }),
});

export const {
  useGetShoppingListsQuery,
  useGetShoppingListByIdQuery,
  useCreateShoppingListMutation,
  useAddRecipeToShoppingListMutation,
  useToggleShoppingListItemMutation,
  useDeleteShoppingListItemMutation,
  useDeleteShoppingListMutation,
} = shoppingListApi;
