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

        if (!token) return;

        const response = await api.get<AuthUser>("/Auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(
          setCredentials({
            token,
            user: response.data,
          }),
        );
      } catch (error) {
        await storageService.removeToken();
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <>{children}</>;
}
