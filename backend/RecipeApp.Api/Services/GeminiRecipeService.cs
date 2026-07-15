using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;
using RecipeApp.Api.DTOs;
using RecipeApp.Api.Interfaces;
using RecipeApp.Api.Models.Enums;
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
    IReadOnlyCollection<string> pantryIngredients,
    CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(prompt))
        {
            throw new ArgumentException(
                "Tarif açıklaması zorunludur.",
                nameof(prompt)
            );
        }

        ValidateConfiguration();

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
                            text = BuildPrompt(prompt, pantryIngredients)
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

        var generatedJson = await SendGenerateContentRequestAsync(
            requestBody,
            "Gemini isteği başarısız oldu.",
            "Gemini geçerli bir tarif yanıtı üretmedi.",
            cancellationToken
        );

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

        ValidateConfiguration();

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

        var generatedJson = await SendGenerateContentRequestAsync(
            requestBody,
            "Gemini tarif düzenleme isteği başarısız oldu.",
            "Gemini düzenlenmiş tarif üretmedi.",
            cancellationToken
        );

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
        CancellationToken cancellationToken = default
        )
    {
        if (recipes.Count == 0)
        {
            throw new InvalidOperationException(
                "Haftalık plan oluşturmak için en az bir tarif gereklidir."
            );
        }

        ValidateConfiguration();

        var enabledMealTypes = dto.MealTypes
            .Where(Enum.IsDefined)
            .Distinct()
            .ToHashSet();

        if (enabledMealTypes.Count == 0)
        {
            throw new ArgumentException(
                "En az bir geçerli öğün türü seçilmelidir.",
                nameof(dto.MealTypes)
            );
        }

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
                            text = BuildWeeklyMealPlanPrompt(
                                dto,
                                recipes
                            )
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

        var generatedJson = await SendGenerateContentRequestAsync(
            requestBody,
            "Gemini haftalık plan isteği başarısız oldu.",
            "Gemini geçerli bir haftalık plan üretmedi.",
            cancellationToken
        );

        var generatedItems =
            JsonSerializer.Deserialize<List<AiMealPlanItemDto>>(
                generatedJson,
                _jsonOptions
            ) ?? [];

        var validRecipeIds = recipes
            .Select(recipe => recipe.Id)
            .ToHashSet();

        var days = Math.Clamp(dto.Days, 1, 7);
        var endDate = dto.StartDate.AddDays(days - 1);

        return generatedItems
            .Where(item =>
                validRecipeIds.Contains(item.RecipeId) &&
                enabledMealTypes.Contains(item.MealType) &&
                item.Date >= dto.StartDate &&
                item.Date <= endDate
            )
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

    private async Task<string> SendGenerateContentRequestAsync(
        object requestBody,
        string requestErrorMessage,
        string emptyResponseMessage,
        CancellationToken cancellationToken)
    {
        var endpoint =
            "https://generativelanguage.googleapis.com/v1beta/models/" +
            $"{Uri.EscapeDataString(_options.Model)}:generateContent";

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
                $"{requestErrorMessage} " +
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
                emptyResponseMessage
            );
        }

        return generatedJson;
    }

    public async Task<RecipeAssistantResponseDto> AskRecipeAssistantAsync(
    RecipeDetailDto recipe,
    string question,
    CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(question))
        {
            throw new ArgumentException(
                "Soru zorunludur.",
                nameof(question)
            );
        }

        ValidateConfiguration();

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
                        text = BuildRecipeAssistantPrompt(
                            recipe,
                            question
                        )
                    }
                }
            }
        },
            generationConfig = new
            {
                temperature = 0.4
            }
        };

        var answer = await SendGenerateContentRequestAsync(
            requestBody,
            "Gemini tarif asistanı isteği başarısız oldu.",
            "Gemini geçerli bir cevap üretmedi.",
            cancellationToken
        );

        return new RecipeAssistantResponseDto
        {
            Answer = answer.Trim()
        };
    }

    public async Task<NutritionEstimateDto> EstimateNutritionAsync(
    RecipeDetailDto recipe,
    CancellationToken cancellationToken = default)
    {
        ValidateConfiguration();

        if (recipe.Servings < 1)
        {
            throw new ArgumentException(
                "Tarifin porsiyon sayısı geçerli olmalıdır.",
                nameof(recipe)
            );
        }

        if (recipe.Ingredients.Count == 0)
        {
            throw new ArgumentException(
                "Besin değeri hesaplamak için tarifte malzeme bulunmalıdır.",
                nameof(recipe)
            );
        }

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
                        text = BuildNutritionEstimatePrompt(recipe)
                    }
                }
            }
        },
            generationConfig = new
            {
                temperature = 0.1,
                responseMimeType = "application/json",
                responseSchema = CreateNutritionEstimateSchema()
            }
        };

        var generatedJson = await SendGenerateContentRequestAsync(
            requestBody,
            "Gemini besin değeri isteği başarısız oldu.",
            "Gemini geçerli besin değerleri üretmedi.",
            cancellationToken
        );

        var nutrition = JsonSerializer.Deserialize<NutritionEstimateDto>(
            generatedJson,
            _jsonOptions
        );

        if (nutrition == null)
        {
            throw new InvalidOperationException(
                "Besin değeri yanıtı okunamadı."
            );
        }

        nutrition.CaloriesPerServing =
            Math.Max(0, nutrition.CaloriesPerServing);

        nutrition.ProteinGramsPerServing =
            Math.Max(0, nutrition.ProteinGramsPerServing);

        nutrition.CarbohydrateGramsPerServing =
            Math.Max(0, nutrition.CarbohydrateGramsPerServing);

        nutrition.FatGramsPerServing =
            Math.Max(0, nutrition.FatGramsPerServing);

        nutrition.IsEstimated = true;

        return nutrition;
    }


    private void ValidateConfiguration()
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            throw new InvalidOperationException(
                "Gemini API anahtarı yapılandırılmamış."
            );
        }

        if (string.IsNullOrWhiteSpace(_options.Model))
        {
            throw new InvalidOperationException(
                "Gemini model bilgisi yapılandırılmamış."
            );
        }
    }

    private static string BuildPrompt(
        string userPrompt,
        IReadOnlyCollection<string> pantryIngredients)
    {
        var cleanedIngredients = pantryIngredients
            .Where(ingredient => !string.IsNullOrWhiteSpace(ingredient))
            .Select(ingredient => ingredient.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var pantryText = cleanedIngredients.Count > 0
            ? string.Join(", ", cleanedIngredients)
            : "Kullanıcı belirli bir malzeme belirtmedi.";

        return $"""
        Kullanıcının isteğine göre eksiksiz ve uygulanabilir bir yemek
        tarifi oluştur.

        Kullanıcı isteği:
        {userPrompt.Trim()}

        Kullanıcının evinde bulunan malzemeler:
        {pantryText}

        Kurallar:
        - Yanıt dili Türkçe olsun.
        - Başlık kısa ve anlaşılır olsun.
        - Açıklama en fazla 2-3 cümle olsun.
        - Hazırlık ve pişirme süreleri dakika cinsinden tam sayı olsun.
        - Porsiyon en az 1 olsun.
        - Kullanıcının evindeki malzemeleri mümkün olduğunca kullan.
        - Gerekli olan ek temel malzemeleri ayrıca ekleyebilirsin.
        - Evde bulunmayan malzemeleri gereksiz yere çoğaltma.
        - Her malzemenin adı ve miktarı ayrı alanlarda yer alsın.
        - Yapılış adımları açık, sıralı ve uygulanabilir olsun.
        - StepNumber değerleri 1'den başlayarak ardışık ilerlesin.
        - Görsel URL'si üretme; imageUrl boş string olsun.
        """;
    }

    private static string BuildWeeklyMealPlanPrompt(
        GenerateWeeklyMealPlanDto dto,
        IReadOnlyCollection<RecipeAiOptionDto> recipes)
    {
        var days = Math.Clamp(dto.Days, 1, 7);
        var endDate = dto.StartDate.AddDays(days - 1);

        var enabledMealTypes = dto.MealTypes
            .Where(Enum.IsDefined)
            .Distinct()
            .ToList();

        var mealTypes = enabledMealTypes.Select(type =>
            $"{(int)type} = {GetMealTypeLabel(type)}"
        );

        var excludedIngredients =
            dto.ExcludedIngredients.Count > 0
                ? string.Join(", ", dto.ExcludedIngredients)
                : "Yok";

        var allergies =
            dto.Allergies.Count > 0
                ? string.Join(", ", dto.Allergies)
                : "Yok";

        var notes =
            string.IsNullOrWhiteSpace(dto.Notes)
                ? "Ek not yok."
                : dto.Notes.Trim();

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
            Kullanıcının mevcut tariflerinden kişisel bir yemek planı oluştur.

            Başlangıç tarihi:
            {dto.StartDate:yyyy-MM-dd}

            Bitiş tarihi:
            {endDate:yyyy-MM-dd}

            Gün sayısı:
            {days}

            Hedef:
            {GetGoalLabel(dto.Goal)}

            Kişi sayısı:
            {dto.Servings}

            Bütçe:
            {GetBudgetLabel(dto.Budget)}

            Maksimum hazırlama süresi:
            {dto.MaxPrepTime} dakika

            Kullanılacak öğün türleri:
            {string.Join(", ", mealTypes)}

            Kullanıcının sevmediği malzemeler:
            {excludedIngredients}

            Alerjiler:
            {allergies}

            Ek notlar:
            {notes}

            Kullanılabilecek tarifler:
            {string.Join("\n---\n", recipeLines)}

            Kurallar:
            - Yalnızca verilen tarif ID değerlerini kullan.
            - Yeni tarif veya hayali ID üretme.
            - Plan belirtilen tarih aralığında olsun.
            - Her gün için yalnızca seçilmiş öğün türlerini kullan.
            - Her gün ve öğün türü için yalnızca bir tarif seç.
            - Kullanıcının hedefini, bütçesini ve süre sınırını dikkate al.
            - Alerjen veya hariç tutulan malzeme içeren tarifleri seçme.
            - Maksimum hazırlama süresini aşan tarifleri mümkünse seçme.
            - Tarifleri mümkün olduğunca dengeli ve çeşitli dağıt.
            - Aynı tarifi gereksiz yere art arda kullanma.
            - Kişi sayısı tercihini planlama kararında dikkate al.
            """;
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
            - imageUrl boş string olabilir; mevcut görsel backend tarafından
              korunacak.
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
                                description =
                                    "Malzemenin miktarı ve ölçü birimi."
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
                                description =
                                    "Yapılış adımının açıklaması."
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
                        description =
                            "Öğün tarihi, YYYY-MM-DD formatında."
                    },
                    mealType = new
                    {
                        type = "integer",
                        description =
                            "Öğün türü: 1 kahvaltı, 2 öğle, " +
                            "3 akşam, 4 atıştırmalık.",
                        minimum = 1,
                        maximum = 4
                    },
                    recipeId = new
                    {
                        type = "string",
                        description =
                            "Verilen tariflerden birinin GUID değeri."
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
                ingredient.Amount =
                    ingredient.Amount?.Trim() ?? string.Empty;

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

    private static string GetMealTypeLabel(MealType mealType)
    {
        return mealType switch
        {
            MealType.Breakfast => "Kahvaltı",
            MealType.Lunch => "Öğle Yemeği",
            MealType.Dinner => "Akşam Yemeği",
            MealType.Snack => "Ara Öğün",
            _ => mealType.ToString()
        };
    }

    private static string GetGoalLabel(string goal)
    {
        return goal switch
        {
            "lose_weight" => "Kilo vermek",
            "gain_muscle" => "Kas yapmak",
            "healthy" => "Sağlıklı beslenmek",
            "gain_weight" => "Kilo almak",
            "mediterranean" => "Akdeniz diyeti",
            "vegetarian" => "Vejetaryen",
            "vegan" => "Vegan",
            _ => goal
        };
    }

    private static string GetBudgetLabel(string budget)
    {
        return budget switch
        {
            "low" => "Düşük",
            "medium" => "Orta",
            "high" => "Yüksek",
            _ => budget
        };
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
    private static string BuildRecipeAssistantPrompt(
    RecipeDetailDto recipe,
    string question)
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
        Sen Cooksy uygulamasındaki yardımcı bir yemek asistanısın.

        Kullanıcı aşağıdaki tarif hakkında bir soru soruyor.

        Tarif:
        Başlık: {recipe.Title}
        Açıklama: {recipe.Description}
        Hazırlık süresi: {recipe.PrepTime} dakika
        Pişirme süresi: {recipe.CookTime} dakika
        Porsiyon: {recipe.Servings}

        Malzemeler:
        {string.Join("\n", ingredients)}

        Yapılış adımları:
        {string.Join("\n", steps)}

        Kullanıcı sorusu:
        {question.Trim()}

        Kurallar:
        - Türkçe cevap ver.
        - Cevap kısa, açık ve uygulanabilir olsun.
        - Tarifte olmayan bir bilgiyi kesinmiş gibi söyleme.
        - Malzeme alternatifi veriyorsan miktarı yaklaşık olarak belirt.
        - Gıda güvenliğiyle ilgili risk varsa açıkça uyar.
        - Kullanıcı tarifi değiştirmek istiyorsa nasıl değiştirebileceğini açıkla,
          ancak tarifi otomatik olarak yeniden yazma.
        - Sağlık veya alerji konusunda kesin tıbbi iddialarda bulunma.
        """;
    }

    private static string BuildNutritionEstimatePrompt(
    RecipeDetailDto recipe)
    {
        var ingredients = recipe.Ingredients
            .Select(ingredient =>
                $"- {ingredient.Name}: {ingredient.Amount}"
            );

        return $"""
        Aşağıdaki tarifin yaklaşık besin değerlerini hesapla.

        Tarif adı:
        {recipe.Title}

        Toplam porsiyon:
        {recipe.Servings}

        Malzemeler:
        {string.Join("\n", ingredients)}

        İstenen değerler porsiyon başına olmalıdır:
        - Kalori, kcal cinsinden tam sayı
        - Protein, gram cinsinden
        - Karbonhidrat, gram cinsinden
        - Yağ, gram cinsinden

        Kurallar:
        - Tüm malzemelerin toplam besin değerini yaklaşık hesapla.
        - Toplam değerleri porsiyon sayısına böl.
        - Negatif değer üretme.
        - Kaloriyi tam sayı olarak döndür.
        - Makro değerleri en fazla iki ondalık basamakla döndür.
        - Marka veya kesin gramaj bilinmiyorsa yaygın ortalama değerleri kullan.
        - Bu hesaplamanın tahmini olduğunu kabul et.
        """;
    }

    private static object CreateNutritionEstimateSchema()
    {
        return new
        {
            type = "object",
            properties = new
            {
                caloriesPerServing = new
                {
                    type = "integer",
                    description = "Porsiyon başına tahmini kalori.",
                    minimum = 0
                },
                proteinGramsPerServing = new
                {
                    type = "number",
                    description = "Porsiyon başına protein gramı.",
                    minimum = 0
                },
                carbohydrateGramsPerServing = new
                {
                    type = "number",
                    description = "Porsiyon başına karbonhidrat gramı.",
                    minimum = 0
                },
                fatGramsPerServing = new
                {
                    type = "number",
                    description = "Porsiyon başına yağ gramı.",
                    minimum = 0
                },
                isEstimated = new
                {
                    type = "boolean",
                    description = "Değerlerin tahmini olduğunu belirtir."
                }
            },
            required = new[]
            {
            "caloriesPerServing",
            "proteinGramsPerServing",
            "carbohydrateGramsPerServing",
            "fatGramsPerServing",
            "isEstimated"
        }
        };
    }
}