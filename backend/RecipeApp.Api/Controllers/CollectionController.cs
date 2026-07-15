using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;

namespace RecipeApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CollectionController : BaseController
{
    private readonly ICollectionService _collectionService;

    public CollectionController(
        ICollectionService collectionService)
    {
        _collectionService = collectionService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateCollectionDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest("Koleksiyon adı zorunludur.");
        }

        var result = await _collectionService.CreateAsync(
            dto,
            CurrentUserId
        );

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _collectionService.GetAllAsync(
            CurrentUserId
        );

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _collectionService.GetByIdAsync(
            id,
            CurrentUserId
        );

        if (result == null)
        {
            return NotFound("Koleksiyon bulunamadı.");
        }

        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateCollectionDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest("Koleksiyon adı zorunludur.");
        }

        var result = await _collectionService.UpdateAsync(
            id,
            dto,
            CurrentUserId
        );

        if (result == null)
        {
            return NotFound("Koleksiyon bulunamadı.");
        }

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _collectionService.DeleteAsync(
            id,
            CurrentUserId
        );

        if (!deleted)
        {
            return NotFound("Koleksiyon bulunamadı.");
        }

        return NoContent();
    }

    [HttpPost("{id}/recipes/{recipeId}")]
    public async Task<IActionResult> AddRecipe(
        Guid id,
        Guid recipeId)
    {
        var result = await _collectionService.AddRecipeAsync(
            id,
            recipeId,
            CurrentUserId
        );

        if (result == null)
        {
            return NotFound(
                "Koleksiyon veya tarif bulunamadı."
            );
        }

        return Ok(result);
    }

    [HttpDelete("{id}/recipes/{recipeId}")]
    public async Task<IActionResult> RemoveRecipe(
        Guid id,
        Guid recipeId)
    {
        var removed =
            await _collectionService.RemoveRecipeAsync(
                id,
                recipeId,
                CurrentUserId
            );

        if (!removed)
        {
            return NotFound(
                "Koleksiyon veya koleksiyondaki tarif bulunamadı."
            );
        }

        return NoContent();
    }

    [HttpGet("recipe/{recipeId}")]
    public async Task<IActionResult> GetRecipeCollections(
    Guid recipeId)
    {
        var result =
            await _collectionService.GetRecipeCollectionsAsync(
                recipeId,
                CurrentUserId
            );

        return Ok(result);
    }
}