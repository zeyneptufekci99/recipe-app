using RecipeApp.Api.DTOs;

namespace RecipeApp.Api.Interfaces;

public interface IAiRecipeService
{
    Task<ImportedRecipeDto> GenerateRecipeAsync(
        string prompt,
        CancellationToken cancellationToken = default
    );

    Task<List<AiMealPlanItemDto>> GenerateWeeklyMealPlanAsync(
        GenerateWeeklyMealPlanDto dto,
        IReadOnlyCollection<RecipeAiOptionDto> recipes,
        CancellationToken cancellationToken = default
    );
}