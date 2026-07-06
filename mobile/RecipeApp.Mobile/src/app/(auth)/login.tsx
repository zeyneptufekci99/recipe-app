import { useLoginMutation } from "@/features/auth/auth-api";
import { setCredentials } from "@/features/auth/auth-slice";
import { storageService } from "@/services/storage";
import { useAppDispatch } from "@/store/hooks";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("123456");

  const handleLogin = async () => {
    try {
      const response = await login({ email, password }).unwrap();
      const { token, id, name } = response;

      dispatch(
        setCredentials({
          token,
          user: {
            userId: id,
            name,
            email: response.email,
          },
        }),
      );

      await storageService.saveToken(token);
      router.replace("/home");
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Hata", "Giriş yapılamadı.");
    }
  };

  return (
    <View className="flex-1 justify-center bg-background px-6">
      <View className="mb-10">
        <Text className="text-center text-4xl font-bold text-primary">
          RecipeApp
        </Text>
        <Text className="mt-2 text-center text-base text-muted">
          Tariflerini tek yerde yönet
        </Text>
      </View>

      <View className="gap-4">
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          className="rounded-xl border border-border bg-surface px-4 py-4 text-text"
          placeholderTextColor="#7A7A7A"
        />

        <TextInput
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="rounded-xl border border-border bg-surface px-4 py-4 text-text"
          placeholderTextColor="#7A7A7A"
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className="mt-2 rounded-xl bg-primary py-4"
        >
          <Text className="text-center text-base font-bold text-white">
            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
