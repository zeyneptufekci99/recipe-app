using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;
using System.Security.Claims;

namespace RecipeApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RecipeController : BaseController
{
    private readonly IRecipeService _recipeService;

    public RecipeController(IRecipeService recipeService)
    {
        _recipeService = recipeService;
    }

    /// <summary>
    /// Creates a new recipe for the authenticated user.
    /// </summary>
    /// <param name="dto">Recipe creation data.</param>
    /// <returns>Created recipe summary.</returns>
    [HttpPost]
    public async Task<IActionResult> Create(CreateRecipeDto dto)
    {

        var response = await _recipeService.CreateAsync(dto, CurrentUserId);

        return Ok(response);
    }

    /// <summary>
    /// Gets recipes of the authenticated user with pagination, search and filters.
    /// </summary>
    /// <param name="search">Search text for recipe title or description.</param>
    /// <param name="categoryId">Optional category filter.</param>
    /// <param name="difficulty">Optional difficulty filter. Easy = 1, Medium = 2, Hard = 3.</param>
    /// <param name="page">Page number.</param>
    /// <param name="pageSize">Number of items per page.</param>
    /// <returns>Paged list of recipes.</returns>

    [HttpGet]
    public async Task<IActionResult> GetAll( [FromQuery] string? search, [FromQuery] Guid? categoryId,[FromQuery] int? difficulty, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
      
        var recipes = await _recipeService.GetAllAsync(
            CurrentUserId,
            search,
            categoryId,
            difficulty,
            page,
            pageSize

        );

        return Ok(recipes);
    }

    /// <summary>
    /// Gets recipe detail by id for the authenticated user.
    /// </summary>
    /// <param name="id">Recipe id.</param>
    /// <returns>Recipe detail with ingredients and steps.</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {

        var recipe = await _recipeService.GetByIdAsync(id, CurrentUserId);

        if (recipe == null)
            return NotFound("Tarif bulunamadı.");

        return Ok(recipe);
    }

    /// <summary>
    /// Deletes an existing recipe.
    /// </summary>
    /// <param name="id">Recipe id.</param>
    /// <returns>No content if deletion is successful.</returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
      
        var result = await _recipeService.DeleteAsync(id, CurrentUserId);

        if (!result)
            return NotFound("Tarif bulunamadı.");

        return NoContent();
    }

    /// <summary>
    /// Updates an existing recipe.
    /// </summary>
    /// <param name="id">Recipe id.</param>
    /// <param name="dto">Updated recipe data.</param>
    /// <returns>Updated recipe detail.</returns>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateRecipeDto dto)
    {
        
        var recipe = await _recipeService.UpdateAsync(id, dto, CurrentUserId);

        if (recipe == null)
            return NotFound("Tarif bulunamadı.");

        return Ok(recipe);
    }


    /// <summary>
    /// Toggles favorite status of a recipe.
    /// </summary>
    /// <param name="id">Recipe id.</param>
    /// <returns>Updated recipe summary.</returns>
    [HttpPatch("{id}/favorite")]
    public async Task<IActionResult> ToggleFavorite(Guid id)
    {
        var recipe = await _recipeService.ToggleFavoriteAsync(id, CurrentUserId);

        if (recipe == null)
            return NotFound("Tarif bulunamadı.");

        return Ok(recipe);
    }
}