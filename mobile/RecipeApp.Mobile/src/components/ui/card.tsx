import { cn } from "@/utils/cn";
import { View } from "react-native";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-2xl bg-surface border border-border p-4",
        className,
      )}
    >
      {children}
    </View>
  );
}
