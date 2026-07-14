using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;

namespace RecipeApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ShoppingListController : BaseController
{
    private readonly IShoppingListService _shoppingListService;

    public ShoppingListController(
        IShoppingListService shoppingListService)
    {
        _shoppingListService = shoppingListService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateShoppingListDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Liste adı zorunludur.");

        var result = await _shoppingListService.CreateAsync(
            dto,
            CurrentUserId
        );

        return Ok(result);
    }

    [HttpPost("from-meal-plan")]
    public async Task<IActionResult> CreateFromMealPlan(
        CreateShoppingListFromMealPlanDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Liste adı zorunludur.");

        if (dto.StartDate == default || dto.EndDate == default)
        {
            return BadRequest(
                "Başlangıç ve bitiş tarihleri zorunludur."
            );
        }

        var result =
            await _shoppingListService.CreateFromMealPlanAsync(
                dto,
                CurrentUserId
            );

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _shoppingListService.GetAllAsync(
            CurrentUserId
        );

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _shoppingListService.GetByIdAsync(
            id,
            CurrentUserId
        );

        if (result == null)
            return NotFound("Alışveriş listesi bulunamadı.");

        return Ok(result);
    }

    [HttpPost("{id}/recipes/{recipeId}")]
    public async Task<IActionResult> AddRecipe(
        Guid id,
        Guid recipeId)
    {
        var result = await _shoppingListService.AddRecipeAsync(
            id,
            recipeId,
            CurrentUserId
        );

        if (result == null)
        {
            return NotFound(
                "Alışveriş listesi veya tarif bulunamadı."
            );
        }

        return Ok(result);
    }

    [HttpPatch("items/{itemId}/toggle")]
    public async Task<IActionResult> ToggleItem(Guid itemId)
    {
        var result = await _shoppingListService.ToggleItemAsync(
            itemId,
            CurrentUserId
        );

        if (result == null)
            return NotFound("Liste maddesi bulunamadı.");

        return Ok(result);
    }

    [HttpDelete("items/{itemId}")]
    public async Task<IActionResult> DeleteItem(Guid itemId)
    {
        var result = await _shoppingListService.DeleteItemAsync(
            itemId,
            CurrentUserId
        );

        if (!result)
            return NotFound("Liste maddesi bulunamadı.");

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _shoppingListService.DeleteAsync(
            id,
            CurrentUserId
        );

        if (!result)
            return NotFound("Alışveriş listesi bulunamadı.");

        return NoContent();
    }
}