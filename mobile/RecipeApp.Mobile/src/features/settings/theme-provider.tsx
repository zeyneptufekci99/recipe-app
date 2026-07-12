import { LoadingSpinner } from "@/components";
import { themeStorage } from "@/services/theme-storage";
import { ThemeMode } from "@/types/themes";

import { useColorScheme } from "nativewind";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ThemeContextValue {
  themeMode: ThemeMode;
  changeTheme: (theme: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { setColorScheme } = useColorScheme();

  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapTheme = async () => {
      try {
        const savedTheme = await themeStorage.getTheme();
        const initialTheme = savedTheme ?? "system";

        setThemeMode(initialTheme);
        setColorScheme(initialTheme);
      } catch (error) {
        console.log("Theme bootstrap error:", error);

        setThemeMode("system");
        setColorScheme("system");
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapTheme();
  }, [setColorScheme]);

  const changeTheme = async (theme: ThemeMode) => {
    setThemeMode(theme);
    setColorScheme(theme);

    try {
      await themeStorage.saveTheme(theme);
    } catch (error) {
      console.log("Theme save error:", error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used inside ThemeProvider.");
  }

  return context;
}
