import { useLoginMutation } from "@/features/auth/auth-api";
import { setCredentials } from "@/features/auth/auth-slice";
import { storageService } from "@/services/storage";
import { useAppDispatch } from "@/store/hooks";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

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
    <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 12 }}>
      <Text className="text-primary text-3xl font-bold text-center">
        RecipeApp
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          padding: 12,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          padding: 12,
        }}
      />

      <Button
        title={isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
}
