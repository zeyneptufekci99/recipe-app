using RecipeApp.Api.Models.Enums;

namespace RecipeApp.Api.DTOs;

public class CreateRecipeDto
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public int PrepTime { get; set; }

    public int CookTime { get; set; }

    public int Servings { get; set; }

    public Difficulty Difficulty { get; set; } = Difficulty.Easy;

    public Guid CategoryId { get; set; }

    public SourceType SourceType { get; set; } = SourceType.Manual;

    public string? SourceUrl { get; set; }

    public List<CreateIngredientDto> Ingredients { get; set; } = new();

    public List<CreateRecipeStepDto> Steps { get; set; } = new();
}