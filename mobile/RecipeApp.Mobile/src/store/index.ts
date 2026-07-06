import authReducer from "@/features/auth/auth-slice";
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./app-slice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
