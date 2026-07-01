using Microsoft.EntityFrameworkCore;
using RecipeApp.Api.Data;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;
using RecipeApp.Api.Models;

namespace RecipeApp.Api.Services;

public class RecipeService : IRecipeService
{
    private readonly AppDbContext _context;

    public RecipeService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<RecipeResponseDto> CreateAsync(CreateRecipeDto dto, Guid userId)
    {
        var recipe = new Recipe
        {
            UserId = userId,
            Title = dto.Title,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            PrepTime = dto.PrepTime,
            CookTime = dto.CookTime,
            Servings = dto.Servings,
            Difficulty = dto.Difficulty,
            CategoryId = dto.CategoryId,
            SourceType = dto.SourceType,
            SourceUrl = dto.SourceUrl,
            Ingredients = dto.Ingredients.Select(i => new Ingredient
            {
                Name = i.Name,
                Amount = i.Amount
            }).ToList(),
            Steps = dto.Steps.Select(s => new RecipeStep
            {
                StepNumber = s.StepNumber,
                Description = s.Description
            }).ToList()
        };

        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();

        var createdRecipe = await _context.Recipes
            .AsNoTracking()
            .Include(r => r.Category)
            .FirstAsync(r => r.Id == recipe.Id);

        return new RecipeResponseDto
        {
            Id = createdRecipe.Id,
            Title = createdRecipe.Title,
            ImageUrl = createdRecipe.ImageUrl,
            Category = createdRecipe.Category.Name,
            PrepTime = createdRecipe.PrepTime,
            CookTime = createdRecipe.CookTime,
            Servings = createdRecipe.Servings,
            Difficulty = createdRecipe.Difficulty
        };
    }

    public async Task<List<RecipeResponseDto>> GetAllAsync(Guid userId)
    {
        return await _context.Recipes
            .AsNoTracking()
            .Where(r => r.UserId == userId)
            .Include(r => r.Category)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new RecipeResponseDto
            {
                Id = r.Id,
                Title = r.Title,
                ImageUrl = r.ImageUrl,
                Category = r.Category.Name,
                PrepTime = r.PrepTime,
                CookTime = r.CookTime,
                Servings = r.Servings,
                Difficulty = r.Difficulty
            })
            .ToListAsync();
    }

    public async Task<RecipeDetailDto?> GetByIdAsync(Guid id, Guid userId)
    {
        return await _context.Recipes
            .AsNoTracking()
            .Where(r => r.Id == id && r.UserId == userId)
            .Include(r => r.Category)
            .Include(r => r.Ingredients)
            .Include(r => r.Steps)
            .Select(r => new RecipeDetailDto
            {
                Id = r.Id,
                Title = r.Title,
                Description = r.Description,
                ImageUrl = r.ImageUrl,
                Category = r.Category.Name,
                PrepTime = r.PrepTime,
                CookTime = r.CookTime,
                Servings = r.Servings,
                Difficulty = r.Difficulty,
                SourceType = r.SourceType,
                SourceUrl = r.SourceUrl,
                Ingredients = r.Ingredients.Select(i => new IngredientResponseDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Amount = i.Amount
                }).ToList(),
                Steps = r.Steps
                    .OrderBy(s => s.StepNumber)
                    .Select(s => new RecipeStepResponseDto
                    {
                        Id = s.Id,
                        StepNumber = s.StepNumber,
                        Description = s.Description
                    }).ToList()
            })
            .FirstOrDefaultAsync();
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
}