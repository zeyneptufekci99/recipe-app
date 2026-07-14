namespace RecipeApp.Api.DTOs;

public class GenerateWeeklyMealPlanDto
{
    public DateOnly StartDate { get; set; }

    public string Preference { get; set; } = string.Empty;

    public bool IncludeBreakfast { get; set; } = true;

    public bool IncludeLunch { get; set; } = true;

    public bool IncludeDinner { get; set; } = true;

    public bool IncludeSnack { get; set; }
}