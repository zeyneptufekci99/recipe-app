using System.Net.Http.Headers;
using RecipeApp.Api.Interfaces;

namespace RecipeApp.Api.Services;

public class ImageStorageService : IImageStorageService
{
    private readonly IWebHostEnvironment _env;
    private readonly IHttpClientFactory _httpClientFactory;

    public ImageStorageService(
        IWebHostEnvironment env,
        IHttpClientFactory httpClientFactory)
    {
        _env = env;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<string?> DownloadImageAsync(string? imageUrl)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
            return null;

        if (imageUrl.StartsWith("/uploads"))
            return imageUrl;

        if (!Uri.TryCreate(imageUrl, UriKind.Absolute, out var uri))
            return null;

        var client = _httpClientFactory.CreateClient();

        client.DefaultRequestHeaders.UserAgent.Add(
            new ProductInfoHeaderValue("RecipeApp", "1.0")
        );

        var response = await client.GetAsync(uri);

        if (!response.IsSuccessStatusCode)
            return imageUrl;

        var contentType = response.Content.Headers.ContentType?.MediaType;

        var extension = contentType switch
        {
            "image/jpeg" => ".jpg",
            "image/jpg" => ".jpg",
            "image/png" => ".png",
            "image/webp" => ".webp",
            _ => Path.GetExtension(uri.AbsolutePath)
        };

        if (string.IsNullOrWhiteSpace(extension))
            extension = ".jpg";

        var uploadsFolder = Path.Combine(
            _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"),
            "uploads",
            "recipes"
        );

        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        await using var stream = await response.Content.ReadAsStreamAsync();
        await using var fileStream = new FileStream(filePath, FileMode.Create);

        await stream.CopyToAsync(fileStream);

        return $"/uploads/recipes/{fileName}";
    }
}