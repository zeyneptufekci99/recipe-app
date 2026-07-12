using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RecipeApp.Api.Common;
using RecipeApp.Api.Data;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;
using RecipeApp.Api.Models;
using RecipeApp.Api.Models.Enums;
using RecipeApp.Api.Options;

namespace RecipeApp.Api.Services;

public class RecipeService : IRecipeService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly IImageStorageService _imageStorageService;

    public RecipeService(AppDbContext context, IMapper mapper, IImageStorageService imageStorageService)
    {
        _context = context;
        _mapper = mapper;
        _imageStorageService = imageStorageService;

    }

    public async Task<RecipeResponseDto> CreateAsync(CreateRecipeDto dto, Guid userId)
    {
        var recipe = _mapper.Map<Recipe>(dto);

        recipe.UserId = userId;
        recipe.ImageUrl = await _imageStorageService.DownloadImageAsync(recipe.ImageUrl);

        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();

        var createdRecipe = await _context.Recipes
            .AsNoTracking()
            .Include(r => r.Category)
            .FirstAsync(r => r.Id == recipe.Id);

        return _mapper.Map<RecipeResponseDto>(createdRecipe);
    }

    public async Task<PagedResult<RecipeResponseDto>> GetAllAsync(
        Guid userId,
        string? search,
        Guid? categoryId,
        int? difficulty,
        int page,
        int pageSize,
        bool? isFavorite,
        string? sortBy)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0) pageSize = 10;

        var query = _context.Recipes
            .AsNoTracking()
            .Where(r => r.UserId == userId)
            .Include(r => r.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var loweredSearch = search.ToLower();

            query = query.Where(r =>
                r.Title.ToLower().Contains(loweredSearch) ||
                (r.Description != null && r.Description.ToLower().Contains(loweredSearch)));
        }

        if (categoryId.HasValue)
            query = query.Where(r => r.CategoryId == categoryId.Value);

        if (difficulty.HasValue)
            query = query.Where(r => (int)r.Difficulty == difficulty.Value);

        if (isFavorite.HasValue)
        {
            query = query.Where(r => r.IsFavorite == isFavorite.Value);
        }

        var totalCount = await query.CountAsync();

        query = sortBy switch
        {
            "created_asc" => query.OrderBy(r => r.CreatedAt),

            "title_asc" => query.OrderBy(r => r.Title),

            "title_desc" => query.OrderByDescending(r => r.Title),

            "favorites_first" => query
                .OrderByDescending(r => r.IsFavorite)
                .ThenByDescending(r => r.CreatedAt),

            _ => query.OrderByDescending(r => r.CreatedAt),
        };

        var recipes = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<RecipeResponseDto>
        {
            Items = _mapper.Map<List<RecipeResponseDto>>(recipes),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }

    public async Task<RecipeDetailDto?> GetByIdAsync(Guid id, Guid userId)
    {
        var recipe = await _context.Recipes
            .AsNoTracking()
            .Include(r => r.Category)
            .Include(r => r.Ingredients)
            .Include(r => r.Steps)
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        return recipe == null ? null : _mapper.Map<RecipeDetailDto>(recipe);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var recipe = await _context.Recipes
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        if (recipe == null)
            return false;

        _context.Recipes.Remove(recipe);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<RecipeDetailDto?> UpdateAsync(Guid id, UpdateRecipeDto dto, Guid userId)
    {
        var recipe = await _context.Recipes
            .Include(r => r.Ingredients)
            .Include(r => r.Steps)
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        if (recipe == null)
            return null;

        _mapper.Map(dto, recipe);

        recipe.ImageUrl = await _imageStorageService.DownloadImageAsync(recipe.ImageUrl);
        recipe.UpdatedAt = DateTime.UtcNow;

        _context.Ingredients.RemoveRange(recipe.Ingredients);
        _context.RecipeSteps.RemoveRange(recipe.Steps);

        recipe.Ingredients = dto.Ingredients.Select(i => new Ingredient
        {
            Name = i.Name,
            Amount = i.Amount
        }).ToList();

        recipe.Steps = dto.Steps.Select(s => new RecipeStep
        {
            StepNumber = s.StepNumber,
            Description = s.Description
        }).ToList();

        await _context.SaveChangesAsync();

        return await GetByIdAsync(recipe.Id, userId);
    }

    public async Task<RecipeResponseDto?> ToggleFavoriteAsync(Guid id, Guid userId)
    {
        var recipe = await _context.Recipes
            .Include(r => r.Category)
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        if (recipe == null)
            return null;

        recipe.IsFavorite = !recipe.IsFavorite;
        recipe.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return _mapper.Map<RecipeResponseDto>(recipe);
    }

    public async Task<RecipeDetailDto?> DuplicateAsync(Guid id, Guid userId)
    {
        var recipe = await _context.Recipes
            .AsNoTracking()
            .Include(r => r.Ingredients)
            .Include(r => r.Steps)
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        if (recipe == null)
            return null;

        var duplicatedRecipe = new Recipe
        {
            UserId = userId,
            Title = $"{recipe.Title} Copy",
            Description = recipe.Description,
            ImageUrl = recipe.ImageUrl,
            PrepTime = recipe.PrepTime,
            CookTime = recipe.CookTime,
            Servings = recipe.Servings,
            Difficulty = recipe.Difficulty,
            CategoryId = recipe.CategoryId,
            SourceType = recipe.SourceType,
            SourceUrl = recipe.SourceUrl,
            IsFavorite = false,

            Ingredients = recipe.Ingredients.Select(i => new Ingredient
            {
                Name = i.Name,
                Amount = i.Amount,
            }).ToList(),

            Steps = recipe.Steps.Select(s => new RecipeStep
            {
                StepNumber = s.StepNumber,
                Description = s.Description,
            }).ToList(),
        };

        _context.Recipes.Add(duplicatedRecipe);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(duplicatedRecipe.Id, userId);
    }

    public async Task<ProfileStatisticsDto> GetStatisticsAsync(Guid userId)
    {
        var query = _context.Recipes
            .AsNoTracking()
            .Where(r => r.UserId == userId);

        var recipeCount = await query.CountAsync();

        var favoriteCount = await query
            .CountAsync(r => r.IsFavorite);

        var importedRecipeCount = await query
            .CountAsync(r => r.SourceType != SourceType.Manual);

        var manualRecipeCount = await query
            .CountAsync(r => r.SourceType == SourceType.Manual);

        var mostUsedCategory = await query
            .GroupBy(r => r.Category.Name)
            .Select(group => new
            {
                Category = group.Key,
                Count = group.Count()
            })
            .OrderByDescending(item => item.Count)
            .Select(item => item.Category)
            .FirstOrDefaultAsync();

        return new ProfileStatisticsDto
        {
            RecipeCount = recipeCount,
            FavoriteCount = favoriteCount,
            ImportedRecipeCount = importedRecipeCount,
            ManualRecipeCount = manualRecipeCount,
            MostUsedCategory = mostUsedCategory
        };
    }
}