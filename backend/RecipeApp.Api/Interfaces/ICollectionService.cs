using RecipeApp.Api.DTOs;

namespace RecipeApp.Api.Interfaces;

public interface ICollectionService
{
    Task<CollectionSummaryDto> CreateAsync(
        CreateCollectionDto dto,
        Guid userId
    );

    Task<List<CollectionSummaryDto>> GetAllAsync(Guid userId);

    Task<CollectionDetailDto?> GetByIdAsync(
        Guid id,
        Guid userId
    );

    Task<CollectionSummaryDto?> UpdateAsync(
        Guid id,
        UpdateCollectionDto dto,
        Guid userId
    );

    Task<bool> DeleteAsync(
        Guid id,
        Guid userId
    );

    Task<CollectionDetailDto?> AddRecipeAsync(
        Guid collectionId,
        Guid recipeId,
        Guid userId
    );

    Task<bool> RemoveRecipeAsync(
        Guid collectionId,
        Guid recipeId,
        Guid userId
    );

    Task<List<CollectionMembershipDto>> GetRecipeCollectionsAsync(
    Guid recipeId,
    Guid userId
);
}