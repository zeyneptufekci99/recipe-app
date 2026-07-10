import { AuthProvider } from "@/features/auth/auth-provider";
import { store } from "@/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { Toaster } from "sonner-native";
import "../global.css";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toaster />
      </AuthProvider>
    </Provider>
  );
}
