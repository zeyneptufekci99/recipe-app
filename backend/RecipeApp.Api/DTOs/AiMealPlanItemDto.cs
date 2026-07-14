using RecipeApp.Api.Models.Enums;

namespace RecipeApp.Api.DTOs;

public class AiMealPlanItemDto
{
    public DateOnly Date { get; set; }

    public MealType MealType { get; set; }

    public Guid RecipeId { get; set; }
}