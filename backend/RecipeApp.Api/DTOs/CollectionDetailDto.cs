namespace RecipeApp.Api.DTOs;

public class CollectionDetailDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public List<CollectionRecipeDto> Recipes { get; set; } = [];
}