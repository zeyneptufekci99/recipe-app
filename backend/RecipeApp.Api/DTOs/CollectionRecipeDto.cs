namespace RecipeApp.Api.DTOs;

public class CollectionRecipeDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public string Category { get; set; } = string.Empty;

    public int PrepTime { get; set; }

    public int CookTime { get; set; }

    public int Servings { get; set; }
}