namespace RecipeApp.Api.DTOs;

public class RecipeStepResponseDto
{
    public Guid Id { get; set; }
    public int StepNumber { get; set; }
    public string Description { get; set; } = string.Empty;
}