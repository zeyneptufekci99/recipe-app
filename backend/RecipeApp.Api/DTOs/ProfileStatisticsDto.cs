namespace RecipeApp.Api.DTOs;

public class ProfileStatisticsDto
{
    public int RecipeCount { get; set; }

    public int FavoriteCount { get; set; }

    public int ImportedRecipeCount { get; set; }

    public int ManualRecipeCount { get; set; }

    public string? MostUsedCategory { get; set; }
}