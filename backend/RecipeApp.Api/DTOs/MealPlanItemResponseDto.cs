using RecipeApp.Api.Models.Enums;

namespace RecipeApp.Api.DTOs;

public class MealPlanItemResponseDto
{
    public Guid Id { get; set; }

    public Guid RecipeId { get; set; }

    public string RecipeTitle { get; set; } = string.Empty;

    public string? RecipeImageUrl { get; set; }

    public DateOnly Date { get; set; }

    public MealType MealType { get; set; }
}