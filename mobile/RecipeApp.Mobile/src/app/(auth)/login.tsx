import { setCredentials } from "@/features/auth/auth-slice";
import { authService } from "@/services/auth-service";
import { storageService } from "@/services/storage";
import { useAppDispatch } from "@/store/hooks";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
export default function LoginScreen() {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await authService.login({
        email,
        password,
      });
      console.log(response.data);
      const { token, id, name } = response.data;

      dispatch(
        setCredentials({
          token,
          user: {
            id,
            name,
            email: response.data.email,
          },
        }),
      );

      await storageService.saveToken(token);
      router.replace("/home");
      Alert.alert("Başarılı", "Giriş yapıldı.");
    } catch (error: any) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", textAlign: "center" }}>
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
        title={loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}
