namespace RecipeApp.Api.DTOs;

public class ShoppingListItemResponseDto
{
    public Guid Id { get; set; }

    public Guid? RecipeId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Amount { get; set; }

    public bool IsCompleted { get; set; }
}