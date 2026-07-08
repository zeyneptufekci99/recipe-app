import { z } from "zod";

export const recipeFormSchema = z.object({
  title: z.string().min(2, "Tarif adı en az 2 karakter olmalı."),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Kategori seçmelisin."),
  prepTime: z.string().min(1, "Hazırlık süresi zorunlu."),
  cookTime: z.string().min(1, "Pişirme süresi zorunlu."),
  servings: z.string().min(1, "Porsiyon zorunlu."),
  difficulty: z.number(),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
