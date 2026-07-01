namespace RecipeApp.Api.DTOs;

public class CreateIngredientDto
{
    public string Name { get; set; } = string.Empty;

    public string? Amount { get; set; }
}