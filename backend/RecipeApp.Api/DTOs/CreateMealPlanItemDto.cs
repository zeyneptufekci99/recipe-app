using RecipeApp.Api.Models.Enums;

namespace RecipeApp.Api.DTOs;

public class CreateMealPlanItemDto
{
    public Guid RecipeId { get; set; }

    public DateOnly Date { get; set; }

    public MealType MealType { get; set; }
}