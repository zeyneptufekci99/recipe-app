using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;
using RecipeApp.Api.Options;

namespace RecipeApp.Api.Services;

public class GeminiRecipeService : IAiRecipeService
{
    private readonly HttpClient _httpClient;
    private readonly GeminiOptions _options;
    private readonly JsonSerializerOptions _jsonOptions;

    public GeminiRecipeService(
        HttpClient httpClient,
        IOptions<GeminiOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;

        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
    }

    public async Task<ImportedRecipeDto> GenerateRecipeAsync(
        string prompt,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(prompt))
            throw new ArgumentException(
                "Tarif açıklaması zorunludur.",
                nameof(prompt)
            );

        if (string.IsNullOrWhiteSpace(_options.ApiKey))
            throw new InvalidOperationException(
                "Gemini API anahtarı yapılandırılmamış."
            );

        if (string.IsNullOrWhiteSpace(_options.Model))
            throw new InvalidOperationException(
                "Gemini model bilgisi yapılandırılmamış."
            );

        var endpoint =
            $"https://generativelanguage.googleapis.com/v1beta/models/" +
            $"{Uri.EscapeDataString(_options.Model)}:generateContent";

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    role = "user",
                    parts = new[]
                    {
                        new
                        {
                            text = BuildPrompt(prompt)
                        }
                    }
                }
            },
            generationConfig = new
            {
                temperature = 0.4,
                responseMimeType = "application/json",
                responseSchema = CreateRecipeSchema()
            }
        };

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            endpoint
        );

        request.Headers.Add("x-goog-api-key", _options.ApiKey);
        request.Content = JsonContent.Create(requestBody);

        using var response = await _httpClient.SendAsync(
            request,
            cancellationToken
        );

        var responseContent = await response.Content.ReadAsStringAsync(
            cancellationToken
        );

        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException(
                $"Gemini isteği başarısız oldu. " +
                $"Status: {(int)response.StatusCode}. " +
                $"Response: {responseContent}"
            );
        }

        var geminiResponse = JsonSerializer.Deserialize<GeminiResponse>(
            responseContent,
            _jsonOptions
        );

        var generatedJson = geminiResponse?
            .Candidates?
            .FirstOrDefault()?
            .Content?
            .Parts?
            .FirstOrDefault()?
            .Text;

        if (string.IsNullOrWhiteSpace(generatedJson))
        {
            throw new InvalidOperationException(
                "Gemini geçerli bir tarif yanıtı üretmedi."
            );
        }

        var recipe = JsonSerializer.Deserialize<ImportedRecipeDto>(
            generatedJson,
            _jsonOptions
        );

        if (recipe == null)
        {
            throw new InvalidOperationException(
                "Gemini tarif yanıtı okunamadı."
            );
        }

        NormalizeRecipe(recipe);

        return recipe;
    }

    private static string BuildPrompt(string userPrompt)
    {
        return $"""
            Kullanıcının isteğine göre eksiksiz ve uygulanabilir bir yemek
            tarifi oluştur.

            Kullanıcı isteği:
            {userPrompt.Trim()}

            Kurallar:
            - Yanıt dili Türkçe olsun.
            - Başlık kısa ve anlaşılır olsun.
            - Açıklama en fazla 2-3 cümle olsun.
            - Hazırlık ve pişirme süreleri dakika cinsinden tam sayı olsun.
            - Porsiyon en az 1 olsun.
            - Her malzemenin adı ve miktarı ayrı alanlarda yer alsın.
            - Yapılış adımları açık, sıralı ve uygulanabilir olsun.
            - StepNumber değerleri 1'den başlayarak ardışık ilerlesin.
            - Görsel URL'si üretme; imageUrl boş string olsun.
            """;
    }

    private static object CreateRecipeSchema()
    {
        return new
        {
            type = "object",
            properties = new
            {
                title = new
                {
                    type = "string",
                    description = "Tarifin kısa ve anlaşılır adı."
                },
                description = new
                {
                    type = "string",
                    description = "Tarifin kısa açıklaması."
                },
                imageUrl = new
                {
                    type = "string",
                    description = "Boş string olmalıdır."
                },
                prepTime = new
                {
                    type = "integer",
                    description = "Hazırlık süresi, dakika.",
                    minimum = 0
                },
                cookTime = new
                {
                    type = "integer",
                    description = "Pişirme süresi, dakika.",
                    minimum = 0
                },
                servings = new
                {
                    type = "integer",
                    description = "Tarifin porsiyon sayısı.",
                    minimum = 1
                },
                ingredients = new
                {
                    type = "array",
                    items = new
                    {
                        type = "object",
                        properties = new
                        {
                            name = new
                            {
                                type = "string",
                                description = "Malzemenin adı."
                            },
                            amount = new
                            {
                                type = "string",
                                description = "Malzemenin miktarı ve ölçü birimi."
                            }
                        },
                        required = new[]
                        {
                            "name",
                            "amount"
                        }
                    }
                },
                steps = new
                {
                    type = "array",
                    items = new
                    {
                        type = "object",
                        properties = new
                        {
                            stepNumber = new
                            {
                                type = "integer",
                                description = "Adım sırası.",
                                minimum = 1
                            },
                            description = new
                            {
                                type = "string",
                                description = "Yapılış adımının açıklaması."
                            }
                        },
                        required = new[]
                        {
                            "stepNumber",
                            "description"
                        }
                    }
                }
            },
            required = new[]
            {
                "title",
                "description",
                "imageUrl",
                "prepTime",
                "cookTime",
                "servings",
                "ingredients",
                "steps"
            }
        };
    }

    private static void NormalizeRecipe(ImportedRecipeDto recipe)
    {
        recipe.Title = recipe.Title?.Trim() ?? string.Empty;
        recipe.Description = recipe.Description?.Trim();
        recipe.ImageUrl = string.Empty;

        recipe.PrepTime = Math.Max(0, recipe.PrepTime);
        recipe.CookTime = Math.Max(0, recipe.CookTime);
        recipe.Servings = Math.Max(1, recipe.Servings);

        recipe.Ingredients ??= [];
        recipe.Steps ??= [];

        recipe.Ingredients = recipe.Ingredients
            .Where(ingredient =>
                !string.IsNullOrWhiteSpace(ingredient.Name))
            .Select(ingredient =>
            {
                ingredient.Name = ingredient.Name.Trim();
                ingredient.Amount = ingredient.Amount?.Trim() ?? string.Empty;

                return ingredient;
            })
            .ToList();

        recipe.Steps = recipe.Steps
            .Where(step =>
                !string.IsNullOrWhiteSpace(step.Description))
            .Select((step, index) =>
            {
                step.StepNumber = index + 1;
                step.Description = step.Description.Trim();

                return step;
            })
            .ToList();

        if (string.IsNullOrWhiteSpace(recipe.Title))
        {
            throw new InvalidOperationException(
                "Gemini tarif başlığı oluşturmadı."
            );
        }

        if (recipe.Ingredients.Count == 0)
        {
            throw new InvalidOperationException(
                "Gemini tarif malzemeleri oluşturmadı."
            );
        }

        if (recipe.Steps.Count == 0)
        {
            throw new InvalidOperationException(
                "Gemini tarif adımları oluşturmadı."
            );
        }
    }

    private sealed class GeminiResponse
    {
        public List<GeminiCandidate>? Candidates { get; set; }
    }

    private sealed class GeminiCandidate
    {
        public GeminiContent? Content { get; set; }
    }

    private sealed class GeminiContent
    {
        public List<GeminiPart>? Parts { get; set; }
    }

    private sealed class GeminiPart
    {
        public string? Text { get; set; }
    }
}