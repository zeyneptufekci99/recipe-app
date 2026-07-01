using RecipeApp.Api.Models.Enums;

namespace RecipeApp.Api.DTOs;

public class RecipeResponseDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public string Category { get; set; } = string.Empty;

    public int PrepTime { get; set; }

    public int CookTime { get; set; }

    public int Servings { get; set; }

    public Difficulty Difficulty { get; set; }
    public bool IsFavorite { get; set; } = false;
}