using RecipeApp.Api.Common;
using RecipeApp.Api.DTOs;

namespace RecipeApp.Api.Interfaces;

public interface IRecipeService
{
    Task<RecipeResponseDto> CreateAsync(CreateRecipeDto dto, Guid userId);

    Task<PagedResult<RecipeResponseDto>> GetAllAsync(
        Guid userId,
        string? search,
        Guid? categoryId,
        int? difficulty,
        int page,
        int pageSize,
        bool? isFavorite,
        string? sortBy
    );

    Task<RecipeDetailDto?> GetByIdAsync(Guid id, Guid userId);

    Task<bool> DeleteAsync(Guid id, Guid userId);

    Task<RecipeDetailDto?> UpdateAsync(Guid id, UpdateRecipeDto dto, Guid userId);

    Task<RecipeResponseDto?> ToggleFavoriteAsync(Guid id, Guid userId);

    Task<RecipeDetailDto?> DuplicateAsync(Guid id, Guid userId);

    Task<ProfileStatisticsDto> GetStatisticsAsync(Guid userId);
}