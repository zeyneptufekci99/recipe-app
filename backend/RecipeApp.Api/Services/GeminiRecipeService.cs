using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;
using RecipeApp.Api.Options;
using RecipeApp.Api.Models.Enums;

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

    public async Task<ImportedRecipeDto> TransformRecipeAsync(
    RecipeDetailDto recipe,
    string instruction,
    CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(instruction))
        {
            throw new ArgumentException(
                "Tarif düzenleme talebi zorunludur.",
                nameof(instruction)
            );
        }

        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            throw new InvalidOperationException(
                "Gemini API anahtarı yapılandırılmamış."
            );
        }

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
                        text = BuildTransformRecipePrompt(
                            recipe,
                            instruction
                        )
                    }
                }
            }
        },
            generationConfig = new
            {
                temperature = 0.3,
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
                $"Gemini tarif düzenleme isteği başarısız oldu. " +
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
                "Gemini düzenlenmiş tarif üretmedi."
            );
        }

        var transformedRecipe =
            JsonSerializer.Deserialize<ImportedRecipeDto>(
                generatedJson,
                _jsonOptions
            );

        if (transformedRecipe == null)
        {
            throw new InvalidOperationException(
                "Düzenlenmiş tarif yanıtı okunamadı."
            );
        }

        NormalizeRecipe(transformedRecipe);

        // Mevcut görsel korunur.
        transformedRecipe.ImageUrl = recipe.ImageUrl ?? string.Empty;

        return transformedRecipe;
    }

    public async Task<List<AiMealPlanItemDto>> GenerateWeeklyMealPlanAsync(
    GenerateWeeklyMealPlanDto dto,
    IReadOnlyCollection<RecipeAiOptionDto> recipes,
    CancellationToken cancellationToken = default)
    {
        if (recipes.Count == 0)
        {
            throw new InvalidOperationException(
                "Haftalık plan oluşturmak için en az bir tarif gereklidir."
            );
        }

        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            throw new InvalidOperationException(
                "Gemini API anahtarı yapılandırılmamış."
            );
        }

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
                        text = BuildWeeklyMealPlanPrompt(dto, recipes)
                    }
                }
            }
        },
            generationConfig = new
            {
                temperature = 0.3,
                responseMimeType = "application/json",
                responseSchema = CreateWeeklyMealPlanSchema()
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
                $"Gemini haftalık plan isteği başarısız oldu. " +
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
                "Gemini geçerli bir haftalık plan üretmedi."
            );
        }

        var generatedItems =
            JsonSerializer.Deserialize<List<AiMealPlanItemDto>>(
                generatedJson,
                _jsonOptions
            ) ?? [];

        var validRecipeIds = recipes
            .Select(recipe => recipe.Id)
            .ToHashSet();

        var enabledMealTypes = GetEnabledMealTypes(dto);

        return generatedItems
            .Where(item =>
                validRecipeIds.Contains(item.RecipeId) &&
                enabledMealTypes.Contains(item.MealType) &&
                item.Date >= dto.StartDate &&
                item.Date <= dto.StartDate.AddDays(6))
            .GroupBy(item => new
            {
                item.Date,
                item.MealType
            })
            .Select(group => group.First())
            .OrderBy(item => item.Date)
            .ThenBy(item => item.MealType)
            .ToList();
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

    private static string BuildWeeklyMealPlanPrompt(
    GenerateWeeklyMealPlanDto dto,
    IReadOnlyCollection<RecipeAiOptionDto> recipes)
    {
        var mealTypes = GetEnabledMealTypes(dto)
            .Select(type => $"{(int)type} = {type}");

        var recipeLines = recipes.Select(recipe =>
            $"""
        Id: {recipe.Id}
        Başlık: {recipe.Title}
        Kategori: {recipe.Category}
        Hazırlık: {recipe.PrepTime} dakika
        Pişirme: {recipe.CookTime} dakika
        Porsiyon: {recipe.Servings}
        Zorluk: {recipe.Difficulty}
        """
        );

        return $"""
        Kullanıcının mevcut tariflerinden 7 günlük bir yemek planı oluştur.

        Başlangıç tarihi:
        {dto.StartDate:yyyy-MM-dd}

        Bitiş tarihi:
        {dto.StartDate.AddDays(6):yyyy-MM-dd}

        Kullanıcı tercihi:
        {dto.Preference.Trim()}

        Kullanılacak öğün türleri:
        {string.Join(", ", mealTypes)}

        Kullanılabilecek tarifler:
        {string.Join("\n---\n", recipeLines)}

        Kurallar:
        - Yalnızca verilen tarif ID değerlerini kullan.
        - Yeni tarif veya hayali ID üretme.
        - Plan 7 günlük tarih aralığında olsun.
        - Her gün için yalnızca seçili öğün türlerini kullan.
        - Aynı gün ve aynı öğün türünde yalnızca bir tarif olsun.
        - Tarifleri mümkün olduğunca dengeli ve çeşitli dağıt.
        - Kullanıcının tercihine uygun seçim yap.
        - Aynı tarifi gereksiz yere art arda kullanma.
        """;
    }

    private static object CreateWeeklyMealPlanSchema()
    {
        return new
        {
            type = "array",
            items = new
            {
                type = "object",
                properties = new
                {
                    date = new
                    {
                        type = "string",
                        format = "date",
                        description = "Öğün tarihi, YYYY-MM-DD formatında."
                    },
                    mealType = new
                    {
                        type = "integer",
                        description =
                            "Öğün türü: 1 kahvaltı, 2 öğle, 3 akşam, 4 atıştırmalık.",
                        minimum = 1,
                        maximum = 4
                    },
                    recipeId = new
                    {
                        type = "string",
                        description = "Verilen tariflerden birinin GUID değeri."
                    }
                },
                required = new[]
                {
                "date",
                "mealType",
                "recipeId"
            }
            }
        };
    }

    private static HashSet<MealType> GetEnabledMealTypes(
        GenerateWeeklyMealPlanDto dto)
    {
        var mealTypes = new HashSet<MealType>();

        if (dto.IncludeBreakfast)
            mealTypes.Add(MealType.Breakfast);

        if (dto.IncludeLunch)
            mealTypes.Add(MealType.Lunch);

        if (dto.IncludeDinner)
            mealTypes.Add(MealType.Dinner);

        if (dto.IncludeSnack)
            mealTypes.Add(MealType.Snack);

        return mealTypes;
    }

    private static string BuildTransformRecipePrompt(
    RecipeDetailDto recipe,
    string instruction)
    {
        var ingredients = recipe.Ingredients
            .Select(ingredient =>
                $"- {ingredient.Name}: {ingredient.Amount}"
            );

        var steps = recipe.Steps
            .OrderBy(step => step.StepNumber)
            .Select(step =>
                $"{step.StepNumber}. {step.Description}"
            );

        return $"""
        Aşağıdaki mevcut tarifi kullanıcının talebine göre düzenle.

        Kullanıcı talebi:
        {instruction.Trim()}

        Mevcut tarif:

        Başlık:
        {recipe.Title}

        Açıklama:
        {recipe.Description}

        Hazırlık süresi:
        {recipe.PrepTime} dakika

        Pişirme süresi:
        {recipe.CookTime} dakika

        Porsiyon:
        {recipe.Servings}

        Malzemeler:
        {string.Join("\n", ingredients)}

        Yapılış adımları:
        {string.Join("\n", steps)}

        Kurallar:
        - Yanıt dili Türkçe olsun.
        - Kullanıcının talebini eksiksiz uygula.
        - Gereksiz değişiklik yapma.
        - Malzeme miktarlarını yeni porsiyona göre hesapla.
        - Malzeme adı ile miktarını ayrı alanlarda döndür.
        - Adımları yeni tarife göre güncelle.
        - StepNumber değerleri 1'den başlayarak ardışık olsun.
        - imageUrl boş string olabilir; mevcut görsel backend tarafından korunacak.
        """;
    }
}