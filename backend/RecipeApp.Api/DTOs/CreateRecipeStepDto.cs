namespace RecipeApp.Api.DTOs;

public class CreateRecipeStepDto
{
    public int StepNumber { get; set; }

    public string Description { get; set; } = string.Empty;
}