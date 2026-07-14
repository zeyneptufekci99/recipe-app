using Microsoft.EntityFrameworkCore;
using RecipeApp.Api.Data;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;
using RecipeApp.Api.Models;

namespace RecipeApp.Api.Services;

public class MealPlanService : IMealPlanService
{
    private readonly AppDbContext _context;

    public MealPlanService(AppDbContext context)
    {
        _context = context;
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