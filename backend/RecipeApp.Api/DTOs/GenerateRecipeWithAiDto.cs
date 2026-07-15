namespace RecipeApp.Api.DTOs;

public class GenerateRecipeWithAiDto
{
    public string Prompt { get; set; } = string.Empty;

    public List<string> PantryIngredients { get; set; } = [];
}