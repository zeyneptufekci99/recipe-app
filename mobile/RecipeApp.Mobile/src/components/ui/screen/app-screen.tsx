import { cn } from "@/utils/cn";
import { ReactNode } from "react";
import { View } from "react-native";

interface AppScreenProps {
  children: ReactNode;
  className?: string;
}

export function AppScreen({ children, className }: AppScreenProps) {
  return (
    <View className={cn("flex-1 bg-background px-4 pt-10", className)}>
      {children}
    </View>
  );
}
