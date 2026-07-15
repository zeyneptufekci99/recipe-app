using RecipeApp.Api.DTOs;

namespace RecipeApp.Api.Interfaces;

public interface IAiRecipeService
{
    Task<ImportedRecipeDto> GenerateRecipeAsync(
        string prompt,
        IReadOnlyCollection<string> pantryIngredients,
        CancellationToken cancellationToken = default
    );

    Task<List<AiMealPlanItemDto>> GenerateWeeklyMealPlanAsync(
        GenerateWeeklyMealPlanDto dto,
        IReadOnlyCollection<RecipeAiOptionDto> recipes,
        CancellationToken cancellationToken = default
    );

    Task<ImportedRecipeDto> TransformRecipeAsync(
    RecipeDetailDto recipe,
    string instruction,
    CancellationToken cancellationToken = default);

    Task<RecipeAssistantResponseDto> AskRecipeAssistantAsync(
    RecipeDetailDto recipe,
    string question,
    CancellationToken cancellationToken = default);

    Task<NutritionEstimateDto> EstimateNutritionAsync(
    RecipeDetailDto recipe,
    CancellationToken cancellationToken = default
);



}