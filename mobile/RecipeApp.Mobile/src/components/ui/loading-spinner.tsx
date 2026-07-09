import { ActivityIndicator, View } from "react-native";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export function LoadingSpinner({ fullScreen = false }: LoadingSpinnerProps) {
  return (
    <View
      className={
        fullScreen
          ? "flex-1 items-center justify-center bg-background"
          : "items-center justify-center py-10"
      }
    >
      <ActivityIndicator size="large" color="#E85D04" />
    </View>
  );
}
