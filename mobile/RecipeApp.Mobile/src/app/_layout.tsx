import { AuthProvider } from "@/features/auth/auth-provider";
import { store } from "@/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import "../global.css";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </Provider>
  );
}
