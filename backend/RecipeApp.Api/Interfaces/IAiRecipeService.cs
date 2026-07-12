using RecipeApp.Api.DTOs;

namespace RecipeApp.Api.Interfaces;

public interface IAiRecipeService
{
    Task<ImportedRecipeDto> GenerateRecipeAsync(
        string prompt,
        CancellationToken cancellationToken = default
    );
}