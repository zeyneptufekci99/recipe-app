namespace RecipeApp.Api.DTOs;

public class CreateCollectionDto
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
}