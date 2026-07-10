import { cn } from "@/utils/cn";
import { ReactNode } from "react";
import { Text, View } from "react-native";

interface AppSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function AppSection({ title, children, className }: AppSectionProps) {
  return (
    <View className={cn("mt-6", className)}>
      {title ? (
        <Text className="mb-3 text-xl font-bold text-text">{title}</Text>
      ) : null}

      {children}
    </View>
  );
}
