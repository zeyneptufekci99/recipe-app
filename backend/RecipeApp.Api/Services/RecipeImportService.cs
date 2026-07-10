using HtmlAgilityPack;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;
using System.Net;
using System.Text.RegularExpressions;
namespace RecipeApp.Api.Services;

public class RecipeImportService : IRecipeImportService
{
    private readonly HttpClient _httpClient;

    public RecipeImportService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ImportedRecipeDto> ImportFromUrlAsync(string url)
    {
        var html = await _httpClient.GetStringAsync(url);

        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var title = CleanText(
            doc.DocumentNode.SelectSingleNode("//h1")?.InnerText
        );

        var ingredients = GetIngredients(doc);
        var steps = GetSteps(doc);

        var imageUrl = GetImageUrl(doc);

        var prepTime = GetPrepTime(doc);
        var cookTime = GetCookTime(doc);
        var servings = GetServings(doc);

        return new ImportedRecipeDto
        {
            Title = string.IsNullOrWhiteSpace(title) ? "Imported Recipe" : title,
            Description = "Imported from URL",
            ImageUrl = imageUrl,
            PrepTime = prepTime,
            CookTime = cookTime,
            Servings = servings,
            Ingredients = ingredients,
            Steps = steps,
        };
    }

    private static List<CreateIngredientDto> GetIngredients(HtmlDocument doc)
    {
        var nodes = doc.DocumentNode.SelectNodes(
            "//ul[contains(@class,'recipe-materials')]/li | //div[contains(@class,'recipe-materials')]//li | //li[contains(@class,'recipe-material')]"
        );

        if (nodes == null)
            return [];

        return nodes
            .Select(node => CleanText(node.InnerText))
            .Where(text => !string.IsNullOrWhiteSpace(text))
            .Select(text => new CreateIngredientDto
            {
                Name = text,
                Amount = ""
            })
            .ToList();
    }

    private static List<CreateRecipeStepDto> GetSteps(HtmlDocument doc)
    {
        var nodes = doc.DocumentNode.SelectNodes(
            "//ol[contains(@class,'recipe-instructions')]/li | //div[contains(@class,'recipe-instructions')]//li | //li[contains(@class,'recipe-instruction')]"
        );

        if (nodes == null)
            return [];

        return nodes
            .Select((node, index) => new CreateRecipeStepDto
            {
                StepNumber = index + 1,
                Description = CleanText(node.InnerText)
            })
            .Where(step => !string.IsNullOrWhiteSpace(step.Description))
            .ToList();
    }

    private static string CleanText(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return string.Empty;

        return WebUtility.HtmlDecode(value)
            .Replace("\n", " ")
            .Replace("\r", " ")
            .Replace("\t", " ")
            .Trim();
    }

    private static string? GetImageUrl(HtmlDocument doc)
    {
        return doc.DocumentNode
            .SelectSingleNode("//meta[@property='og:image']")
            ?.GetAttributeValue("content", null);
    }

    private static int GetPrepTime(HtmlDocument doc)
    {
        var text = CleanText(doc.DocumentNode.InnerText);

        var match = Regex.Match(
            text,
            @"(\d+)\s*dk\s*Hazırlık",
            RegexOptions.IgnoreCase
        );

        return match.Success && int.TryParse(match.Groups[1].Value, out var minutes)
            ? minutes
            : 0;
    }

    private static int GetCookTime(HtmlDocument doc)
    {
        var text = CleanText(doc.DocumentNode.InnerText);

        var match = Regex.Match(
            text,
            @"(\d+)\s*dk\s*Pişirme",
            RegexOptions.IgnoreCase
        );

        return match.Success && int.TryParse(match.Groups[1].Value, out var minutes)
            ? minutes
            : 0;
    }

    private static int GetServings(HtmlDocument doc)
    {
        var text = CleanText(doc.DocumentNode.InnerText);

        var match = Regex.Match(
            text,
            @"(\d+)(?:\s*-\s*(\d+))?\s*Kişilik",
            RegexOptions.IgnoreCase
        );

        if (!match.Success)
            return 1;

        if (int.TryParse(match.Groups[2].Value, out var maxServing))
            return maxServing;

        return int.TryParse(match.Groups[1].Value, out var serving)
            ? serving
            : 1;
    }
}