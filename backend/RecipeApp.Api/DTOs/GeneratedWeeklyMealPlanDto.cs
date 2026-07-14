namespace RecipeApp.Api.DTOs;

public class GeneratedWeeklyMealPlanDto
{
    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public List<MealPlanItemResponseDto> Items { get; set; } = [];
}