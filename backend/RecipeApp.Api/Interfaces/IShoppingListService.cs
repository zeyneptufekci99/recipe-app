using RecipeApp.Api.DTOs;

namespace RecipeApp.Api.Interfaces;

public interface IShoppingListService
{
    Task<ShoppingListResponseDto> CreateAsync(
        CreateShoppingListDto dto,
        Guid userId
    );

    Task<List<ShoppingListResponseDto>> GetAllAsync(Guid userId);

    Task<ShoppingListDetailDto?> GetByIdAsync(
        Guid id,
        Guid userId
    );

    Task<ShoppingListDetailDto?> AddRecipeAsync(
        Guid shoppingListId,
        Guid recipeId,
        Guid userId
    );

    Task<ShoppingListItemResponseDto?> ToggleItemAsync(
        Guid itemId,
        Guid userId
    );

    Task<bool> DeleteItemAsync(
        Guid itemId,
        Guid userId
    );

    Task<bool> DeleteAsync(
        Guid id,
        Guid userId
    );
}