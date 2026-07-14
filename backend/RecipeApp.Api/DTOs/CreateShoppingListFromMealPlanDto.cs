namespace RecipeApp.Api.DTOs;

public class CreateShoppingListFromMealPlanDto
{
	public string Name { get; set; } = string.Empty;

	public DateOnly StartDate { get; set; }

	public DateOnly EndDate { get; set; }
}