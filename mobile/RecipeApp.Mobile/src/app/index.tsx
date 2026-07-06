import { useAppSelector } from "@/store/hooks";
import { Redirect } from "expo-router";

export default function Index() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}
