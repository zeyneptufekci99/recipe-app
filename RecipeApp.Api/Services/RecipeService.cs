using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RecipeApp.Api.Common;
using RecipeApp.Api.Data;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;
using RecipeApp.Api.Models;

namespace RecipeApp.Api.Services;

public class RecipeService : IRecipeService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public RecipeService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
       
    }

    public async Task<RecipeResponseDto> CreateAsync(CreateRecipeDto dto, Guid userId)
    {
        var recipe = _mapper.Map<Recipe>(dto);

        recipe.UserId = userId;

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
        int pageSize)
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

        var totalCount = await query.CountAsync();

        var recipes = await query
            .OrderByDescending(r => r.CreatedAt)
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

        recipe.Title = dto.Title;
        recipe.Description = dto.Description;
        recipe.ImageUrl = dto.ImageUrl;
        recipe.PrepTime = dto.PrepTime;
        recipe.CookTime = dto.CookTime;
        recipe.Servings = dto.Servings;
        recipe.Difficulty = dto.Difficulty;
        recipe.CategoryId = dto.CategoryId;
        recipe.SourceType = dto.SourceType;
        recipe.SourceUrl = dto.SourceUrl;
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
}