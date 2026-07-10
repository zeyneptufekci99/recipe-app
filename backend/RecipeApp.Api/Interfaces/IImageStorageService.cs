namespace RecipeApp.Api.Services;

public interface IImageStorageService
{
    Task<string?> DownloadImageAsync(string? imageUrl);
}