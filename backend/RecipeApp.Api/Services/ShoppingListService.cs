using Microsoft.EntityFrameworkCore;
using RecipeApp.Api.Data;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;
using RecipeApp.Api.Models;

namespace RecipeApp.Api.Services;

public class ShoppingListService : IShoppingListService
{
    private readonly AppDbContext _context;

    public ShoppingListService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ShoppingListResponseDto> CreateAsync(
        CreateShoppingListDto dto,
        Guid userId)
    {
        var shoppingList = new ShoppingList
        {
            UserId = userId,
            Name = dto.Name.Trim()
        };

        _context.ShoppingLists.Add(shoppingList);
        await _context.SaveChangesAsync();

        return MapSummary(shoppingList);
    }

    public async Task<ShoppingListResponseDto> CreateFromMealPlanAsync(
        CreateShoppingListFromMealPlanDto dto,
        Guid userId)
    {
        var startDate = dto.StartDate;
        var endDate = dto.EndDate;

        if (endDate < startDate)
        {
            (startDate, endDate) = (endDate, startDate);
        }

        var mealPlanItems = await _context.MealPlanItems
            .AsNoTracking()
            .Where(item =>
                item.UserId == userId &&
                item.Date >= startDate &&
                item.Date <= endDate)
            .Include(item => item.Recipe)
                .ThenInclude(recipe => recipe.Ingredients)
            .ToListAsync();

        var shoppingList = new ShoppingList
        {
            UserId = userId,
            Name = dto.Name.Trim()
        };

        var recipeIds = new HashSet<Guid>();

        foreach (var mealPlanItem in mealPlanItems)
        {
            if (!recipeIds.Add(mealPlanItem.RecipeId))
                continue;

            foreach (var ingredient in mealPlanItem.Recipe.Ingredients)
            {
                shoppingList.Items.Add(new ShoppingListItem
                {
                    RecipeId = mealPlanItem.RecipeId,
                    Name = ingredient.Name.Trim(),
                    Amount = ingredient.Amount?.Trim(),
                    IsCompleted = false
                });
            }
        }

        _context.ShoppingLists.Add(shoppingList);
        await _context.SaveChangesAsync();

        return MapSummary(shoppingList);
    }

    public async Task<List<ShoppingListResponseDto>> GetAllAsync(
        Guid userId)
    {
        return await _context.ShoppingLists
            .AsNoTracking()
            .Where(list => list.UserId == userId)
            .OrderByDescending(list => list.CreatedAt)
            .Select(list => new ShoppingListResponseDto
            {
                Id = list.Id,
                Name = list.Name,
                ItemCount = list.Items.Count,
                CompletedItemCount =
                    list.Items.Count(item => item.IsCompleted)
            })
            .ToListAsync();
    }

    public async Task<ShoppingListDetailDto?> GetByIdAsync(
        Guid id,
        Guid userId)
    {
        var shoppingList = await _context.ShoppingLists
            .AsNoTracking()
            .Include(list => list.Items)
            .FirstOrDefaultAsync(list =>
                list.Id == id &&
                list.UserId == userId);

        return shoppingList == null
            ? null
            : MapDetail(shoppingList);
    }

    public async Task<ShoppingListDetailDto?> AddRecipeAsync(
        Guid shoppingListId,
        Guid recipeId,
        Guid userId)
    {
        var shoppingList = await _context.ShoppingLists
            .Include(list => list.Items)
            .FirstOrDefaultAsync(list =>
                list.Id == shoppingListId &&
                list.UserId == userId);

        if (shoppingList == null)
            return null;

        var recipe = await _context.Recipes
            .AsNoTracking()
            .Include(recipe => recipe.Ingredients)
            .FirstOrDefaultAsync(recipe =>
                recipe.Id == recipeId &&
                recipe.UserId == userId);

        if (recipe == null)
            return null;

        var recipeAlreadyAdded = shoppingList.Items
            .Any(item => item.RecipeId == recipeId);

        if (recipeAlreadyAdded)
            return MapDetail(shoppingList);

        foreach (var ingredient in recipe.Ingredients)
        {
            shoppingList.Items.Add(new ShoppingListItem
            {
                RecipeId = recipe.Id,
                Name = ingredient.Name.Trim(),
                Amount = ingredient.Amount?.Trim(),
                IsCompleted = false
            });
        }

        await _context.SaveChangesAsync();

        return MapDetail(shoppingList);
    }

    public async Task<ShoppingListItemResponseDto?> ToggleItemAsync(
        Guid itemId,
        Guid userId)
    {
        var item = await _context.ShoppingListItems
            .Include(item => item.ShoppingList)
            .FirstOrDefaultAsync(item =>
                item.Id == itemId &&
                item.ShoppingList.UserId == userId);

        if (item == null)
            return null;

        item.IsCompleted = !item.IsCompleted;
        item.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapItem(item);
    }

    public async Task<bool> DeleteItemAsync(
        Guid itemId,
        Guid userId)
    {
        var item = await _context.ShoppingListItems
            .Include(item => item.ShoppingList)
            .FirstOrDefaultAsync(item =>
                item.Id == itemId &&
                item.ShoppingList.UserId == userId);

        if (item == null)
            return false;

        _context.ShoppingListItems.Remove(item);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(
        Guid id,
        Guid userId)
    {
        var shoppingList = await _context.ShoppingLists
            .FirstOrDefaultAsync(list =>
                list.Id == id &&
                list.UserId == userId);

        if (shoppingList == null)
            return false;

        _context.ShoppingLists.Remove(shoppingList);
        await _context.SaveChangesAsync();

        return true;
    }

    private static ShoppingListResponseDto MapSummary(
        ShoppingList shoppingList)
    {
        return new ShoppingListResponseDto
        {
            Id = shoppingList.Id,
            Name = shoppingList.Name,
            ItemCount = shoppingList.Items.Count,
            CompletedItemCount =
                shoppingList.Items.Count(item => item.IsCompleted)
        };
    }

    private static ShoppingListDetailDto MapDetail(
        ShoppingList shoppingList)
    {
        return new ShoppingListDetailDto
        {
            Id = shoppingList.Id,
            Name = shoppingList.Name,
            Items = shoppingList.Items
                .OrderBy(item => item.IsCompleted)
                .ThenBy(item => item.Name)
                .Select(MapItem)
                .ToList()
        };
    }

    private static ShoppingListItemResponseDto MapItem(
        ShoppingListItem item)
    {
        return new ShoppingListItemResponseDto
        {
            Id = item.Id,
            RecipeId = item.RecipeId,
            Name = item.Name,
            Amount = item.Amount,
            IsCompleted = item.IsCompleted
        };
    }
}