namespace RecipeApp.Api.DTOs;

public class RecipeAiOptionDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public int PrepTime { get; set; }

    public int CookTime { get; set; }

    public int Servings { get; set; }

    public int Difficulty { get; set; }
}