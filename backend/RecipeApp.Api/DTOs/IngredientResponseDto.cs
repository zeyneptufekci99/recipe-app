namespace RecipeApp.Api.DTOs;

public class IngredientResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Amount { get; set; }
}