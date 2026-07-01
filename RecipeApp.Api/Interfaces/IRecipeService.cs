using RecipeApp.Api.DTOs;

namespace RecipeApp.Api.Interfaces;

public interface IRecipeService
{
    Task<RecipeResponseDto> CreateAsync(CreateRecipeDto dto, Guid userId);
    Task<List<RecipeResponseDto>> GetAllAsync(Guid userId);
    Task<RecipeDetailDto?> GetByIdAsync(Guid id, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}