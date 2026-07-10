using RecipeApp.Api.DTOs;

namespace RecipeApp.Api.Interfaces;

public interface IRecipeImportService
{
    Task<ImportedRecipeDto> ImportFromUrlAsync(string url);
}