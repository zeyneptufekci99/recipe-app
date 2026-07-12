import { AuthProvider } from "@/features/auth/auth-provider";
import { ThemeProvider } from "@/features/settings/theme-provider";
import "@/global.css";

import { store } from "@/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { Toaster } from "sonner-native";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
