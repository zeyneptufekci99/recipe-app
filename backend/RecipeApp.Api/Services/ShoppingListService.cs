using Microsoft.EntityFrameworkCore;
using RecipeApp.Api.Data;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;
using RecipeApp.Api.Models;
using System.Globalization;
using System.Text.RegularExpressions;

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
                CompletedItemCount = list.Items.Count(item => item.IsCompleted)
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
        {
            return await GetByIdAsync(shoppingListId, userId);
        }

        foreach (var ingredient in recipe.Ingredients)
        {
            AddOrMergeIngredient(
                shoppingList,
                recipe.Id,
                ingredient.Name,
                ingredient.Amount
            );
        }

        await _context.SaveChangesAsync();

        return await GetByIdAsync(shoppingListId, userId);
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
    private static void AddOrMergeIngredient(
    ShoppingList shoppingList,
    Guid recipeId,
    string ingredientName,
    string? ingredientAmount)
    {
        var normalizedName = NormalizeIngredientName(ingredientName);

        var matchingItem = shoppingList.Items
            .FirstOrDefault(item =>
                NormalizeIngredientName(item.Name) == normalizedName &&
                !item.IsCompleted
            );

        if (
            matchingItem != null &&
            TryMergeAmounts(
                matchingItem.Amount,
                ingredientAmount,
                out var mergedAmount
            )
        )
        {
            matchingItem.Amount = mergedAmount;
            matchingItem.UpdatedAt = DateTime.UtcNow;
            return;
        }

        shoppingList.Items.Add(new ShoppingListItem
        {
            RecipeId = recipeId,
            Name = ingredientName.Trim(),
            Amount = ingredientAmount?.Trim(),
            IsCompleted = false
        });
    }

    private static string NormalizeIngredientName(string value)
    {
        var normalized = value
            .Trim()
            .ToLowerInvariant()
            .Replace("ı", "i")
            .Replace("ş", "s")
            .Replace("ğ", "g")
            .Replace("ü", "u")
            .Replace("ö", "o")
            .Replace("ç", "c");

        normalized = Regex.Replace(
            normalized,
            @"^\d+(?:[.,/]\d+)?\s*",
            ""
        );

        normalized = Regex.Replace(
            normalized,
            @"^(adet|gram|gr|kg|kilogram|ml|litre|lt|su bardagi|cay bardagi|yemek kasigi|cay kasigi)\s+",
            ""
        );

        normalized = Regex.Replace(normalized, @"\s+", " ");

        return normalized.Trim();
    }

    private static bool TryMergeAmounts(
        string? currentAmount,
        string? newAmount,
        out string mergedAmount)
    {
        mergedAmount = string.Empty;

        if (
            string.IsNullOrWhiteSpace(currentAmount) ||
            string.IsNullOrWhiteSpace(newAmount)
        )
        {
            return false;
        }

        var current = ParseAmount(currentAmount);
        var incoming = ParseAmount(newAmount);

        if (current == null || incoming == null)
            return false;

        if (!string.Equals(
                current.Unit,
                incoming.Unit,
                StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        var total = current.Value + incoming.Value;

        mergedAmount = FormatAmount(total, current.Unit);

        return true;
    }

    private static ParsedAmount? ParseAmount(string amount)
    {
        var normalized = amount
            .Trim()
            .ToLowerInvariant()
            .Replace(",", ".");

        var match = Regex.Match(
            normalized,
            @"^(?<value>\d+(?:\.\d+)?)\s*(?<unit>.+)$"
        );

        if (!match.Success)
            return null;

        if (!decimal.TryParse(
                match.Groups["value"].Value,
                NumberStyles.Number,
                CultureInfo.InvariantCulture,
                out var value))
        {
            return null;
        }

        var unit = NormalizeUnit(match.Groups["unit"].Value);

        if (string.IsNullOrWhiteSpace(unit))
            return null;

        return new ParsedAmount(value, unit);
    }

    private static string NormalizeUnit(string unit)
    {
        var normalized = Regex.Replace(
            unit.Trim().ToLowerInvariant(),
            @"\s+",
            " "
        );

        return normalized switch
        {
            "gr" => "gram",
            "g" => "gram",
            "kg" => "kilogram",
            "ml" => "mililitre",
            "l" => "litre",
            "lt" => "litre",
            _ => normalized
        };
    }

    private static string FormatAmount(decimal value, string unit)
    {
        var formattedValue =
            value % 1 == 0
                ? decimal.ToInt32(value).ToString()
                : value.ToString("0.##", CultureInfo.InvariantCulture)
                    .Replace(".", ",");

        return $"{formattedValue} {unit}";
    }

    private sealed record ParsedAmount(
        decimal Value,
        string Unit
    );
}