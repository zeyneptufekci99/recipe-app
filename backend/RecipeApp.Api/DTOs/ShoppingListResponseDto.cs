namespace RecipeApp.Api.DTOs;

public class ShoppingListResponseDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public int ItemCount { get; set; }

    public int CompletedItemCount { get; set; }
}