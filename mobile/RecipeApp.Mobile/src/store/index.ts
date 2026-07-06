import authReducer from "@/features/auth/auth-slice";
import { baseApi } from "@/services/base-api";
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./app-slice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
