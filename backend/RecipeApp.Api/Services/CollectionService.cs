using Microsoft.EntityFrameworkCore;
using RecipeApp.Api.Data;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;
using RecipeApp.Api.Models;

namespace RecipeApp.Api.Services;

public class CollectionService : ICollectionService
{
    private readonly AppDbContext _context;

    public CollectionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CollectionSummaryDto> CreateAsync(
        CreateCollectionDto dto,
        Guid userId)
    {
        var collection = new Collection
        {
            UserId = userId,
            Name = dto.Name.Trim(),
            Description = NormalizeDescription(dto.Description)
        };

        _context.Collections.Add(collection);
        await _context.SaveChangesAsync();

        return MapSummary(collection);
    }

    public async Task<List<CollectionSummaryDto>> GetAllAsync(
        Guid userId)
    {
        return await _context.Collections
            .AsNoTracking()
            .Where(collection => collection.UserId == userId)
            .OrderByDescending(collection => collection.CreatedAt)
            .Select(collection => new CollectionSummaryDto
            {
                Id = collection.Id,
                Name = collection.Name,
                Description = collection.Description,
                RecipeCount = collection.CollectionRecipes.Count,
                CoverImageUrl = collection.CollectionRecipes
                    .OrderByDescending(item => item.CreatedAt)
                    .Select(item => item.Recipe.ImageUrl)
                    .FirstOrDefault()
            })
            .ToListAsync();
    }

    public async Task<CollectionDetailDto?> GetByIdAsync(
        Guid id,
        Guid userId)
    {
        var collection = await _context.Collections
            .AsNoTracking()
            .Include(collection => collection.CollectionRecipes)
                .ThenInclude(collectionRecipe =>
                    collectionRecipe.Recipe)
                    .ThenInclude(recipe => recipe.Category)
            .FirstOrDefaultAsync(collection =>
                collection.Id == id &&
                collection.UserId == userId);

        return collection == null
            ? null
            : MapDetail(collection);
    }

    public async Task<CollectionSummaryDto?> UpdateAsync(
        Guid id,
        UpdateCollectionDto dto,
        Guid userId)
    {
        var collection = await _context.Collections
            .Include(collection => collection.CollectionRecipes)
            .FirstOrDefaultAsync(collection =>
                collection.Id == id &&
                collection.UserId == userId);

        if (collection == null)
            return null;

        collection.Name = dto.Name.Trim();
        collection.Description =
            NormalizeDescription(dto.Description);
        collection.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapSummary(collection);
    }

    public async Task<bool> DeleteAsync(
        Guid id,
        Guid userId)
    {
        var collection = await _context.Collections
            .FirstOrDefaultAsync(collection =>
                collection.Id == id &&
                collection.UserId == userId);

        if (collection == null)
            return false;

        _context.Collections.Remove(collection);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<CollectionDetailDto?> AddRecipeAsync(
        Guid collectionId,
        Guid recipeId,
        Guid userId)
    {
        var collection = await _context.Collections
            .FirstOrDefaultAsync(collection =>
                collection.Id == collectionId &&
                collection.UserId == userId);

        if (collection == null)
            return null;

        var recipeExists = await _context.Recipes
            .AsNoTracking()
            .AnyAsync(recipe =>
                recipe.Id == recipeId &&
                recipe.UserId == userId);

        if (!recipeExists)
            return null;

        var alreadyAdded = await _context.CollectionRecipes
            .AnyAsync(collectionRecipe =>
                collectionRecipe.CollectionId == collectionId &&
                collectionRecipe.RecipeId == recipeId);

        if (!alreadyAdded)
        {
            _context.CollectionRecipes.Add(new CollectionRecipe
            {
                CollectionId = collectionId,
                RecipeId = recipeId
            });

            await _context.SaveChangesAsync();
        }

        return await GetByIdAsync(collectionId, userId);
    }

    public async Task<bool> RemoveRecipeAsync(
        Guid collectionId,
        Guid recipeId,
        Guid userId)
    {
        var collectionBelongsToUser =
            await _context.Collections
                .AsNoTracking()
                .AnyAsync(collection =>
                    collection.Id == collectionId &&
                    collection.UserId == userId);

        if (!collectionBelongsToUser)
            return false;

        var collectionRecipe =
            await _context.CollectionRecipes
                .FirstOrDefaultAsync(item =>
                    item.CollectionId == collectionId &&
                    item.RecipeId == recipeId);

        if (collectionRecipe == null)
            return false;

        _context.CollectionRecipes.Remove(collectionRecipe);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<CollectionMembershipDto>>
    GetRecipeCollectionsAsync(
        Guid recipeId,
        Guid userId)
    {
        return await _context.CollectionRecipes
            .AsNoTracking()
            .Where(item =>
                item.RecipeId == recipeId &&
                item.Collection.UserId == userId &&
                item.Recipe.UserId == userId)
            .OrderBy(item => item.Collection.Name)
            .Select(item => new CollectionMembershipDto
            {
                CollectionId = item.CollectionId,
                CollectionName = item.Collection.Name
            })
            .ToListAsync();
    }

    private static CollectionSummaryDto MapSummary(
        Collection collection)
    {
        return new CollectionSummaryDto
        {
            Id = collection.Id,
            Name = collection.Name,
            Description = collection.Description,
            RecipeCount = collection.CollectionRecipes.Count,
            CoverImageUrl = collection.CollectionRecipes
                .OrderByDescending(item => item.CreatedAt)
                .Select(item => item.Recipe.ImageUrl)
                .FirstOrDefault()
        };
    }

    private static CollectionDetailDto MapDetail(
        Collection collection)
    {
        return new CollectionDetailDto
        {
            Id = collection.Id,
            Name = collection.Name,
            Description = collection.Description,
            Recipes = collection.CollectionRecipes
                .OrderByDescending(item => item.CreatedAt)
                .Select(item => new CollectionRecipeDto
                {
                    Id = item.Recipe.Id,
                    Title = item.Recipe.Title,
                    ImageUrl = item.Recipe.ImageUrl,
                    Category = item.Recipe.Category.Name,
                    PrepTime = item.Recipe.PrepTime,
                    CookTime = item.Recipe.CookTime,
                    Servings = item.Recipe.Servings
                })
                .ToList()
        };
    }

    private static string? NormalizeDescription(
        string? description)
    {
        var trimmedDescription = description?.Trim();

        return string.IsNullOrWhiteSpace(trimmedDescription)
            ? null
            : trimmedDescription;
    }
}