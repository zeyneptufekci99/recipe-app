import { useLoginMutation } from "@/features/auth/auth-api";
import { setCredentials } from "@/features/auth/auth-slice";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login-schema";
import { storageService } from "@/services/storage";
import { useAppDispatch } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "test@test.com",
      password: "123456",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login(values).unwrap();
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
        <View>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <TextInput
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
                className="rounded-xl border border-border bg-surface px-4 py-4 text-text"
                placeholderTextColor="#7A7A7A"
              />
            )}
          />

          {errors.email ? (
            <Text className="mt-1 text-sm text-danger">
              {errors.email.message}
            </Text>
          ) : null}
        </View>

        <View>
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <TextInput
                placeholder="Şifre"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                className="rounded-xl border border-border bg-surface px-4 py-4 text-text"
                placeholderTextColor="#7A7A7A"
              />
            )}
          />

          {errors.password ? (
            <Text className="mt-1 text-sm text-danger">
              {errors.password.message}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="mt-2 rounded-xl bg-primary py-4"
        >
          <Text className="text-center text-base font-bold text-white">
            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text className="text-center font-semibold text-primary">
            Hesabın yok mu? Kayıt ol
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
