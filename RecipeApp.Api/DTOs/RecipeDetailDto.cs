using RecipeApp.Api.Models.Enums;

namespace RecipeApp.Api.DTOs;

public class RecipeDetailDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string Category { get; set; } = string.Empty;
    public int PrepTime { get; set; }
    public int CookTime { get; set; }
    public int Servings { get; set; }
    public Difficulty Difficulty { get; set; }
    public SourceType SourceType { get; set; }
    public string? SourceUrl { get; set; }
    public List<IngredientResponseDto> Ingredients { get; set; } = new();
    public List<RecipeStepResponseDto> Steps { get; set; } = new();
}