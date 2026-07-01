using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;
using System.Security.Claims;

namespace RecipeApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RecipeController : ControllerBase
{
    private readonly IRecipeService _recipeService;

    public RecipeController(IRecipeService recipeService)
    {
        _recipeService = recipeService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateRecipeDto dto)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdString))
            return Unauthorized();

        var userId = Guid.Parse(userIdString);

        var response = await _recipeService.CreateAsync(dto, userId);

        return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdString))
            return Unauthorized();

        var userId = Guid.Parse(userIdString);

        var recipes = await _recipeService.GetAllAsync(userId);

        return Ok(recipes);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdString))
            return Unauthorized();

        var userId = Guid.Parse(userIdString);

        var recipe = await _recipeService.GetByIdAsync(id, userId);

        if (recipe == null)
            return NotFound("Tarif bulunamadı.");

        return Ok(recipe);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdString))
            return Unauthorized();

        var userId = Guid.Parse(userIdString);

        var result = await _recipeService.DeleteAsync(id, userId);

        if (!result)
            return NotFound("Tarif bulunamadı.");

        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateRecipeDto dto)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdString))
            return Unauthorized();

        var userId = Guid.Parse(userIdString);

        var recipe = await _recipeService.UpdateAsync(id, dto, userId);

        if (recipe == null)
            return NotFound("Tarif bulunamadı.");

        return Ok(recipe);
    }
}