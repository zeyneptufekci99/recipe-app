using RecipeApp.Api.DTOs;

namespace RecipeApp.Api.Interfaces;

public interface IMealPlanService
{
	Task<MealPlanItemResponseDto?> CreateAsync(
		CreateMealPlanItemDto dto,
		Guid userId
	);

	Task<List<MealPlanItemResponseDto>> GetByDateRangeAsync(
		Guid userId,
		DateOnly startDate,
		DateOnly endDate
	);

	Task<bool> DeleteAsync(
		Guid id,
		Guid userId
	);

    Task<GeneratedWeeklyMealPlanDto> GenerateWeeklyPlanAsync(
    GenerateWeeklyMealPlanDto dto,
    Guid userId,
    CancellationToken cancellationToken = default
);
}