import { setCredentials } from "@/features/auth/auth-slice";
import { api } from "@/services/api";
import { storageService } from "@/services/storage";
import { useAppDispatch } from "@/store/hooks";
import type { AuthUser } from "@/types/auth";
import { ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const token = await storageService.getToken();

        console.log("Stored token:", token);

        if (!token) {
          console.log("No token found");
          return;
        }

        console.log("Calling /Auth/me...");

        const response = await api.get<AuthUser>("/Auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Me response:", response.data);

        dispatch(
          setCredentials({
            token,
            user: response.data,
          }),
        );
      } catch (error) {
        console.log("Bootstrap auth error:", error);
        await storageService.removeToken();
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  return <>{children}</>;
}
