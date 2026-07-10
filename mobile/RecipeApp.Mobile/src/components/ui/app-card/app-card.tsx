import { cn } from "@/utils/cn";
import { ReactNode } from "react";
import { View } from "react-native";

interface AppCardProps {
  children: ReactNode;
  className?: string;
}

export function AppCard({ children, className }: AppCardProps) {
  return (
    <View
      className={cn(
        "rounded-2xl border border-border bg-surface p-4",
        className,
      )}
    >
      {children}
    </View>
  );
}
