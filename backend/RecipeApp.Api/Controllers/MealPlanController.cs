using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;

namespace RecipeApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MealPlanController : BaseController
{
    private readonly IMealPlanService _mealPlanService;

    public MealPlanController(IMealPlanService mealPlanService)
    {
        _mealPlanService = mealPlanService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateMealPlanItemDto dto)
    {
        var result = await _mealPlanService.CreateAsync(
            dto,
            CurrentUserId
        );

        if (result == null)
            return NotFound("Tarif bulunamadı.");

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetByDateRange(
        [FromQuery] DateOnly startDate,
        [FromQuery] DateOnly endDate)
    {
        var result = await _mealPlanService.GetByDateRangeAsync(
            CurrentUserId,
            startDate,
            endDate
        );

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mealPlanService.DeleteAsync(
            id,
            CurrentUserId
        );

        if (!result)
            return NotFound("Öğün planı bulunamadı.");

        return NoContent();
    }

    [HttpPost("generate-week")]
    public async Task<IActionResult> GenerateWeek(
    GenerateWeeklyMealPlanDto dto,
    CancellationToken cancellationToken)
    {
        if (dto.StartDate == default)
        {
            return BadRequest("Başlangıç tarihi zorunludur.");
        }

        if (string.IsNullOrWhiteSpace(dto.Preference))
        {
            dto.Preference =
                "Dengeli, çeşitli ve pratik bir haftalık plan oluştur.";
        }

        try
        {
            var result = await _mealPlanService.GenerateWeeklyPlanAsync(
                dto,
                CurrentUserId,
                cancellationToken
            );

            return Ok(result);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
        catch (InvalidOperationException exception)
        {
            return StatusCode(
                StatusCodes.Status422UnprocessableEntity,
                new
                {
                    message = "Haftalık plan oluşturulamadı.",
                    detail = exception.Message
                }
            );
        }
    }
}