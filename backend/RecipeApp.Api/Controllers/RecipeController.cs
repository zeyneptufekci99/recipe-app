using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;

namespace RecipeApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RecipeController : BaseController
{
    private readonly IRecipeService _recipeService;
    private readonly IRecipeImportService _recipeImportService;

    public RecipeController(
       IRecipeService recipeService,
       IRecipeImportService recipeImportService)
    {
        _recipeService = recipeService;
        _recipeImportService = recipeImportService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateRecipeDto dto)
    {
        var response = await _recipeService.CreateAsync(dto, CurrentUserId);
        return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? sortBy,
        [FromQuery] string? search,
        [FromQuery] Guid? categoryId,
        [FromQuery] int? difficulty,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10
        )
    {
        var recipes = await _recipeService.GetAllAsync(
            CurrentUserId,
            search,
            categoryId,
            difficulty,
            page,
            pageSize,
            isFavorite: null,
            sortBy: sortBy
        );

        return Ok(recipes);
    }

    [HttpGet("favorites")]
    public async Task<IActionResult> GetFavorites()
    {
        var result = await _recipeService.GetAllAsync(
            CurrentUserId,
            search: null,
            categoryId: null,
            difficulty: null,
            page: 1,
            pageSize: 50,
            isFavorite: true,
            sortBy: "created_desc"
        );

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var recipe = await _recipeService.GetByIdAsync(id, CurrentUserId);

        if (recipe == null)
            return NotFound("Tarif bulunamadı.");

        return Ok(recipe);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _recipeService.DeleteAsync(id, CurrentUserId);

        if (!result)
            return NotFound("Tarif bulunamadı.");

        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateRecipeDto dto)
    {
        var recipe = await _recipeService.UpdateAsync(id, dto, CurrentUserId);

        if (recipe == null)
            return NotFound("Tarif bulunamadı.");

        return Ok(recipe);
    }

    [HttpPatch("{id}/favorite")]
    public async Task<IActionResult> ToggleFavorite(Guid id)
    {
        var recipe = await _recipeService.ToggleFavoriteAsync(id, CurrentUserId);

        if (recipe == null)
            return NotFound("Tarif bulunamadı.");

        return Ok(recipe);
    }
    [HttpPost("{id}/duplicate")]
    public async Task<IActionResult> Duplicate(Guid id)
    {
        var recipe = await _recipeService.DuplicateAsync(id, CurrentUserId);

        if (recipe == null)
            return NotFound("Tarif bulunamadı.");

        return Ok(recipe);
    }
    [HttpPost("import-url")]
    public async Task<IActionResult> ImportFromUrl(ImportRecipeFromUrlDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Url))
            return BadRequest("Url zorunludur.");

        var result = await _recipeImportService.ImportFromUrlAsync(dto.Url);

        return Ok(result);
    }


    [HttpGet("statistics")]
    public async Task<IActionResult> GetStatistics()
    {
        var result = await _recipeService.GetStatisticsAsync(CurrentUserId);

        return Ok(result);
    }
}