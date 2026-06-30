using RecipeApp.Api.Common;

namespace RecipeApp.Api.Models;

public class Ingredient : BaseEntity
{
    public Guid RecipeId { get; set; } 
    public string Name { get; set; } = string.Empty;
    public string? Amount { get; set; }
    public Recipe Recipe { get; set; } = null!;
}
