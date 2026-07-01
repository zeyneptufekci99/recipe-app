using RecipeApp.Api.DTOs;
using RecipeApp.Api.Common;
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
    int pageSize
    );
    Task<RecipeDetailDto?> GetByIdAsync(Guid id, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
    Task<RecipeDetailDto?> UpdateAsync(Guid id, UpdateRecipeDto dto, Guid userId);
}