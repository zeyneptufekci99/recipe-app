using RecipeApp.Api.Models.Enums;

namespace RecipeApp.Api.DTOs;

public class GenerateWeeklyMealPlanDto
{
    public DateOnly StartDate { get; set; }

    public int Days { get; set; } = 7;

    public int Servings { get; set; } = 2;

    public string Goal { get; set; } = "healthy";

    public string Budget { get; set; } = "medium";

    public int MaxPrepTime { get; set; } = 30;

    public List<MealType> MealTypes { get; set; } =
    [
        MealType.Breakfast,
        MealType.Lunch,
        MealType.Dinner
    ];

    public List<string> ExcludedIngredients { get; set; } = [];

    public List<string> Allergies { get; set; } = [];

    public string Notes { get; set; } = string.Empty;
}