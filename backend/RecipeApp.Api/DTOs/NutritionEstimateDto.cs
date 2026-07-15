namespace RecipeApp.Api.DTOs;

public class NutritionEstimateDto
{
    public int CaloriesPerServing { get; set; }

    public decimal ProteinGramsPerServing { get; set; }

    public decimal CarbohydrateGramsPerServing { get; set; }

    public decimal FatGramsPerServing { get; set; }

    public bool IsEstimated { get; set; } = true;
}