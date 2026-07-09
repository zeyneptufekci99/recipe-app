import { cn } from "@/utils/cn";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function AppInput({ label, error, className, ...props }: AppInputProps) {
  return (
    <View className="gap-2">
      {label ? (
        <Text className="text-base font-semibold text-text">{label}</Text>
      ) : null}

      <TextInput
        {...props}
        className={cn(
          "rounded-xl border border-border bg-surface px-4 py-4 text-text",
          error && "border-red-500",
          className,
        )}
      />

      {error ? <Text className="text-sm text-danger">{error}</Text> : null}
    </View>
  );
}
