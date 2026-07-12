import type { RecipeDetail } from "@/types/recipe";
import { Share } from "react-native";

export const shareService = {
  async shareRecipe(recipe: RecipeDetail) {
    const message = [
      recipe.title,
      recipe.description ? `\n${recipe.description}` : "",
      recipe.category ? `\nKategori: ${recipe.category}` : "",
      `\nSüre: ${recipe.prepTime + recipe.cookTime} dk`,
      `Porsiyon: ${recipe.servings}`,
    ]
      .filter(Boolean)
      .join("\n");

    await Share.share({
      title: recipe.title,
      message,
    });
  },

  async shareApp() {
    await Share.share({
      title: "RecipeApp",
      message:
        "Tariflerini kaydetmek, düzenlemek ve favorilerini yönetmek için RecipeApp'i keşfet.",
    });
  },
};
