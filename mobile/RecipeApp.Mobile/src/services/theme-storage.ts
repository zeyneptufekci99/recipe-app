import { ThemeMode } from "@/types/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_STORAGE_KEY = "recipe_app_theme";

export const themeStorage = {
  async getTheme(): Promise<ThemeMode | null> {
    const value = await AsyncStorage.getItem(THEME_STORAGE_KEY);

    if (value === "light" || value === "dark" || value === "system") {
      return value;
    }

    return null;
  },

  async saveTheme(theme: ThemeMode): Promise<void> {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
  },
};
