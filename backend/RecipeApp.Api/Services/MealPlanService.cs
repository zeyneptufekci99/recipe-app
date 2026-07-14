using Microsoft.EntityFrameworkCore;
using RecipeApp.Api.Data;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;
using RecipeApp.Api.Models;
using RecipeApp.Api.Models.Enums;

namespace RecipeApp.Api.Services;

public class MealPlanService : IMealPlanService
{
    private readonly AppDbContext _context;
    private readonly IAiRecipeService _aiRecipeService;

    public MealPlanService(
        AppDbContext context,
        IAiRecipeService aiRecipeService)
    {
        _context = context;
        _aiRecipeService = aiRecipeService;
    }

    public async Task<MealPlanItemResponseDto?> CreateAsync(
        CreateMealPlanItemDto dto,
        Guid userId)
    {
        var recipeExists = await _context.Recipes
            .AsNoTracking()
            .AnyAsync(recipe =>
                recipe.Id == dto.RecipeId &&
                recipe.UserId == userId);

        if (!recipeExists)
            return null;

        var existingItem = await _context.MealPlanItems
            .FirstOrDefaultAsync(item =>
                item.UserId == userId &&
                item.Date == dto.Date &&
                item.MealType == dto.MealType);

        if (existingItem != null)
        {
            existingItem.RecipeId = dto.RecipeId;
            existingItem.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            var mealPlanItem = new MealPlanItem
            {
                UserId = userId,
                RecipeId = dto.RecipeId,
                Date = dto.Date,
                MealType = dto.MealType
            };

            _context.MealPlanItems.Add(mealPlanItem);
        }

        await _context.SaveChangesAsync();

        var savedItem = await _context.MealPlanItems
            .AsNoTracking()
            .Include(item => item.Recipe)
            .FirstAsync(item =>
                item.UserId == userId &&
                item.Date == dto.Date &&
                item.MealType == dto.MealType);

        return Map(savedItem);
    }

    public async Task<List<MealPlanItemResponseDto>> GetByDateRangeAsync(
        Guid userId,
        DateOnly startDate,
        DateOnly endDate)
    {
        if (endDate < startDate)
        {
            (startDate, endDate) = (endDate, startDate);
        }

        return await _context.MealPlanItems
            .AsNoTracking()
            .Where(item =>
                item.UserId == userId &&
                item.Date >= startDate &&
                item.Date <= endDate)
            .Include(item => item.Recipe)
            .OrderBy(item => item.Date)
            .ThenBy(item => item.MealType)
            .Select(item => new MealPlanItemResponseDto
            {
                Id = item.Id,
                RecipeId = item.RecipeId,
                RecipeTitle = item.Recipe.Title,
                RecipeImageUrl = item.Recipe.ImageUrl,
                Date = item.Date,
                MealType = item.MealType
            })
            .ToListAsync();
    }

    public async Task<bool> DeleteAsync(
        Guid id,
        Guid userId)
    {
        var mealPlanItem = await _context.MealPlanItems
            .FirstOrDefaultAsync(item =>
                item.Id == id &&
                item.UserId == userId);

        if (mealPlanItem == null)
            return false;

        _context.MealPlanItems.Remove(mealPlanItem);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<GeneratedWeeklyMealPlanDto> GenerateWeeklyPlanAsync(
    GenerateWeeklyMealPlanDto dto,
    Guid userId,
    CancellationToken cancellationToken = default)
    {
        var days = Math.Clamp(dto.Days, 1, 7);

        var startDate = dto.StartDate;
        var endDate = startDate.AddDays(days - 1);

        var enabledMealTypes = dto.MealTypes
            .Where(mealType => Enum.IsDefined(mealType))
            .Distinct()
            .ToHashSet();

        if (enabledMealTypes.Count == 0)
        {
            throw new ArgumentException(
                "En az bir öğün türü seçmelisiniz."
            );
        }

        var recipes = await _context.Recipes
            .AsNoTracking()
            .Where(recipe => recipe.UserId == userId)
            .Select(recipe => new RecipeAiOptionDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Category = recipe.Category.Name,
                PrepTime = recipe.PrepTime,
                CookTime = recipe.CookTime,
                Servings = recipe.Servings,
                Difficulty = (int)recipe.Difficulty
            })
            .ToListAsync(cancellationToken);

        if (recipes.Count == 0)
        {
            throw new InvalidOperationException(
                "AI planı oluşturmak için kayıtlı tarif bulunamadı."
            );
        }

        var generatedItems =
            await _aiRecipeService.GenerateWeeklyMealPlanAsync(
                dto,
                recipes,
                cancellationToken
            );

        if (generatedItems.Count == 0)
        {
            throw new InvalidOperationException(
                "AI geçerli bir haftalık plan oluşturamadı."
            );
        }

        var validRecipeIds = recipes
            .Select(recipe => recipe.Id)
            .ToHashSet();

        var existingItems = await _context.MealPlanItems
            .Where(item =>
                item.UserId == userId &&
                item.Date >= startDate &&
                item.Date <= endDate)
            .ToListAsync(cancellationToken);

        _context.MealPlanItems.RemoveRange(existingItems);

        foreach (var generatedItem in generatedItems)
        {
            if (!validRecipeIds.Contains(generatedItem.RecipeId))
                continue;

            if (!enabledMealTypes.Contains(generatedItem.MealType))
                continue;

            _context.MealPlanItems.Add(new MealPlanItem
            {
                UserId = userId,
                RecipeId = generatedItem.RecipeId,
                Date = generatedItem.Date,
                MealType = generatedItem.MealType
            });
        }

        await _context.SaveChangesAsync(cancellationToken);

        var savedItems = await GetByDateRangeAsync(
            userId,
            startDate,
            endDate
        );

        return new GeneratedWeeklyMealPlanDto
        {
            StartDate = startDate,
            EndDate = endDate,
            Days = days,
            Items = savedItems
        };
    }

    private static MealPlanItemResponseDto Map(
        MealPlanItem item)
    {
        return new MealPlanItemResponseDto
        {
            Id = item.Id,
            RecipeId = item.RecipeId,
            RecipeTitle = item.Recipe.Title,
            RecipeImageUrl = item.Recipe.ImageUrl,
            Date = item.Date,
            MealType = item.MealType
        };
    }


}