import { IconButton } from "@/components";
import { cn } from "@/utils/cn";
import { router } from "expo-router";
import { ReactNode } from "react";
import { Text, View } from "react-native";

interface PageHeaderProps {
  title: string;
  canGoBack?: boolean;
  rightContent?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  canGoBack = true,
  rightContent,
  className,
}: PageHeaderProps) {
  return (
    <View
      className={cn("mb-6 flex-row items-center justify-between", className)}
    >
      <View className="flex-1 flex-row items-center gap-3">
        {canGoBack ? (
          <IconButton
            icon="arrow-back"
            onPress={() => router.back()}
            accessibilityLabel="Geri dön"
          />
        ) : null}

        <Text className="flex-1 text-3xl font-bold text-text">{title}</Text>
      </View>

      {rightContent ? <View className="ml-3">{rightContent}</View> : null}
    </View>
  );
}
