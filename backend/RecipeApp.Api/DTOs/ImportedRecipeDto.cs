namespace RecipeApp.Api.DTOs;

public class ImportedRecipeDto
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public int PrepTime { get; set; }

    public int CookTime { get; set; }

    public int Servings { get; set; } = 1;

    public List<CreateIngredientDto> Ingredients { get; set; } = [];

    public List<CreateRecipeStepDto> Steps { get; set; } = [];
}