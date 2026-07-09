import { AppInput } from "@/components";
import { useRegisterMutation } from "@/features/auth/auth-api";
import { setCredentials } from "@/features/auth/auth-slice";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/register-schema";
import { storageService } from "@/services/storage";
import { useAppDispatch } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const response = await register(values).unwrap();
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
      router.replace("/(tabs)/home");
    } catch (error) {
      console.log("Register error:", error);
      Alert.alert("Hata", "Kayıt oluşturulamadı.");
    }
  };

  return (
    <View className="flex-1 justify-center bg-background px-6">
      <Text className="mb-8 text-center text-4xl font-bold text-primary">
        Hesap Oluştur
      </Text>

      <View className="gap-4">
        {(["name", "email", "password"] as const).map((field) => (
          <View key={field}>
            <Controller
              control={control}
              name={field}
              render={({ field: { value, onChange } }) => (
                <AppInput
                  placeholder={
                    field === "name"
                      ? "İsim"
                      : field === "email"
                        ? "Email"
                        : "Şifre"
                  }
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  keyboardType={field === "email" ? "email-address" : "default"}
                  secureTextEntry={field === "password"}
                  error={errors[field]?.message}
                />
              )}
            />

            {errors[field] ? (
              <Text className="mt-1 text-sm text-danger">
                {errors[field]?.message}
              </Text>
            ) : null}
          </View>
        ))}

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="mt-2 rounded-xl bg-primary py-4"
        >
          <Text className="text-center text-base font-bold text-white">
            {isLoading ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text className="text-center font-semibold text-primary">
            Zaten hesabın var mı? Giriş yap
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
