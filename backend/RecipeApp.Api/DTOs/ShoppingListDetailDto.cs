namespace RecipeApp.Api.DTOs;

public class ShoppingListDetailDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public List<ShoppingListItemResponseDto> Items { get; set; } = [];
}