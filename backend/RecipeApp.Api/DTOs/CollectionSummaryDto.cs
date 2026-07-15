namespace RecipeApp.Api.DTOs;

public class CollectionSummaryDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int RecipeCount { get; set; }

    public string? CoverImageUrl { get; set; }
}